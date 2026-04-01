const { body } = require("express-validator");

class CategoryValidator {
    createCategoryValidator = [
        body("name").notEmpty().withMessage("name is require").trim(),
        body("slug").notEmpty().withMessage("slug is require").trim(),
        body("description").optional().trim()
    ];

}

module.exports = new CategoryValidator();
