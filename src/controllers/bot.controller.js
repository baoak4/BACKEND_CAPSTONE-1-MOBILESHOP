const chatBotService = require("../services/chatBot.service");

const ChatBotController = {
    async getBootstrap(req, res, next) {
        try {
            const result = chatBotService.getBootstrap();
            return res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    },

    async handleUserMessage(req, res, next) {
        try {
            const message = req.body?.message;
            if (message == null || !String(message).trim()) {
                const err = new Error("Trường message là bắt buộc");
                err.statusCode = 400;
                return next(err);
            }
            const result = await chatBotService.handleUserMessage(
                String(message).trim()
            );
            return res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    },
};

module.exports = ChatBotController;
