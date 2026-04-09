const { getOpenAIClient, openAiModel } = require("../utils/open_ai");
const { SYSTEM_PROMPT } = require("../utils/prompt");
const productModel = require("../models/product.model");

function escapeRegex(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildProductFilter(queryData) {
    const q = queryData || {};
    const conditions = [];

    if (q.brand && String(q.brand).trim()) {
        conditions.push({
            brand: { $regex: escapeRegex(String(q.brand).trim()), $options: "i" },
        });
    }
    if (q.name && String(q.name).trim()) {
        conditions.push({
            name: { $regex: escapeRegex(String(q.name).trim()), $options: "i" },
        });
    }
    if (q.productModel && String(q.productModel).trim()) {
        conditions.push({
            productModel: {
                $regex: escapeRegex(String(q.productModel).trim()),
                $options: "i",
            },
        });
    }

    const price = {};
    if (q.priceRange != null && typeof q.priceRange === "object") {
        if (q.priceRange.min != null && !Number.isNaN(Number(q.priceRange.min))) {
            price.$gte = Number(q.priceRange.min);
        }
        if (q.priceRange.max != null && !Number.isNaN(Number(q.priceRange.max))) {
            price.$lte = Number(q.priceRange.max);
        }
    }
    if (Object.keys(price).length > 0) {
        conditions.push({ price });
    }

    const elem = {};
    if (q.color && String(q.color).trim()) {
        elem.color = { $regex: escapeRegex(String(q.color).trim()), $options: "i" };
    }
    if (q.ramGb != null && !Number.isNaN(Number(q.ramGb))) {
        elem.ramGb = Number(q.ramGb);
    }
    if (q.storageGb != null && !Number.isNaN(Number(q.storageGb))) {
        elem.storageGb = Number(q.storageGb);
    }
    if (Object.keys(elem).length > 0) {
        conditions.push({ variants: { $elemMatch: elem } });
    }

    if (conditions.length === 0) {
        return {};
    }
    return conditions.length === 1 ? conditions[0] : { $and: conditions };
}

async function searchProductsByQueryData(queryData, limit = 20) {
    const filter = buildProductFilter(queryData);
    const products = await productModel
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    return products;
}

function normalizeAnalysis(parsed) {
    const validResponseTypes = ["search", "recommend", "compare", "accessory", "supports"];
    if (!parsed.textResponse || !parsed.responseType) {
        throw new Error("Invalid response structure: missing required fields");
    }
    if (!parsed.queryData || typeof parsed.queryData !== "object") {
        parsed.queryData = {};
    }
    if (!validResponseTypes.includes(parsed.responseType)) {
        parsed.responseType = "recommend";
    }
    return parsed;
}

const chatBotService = {
    async analyzeQuery(userMessage) {
        const openai = getOpenAIClient();
        if (!openai) {
            const err = new Error("OPENAI_API_KEY chưa được cấu hình");
            err.statusCode = 503;
            throw err;
        }

        const completion = await openai.chat.completions.create({
            model: openAiModel,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userMessage },
            ],
        });

        const raw = completion.choices[0]?.message?.content;
        if (!raw) {
            throw new Error("Empty response from OpenAI");
        }

        let cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch (e) {
            console.error("Chatbot JSON parse error. Raw:", cleaned.substring(0, 500));
            const err = new Error("Invalid JSON response from AI");
            err.statusCode = 502;
            throw err;
        }

        return normalizeAnalysis(parsed);
    },

    formatProductResponse(products, response) {
        const emptyMsg =
            "Rất tiếc hiện chưa có sản phẩm khớp yêu cầu trên cửa hàng. Bạn thử đổi từ khóa hoặc bộ lọc nhé.";
        return {
            message: "Đã tìm thấy sản phẩm phù hợp.",
            data: {
                content: products,
                textResponse:
                    products.length === 0 ? emptyMsg : response.textResponse,
                responseType: response.responseType,
                queryData: response.queryData,
            },
        };
    },

    handleOtherIntents(analysis) {
        const responseBuilder = {
            textResponse:
                analysis.textResponse || "Mình có thể giúp gì thêm cho bạn?",
            options: [],
            quickActions: [],
        };

        switch (analysis.responseType) {
            case "supports":
                responseBuilder.textResponse =
                    analysis.textResponse || "Bạn cần hỗ trợ về điều gì?";
                responseBuilder.options = [
                    "Tra cứu đơn hàng",
                    "Hướng dẫn đổi trả",
                    "Chính sách bảo hành",
                    "Liên hệ CSKH",
                ];
                break;

            default:
                if (analysis.queryData?.brand) {
                    responseBuilder.textResponse =
                        analysis.textResponse ||
                        `Bạn muốn xem thêm điện thoại ${analysis.queryData.brand} hay phụ kiện?`;
                    responseBuilder.quickActions = [
                        {
                            textResponse: `Phụ kiện ${analysis.queryData.brand}`,
                            action: `accessory:${analysis.queryData.brand}`,
                        },
                        { textResponse: "So sánh máy", action: "compare:hint" },
                        { textResponse: "Bảo hành", action: "support:warranty" },
                    ];
                } else if (analysis.queryData?.priceRange) {
                    responseBuilder.textResponse =
                        analysis.textResponse || "Bạn muốn tiếp tục theo hướng nào?";
                    responseBuilder.options = [
                        "Máy trong ngân sách",
                        "So sánh cùng tầm giá",
                        "Gợi ý phụ kiện đi kèm",
                    ];
                }
                break;
        }

        if (responseBuilder.options.length === 0) {
            responseBuilder.options = [
                "Tìm điện thoại theo nhu cầu",
                "Hướng dẫn mua hàng",
                "Xem khuyến mãi",
            ];
        }

        responseBuilder.quickActions.push(
            { textResponse: "Về trang chủ", action: "navigate:home" },
            { textResponse: "Xem giỏ hàng", action: "navigate:cart" }
        );

        return {
            message: responseBuilder.textResponse,
            data: {
                textResponse: responseBuilder.textResponse,
                options: responseBuilder.options,
                quickActions: responseBuilder.quickActions,
                metadata: analysis.queryData,
            },
        };
    },

    /**
     * Nội dung hiển thị trước khi người dùng gửi tin (không gọi OpenAI).
     */
    getBootstrap() {
        return {
            message: "Lấy nội dung khởi động chatbot thành công",
            data: {
                welcomeTitle: "Xin chào! Mình là trợ lý ảo cửa hàng điện thoại",
                welcomeText:
                    "Mình có thể giúp bạn tìm máy theo hãng/ngân sách, so sánh cấu hình, gợi ý phụ kiện, hoặc trả lời về đặt hàng, bảo hành và đổi trả. Bạn muốn bắt đầu từ đâu?",
                suggestedPrompts: [
                    {
                        id: "find-budget",
                        label: "Tìm máy dưới 10 triệu",
                        message: "Gợi ý điện thoại tốt dưới 10 triệu",
                    },
                    {
                        id: "compare-flagship",
                        label: "So sánh flagship",
                        message: "So sánh iPhone và Samsung flagship mới nhất",
                    },
                    {
                        id: "accessory",
                        label: "Phụ kiện đi kèm",
                        message: "Gợi ý ốp lưng và sạc cho điện thoại",
                    },
                    {
                        id: "warranty",
                        label: "Chính sách bảo hành",
                        message: "Chính sách bảo hành và đổi trả như thế nào?",
                    },
                ],
                quickActions: [
                    { textResponse: "Tra cứu đơn hàng", action: "supports:order" },
                    { textResponse: "Hướng dẫn mua hàng", action: "supports:buy" },
                    { textResponse: "Liên hệ CSKH", action: "supports:contact" },
                ],
                tips: [
                    "Gõ tên máy hoặc hãng (ví dụ: Samsung Galaxy, iPhone 15).",
                    "Có thể nói ngân sách hoặc RAM/bộ nhớ bạn cần.",
                ],
            },
        };
    },

    async handleUserMessage(userMessage) {
        const analysis = await this.analyzeQuery(userMessage);

        if (analysis.responseType === "search") {
            const products = await searchProductsByQueryData(analysis.queryData);
            return this.formatProductResponse(products, analysis);
        }

        return this.handleOtherIntents(analysis);
    },
};

module.exports = chatBotService;
