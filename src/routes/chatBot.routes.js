const express = require("express");
const chatBotController = require("../controllers/bot.controller");

const router = express.Router();

router.get("/bootstrap", chatBotController.getBootstrap);

router.post("/", chatBotController.handleUserMessage);

module.exports = router;
