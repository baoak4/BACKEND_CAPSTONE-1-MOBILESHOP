const { body, param } = require("express-validator");

class ProductValidator {
    createProductValidator = [
        body("name")
            .notEmpty().withMessage("Tên sản phẩm là bắt buộc")
            .trim()
            .isLength({ min: 1, max: 200 }).withMessage("Tên sản phẩm từ 1 đến 200 ký tự"),
        body("price")
            .notEmpty().withMessage("Giá là bắt buộc")
            .isFloat({ min: 0 }).withMessage("Giá phải là số không âm"),
        body("categories")
            .notEmpty().withMessage("Danh mục là bắt buộc")
            .isMongoId().withMessage("Danh mục không hợp lệ"),
        body("brand").optional().trim().isString().withMessage("Brand phải là chuỗi"),
        body("productModel").optional().trim().isString().withMessage("productModel phải là chuỗi"),
        body("description").optional().trim().isString().withMessage("description phải là chuỗi"),
        body("images").optional().isArray().withMessage("images phải là mảng"),
        body("variants").optional().isArray().withMessage("variants phải là mảng"),
        body("os").optional().trim().isString().withMessage("os phải là chuỗi"),
        body("chipset").optional().trim().isString().withMessage("chipset phải là chuỗi"),
        body("screen").optional().trim().isString().withMessage("screen phải là chuỗi"),
        body("batteryMah").optional().isInt({ min: 0 }).withMessage("batteryMah phải là số nguyên không âm"),
        body("cameraMainMp").optional().isFloat({ min: 0 }).withMessage("cameraMainMp phải là số không âm"),
        body("releaseYear").optional().isInt({ min: 1900, max: 2100 }).withMessage("releaseYear phải là năm hợp lệ"),
    ];

    getListProductsValidator = [
        body("search").optional().trim().isString().withMessage("search phải là chuỗi"),
        body("page")
            .optional()
            .toInt()
            .isInt({ min: 1 }).withMessage("page phải là số nguyên >= 1"),
        body("limit")
            .optional()
            .toInt()
            .isInt({ min: 1, max: 100 }).withMessage("limit phải từ 1 đến 100"),
        body("sort_by")
            .optional()
            .toInt()
            .isIn([-1, 1]).withMessage("sort_by phải là -1 (mới nhất) hoặc 1 (cũ nhất)"),
        body("sort_by_price")
            .optional()
            .toInt()
            .isIn([-1, 1]).withMessage("sort_by_price phải là -1 (cao->thấp) hoặc 1 (thấp->cao)"),
        body("category_type").optional().isMongoId().withMessage("category_type phải là MongoId hợp lệ"),
        body("user").optional().isMongoId().withMessage("user phải là MongoId hợp lệ"),
    ];

    getProductByIdValidator = [
        param("productId")
            .notEmpty().withMessage("productId là bắt buộc")
            .isMongoId().withMessage("productId không hợp lệ"),
    ];

    updateProductByIdValidator = [
        param("productId")
            .notEmpty().withMessage("productId là bắt buộc")
            .isMongoId().withMessage("productId không hợp lệ"),
        body("name")
            .optional()
            .trim()
            .isLength({ min: 1, max: 200 }).withMessage("Tên sản phẩm từ 1 đến 200 ký tự"),
        body("price")
            .optional()
            .isFloat({ min: 0 }).withMessage("Giá phải là số không âm"),
        body("categories").optional().isMongoId().withMessage("Danh mục không hợp lệ"),
        body("brand").optional().trim().isString().withMessage("brand phải là chuỗi"),
        body("productModel").optional().trim().isString().withMessage("productModel phải là chuỗi"),
        body("description").optional().trim().isString().withMessage("description phải là chuỗi"),
        body("images").optional().isArray().withMessage("images phải là mảng"),
        body("variants").optional().isArray().withMessage("variants phải là mảng"),
        body("os").optional().trim().isString().withMessage("os phải là chuỗi"),
        body("chipset").optional().trim().isString().withMessage("chipset phải là chuỗi"),
        body("screen").optional().trim().isString().withMessage("screen phải là chuỗi"),
        body("batteryMah").optional().isInt({ min: 0 }).withMessage("batteryMah phải là số nguyên không âm"),
        body("cameraMainMp").optional().isFloat({ min: 0 }).withMessage("cameraMainMp phải là số không âm"),
        body("releaseYear").optional().isInt({ min: 1900, max: 2100 }).withMessage("releaseYear phải là năm hợp lệ"),
    ];

    deleteProductByIdValidator = [
        param("productId")
            .notEmpty().withMessage("productId là bắt buộc")
            .isMongoId().withMessage("productId không hợp lệ"),
    ];
}

module.exports = new ProductValidator();
