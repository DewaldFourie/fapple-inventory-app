const { Error } = require("mongoose");
const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
    // get details of categories and items count (in parallel)
    const [
        numCategories,
        numItems,
    ] = await Promise.all([
        Category.countDocuments({}).exec(),
        Item.countDocuments({}).exec(),
    ])

    res.render("index", {
        title: "Fapple Home",
        category_count: numCategories,
        item_count: numItems,
    });
});

//Display list of all the Categories
exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, "title description")
        .sort({ title: -1 })
        .exec();

    res.render("category_list", { title: "Category List", category_list: allCategories })
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
    // Get details of category and all associated items (in parallel)
    const [category, itemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "title description").sort({ title: 1 }).exec()
    ]);

    if (category === null) {
        // No results
        const err = new Error("Category not found.");
        err.status = 404;
        return next(err);
    }

    res.render("category_detail", {
        title: "Category Details",
        category: category,
        category_items: itemsInCategory,
    })
});

// Display Category create form on GET
exports.category_create_get = (req, res, next) => {
    res.render("category_form", { title: "Create Category" });
};

// handle Category create on post
exports.category_create_post = [
    // validate and sanitize the Title field
    body("cat_title", "Category Title must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("cat_description")
        .trim()
        .isLength({ min: 10 })
        .withMessage("Description must contain at least 10 characters"),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a category object with escaped and trimmed data
        const category = new Category({
            title: req.body.cat_title,
            description: req.body.cat_description,
        });

        if (!errors.isEmpty()) {
            //There are errors. Render form again with sanitized values/err msgs
            res.render("category_form", {
                title: "Create Category",
                category: category,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid

            // save category
            await category.save()
            // Redirect to new Category record
            res.redirect(category.url);
        }
    }),
];

// Display Category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category delete GET");
});

// handle Category delete on post
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category delete POST");
});

// Display Category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category update GET");
});

// handle Category update on post
exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category update POST");
});