const express = require('express');
const categoryController = require('../controllers/category.controller');
const categoryValidator = require('../validations/category.validator');
const validate = require('../middlewares/validate.middlewars');
const router = express.Router();

router.post('/create', categoryValidator.createCategoryValidator, validate, categoryController.createCategory);

router.get('/getListCategories', categoryController.getListCategories);

router.get('/getCategoryById/:categoryId', categoryController.getCategoryById);

router.put('/updateCategoryById/:categoryId', categoryController.updateCategoryById);

router.delete('/deleteCategoryById/:categoryId', categoryController.deleteCategoryById);

module.exports = router;
