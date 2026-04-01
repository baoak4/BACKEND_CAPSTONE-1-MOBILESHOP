const express = require('express');
const contentController = require('../controllers/content.controller');
const authMiddleware = require('../middlewares/auth.middlewars');

const router = express.Router();

router.get('/getListContents', contentController.getListContents);

router.get('/getContentById/:contentId', contentController.getContentById);

router.post('/create', authMiddleware, contentController.createContent);

router.put('/updateContentById/:contentId', authMiddleware, contentController.updateContentById);

router.delete('/deleteContentById/:contentId', authMiddleware, contentController.deleteContentById);

module.exports = router;
