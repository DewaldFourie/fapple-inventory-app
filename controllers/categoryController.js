const { Error } = require("mongoose");
const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const PASSWORD = 'admin';

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
        title: "Welcome to Fapple",
        category_count: numCategories,
        item_count: numItems,
    });
});

//Display list of all the Categories
exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, "title description image")
        .sort({ title: -1 })
        .exec();

    res.render("category_list", { title: "All Categories", category_list: allCategories })
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
    // Get details of category and all associated items (in parallel)
    const [category, itemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "title description image").sort({ title: 1 }).exec()
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
        .isLength({ min: 3 }),
    body("cat_description")
        .trim()
        .isLength({ min: 10 })
        .withMessage("Description must contain at least 10 characters")
        .escape(),
    body("cat_image")
        .trim()
        .isLength({ min:1 })
        .withMessage("URL must not be empty")
        .isURL()
        .withMessage("Must enter a valid URL"),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a category object with escaped and trimmed data
        const category = new Category({
            title: req.body.cat_title,
            description: req.body.cat_description,
            image: req.body.cat_image
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
    // get details of category and all it's items
    const [category, allItemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "title description").sort({ title: 1 }).exec(),
    ]);

    if (category === null) {
        //no results
        res.redirect("/catalog/categories");
    }

    res.render("category_delete", {
        title: "Delete Category",
        category: category,
        category_items: allItemsInCategory,
    });
});

// handle Category delete on post
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    // Get details of category and all it's items
    const [category, allItemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "title description").exec(),
    ]);

    if (allItemsInCategory.length > 0) {
        // Category has Items. Render in same way as get route
        res.render("category_delete", {
            title: "Delete Category",
            category: category,
            category_items: allItemsInCategory,
        });
        return;
    } 
    else {
        // Category has no items. 
        // ask a security password in order to delete 
        const { password } = req.body;
        // check if password matches 
        if ( password === PASSWORD ) {
            // Delete object and redirect to list of categories if password matches
            await Category.findByIdAndDelete(req.body.categoryid);
            res.redirect("/catalog/categories");
        }
        else {
            // password is incorrect. redirect back to delete form without deleting
            res.render("category_delete", {
                title: "Delete Category",
                category: category,
                category_items: allItemsInCategory,
                errMsg: "Incorrect Password. Try Again.",
            });
        }
        

    }
});

// Display Category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
    // get category for form
    const category = await (Category.findById(req.params.id).exec())

    const updateState = true

    if (category===null) {
        // no results
        err = new Error("Category not found");
        err.status = 404;
        return next(err)
    }

    res.render("category_form", {
        title: "Update Category",
        category: category,
        updateState: updateState,
    })
});

// handle Category update on post
exports.category_update_post = [
    // validate and sanitize fields
    body("cat_title", "Category name must contain at least 3 characters")
        .trim()
        .isLength({ min:3 }),
    body("cat_description")
        .trim()
        .isLength({ min: 10 })
        .withMessage("Description must contain at least 10 characters")
        .escape(),
    body("cat_image")
        .trim()
        .isLength({ min:1 })
        .withMessage("URL must not be empty")
        .isURL()
        .withMessage("Must enter a valid URL"),

        //Process request after validation and sanitization
        asyncHandler(async (req, res, next) => {
            const errors = validationResult(req)

            const updateState = true

            // create a category object with escaped and trimmed data adn old ID
            const category = new Category({
                title: req.body.cat_title,
                description: req.body.cat_description,
                image: req.body.cat_image,
                _id: req.params.id, //---- THIS IS REQUIRED OR A NEW ID WILL BE ASSIGNED ----//
            });

            if (!errors.isEmpty()) {
                // There are errors. Render form again with sanitized val/err msgs
                res.render("category_form", {
                    title: "Update Category",
                    category: category,
                    updateState: updateState,
                    errors: errors.array(),
                });
                return
            }
            else {
                //data from form is valid. Do security check
                const { password } = req.body
                // check if password matches
                if ( password === PASSWORD ) {
                    // Update object and redirect to updated category
                    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
                    // redirect to category detail page
                    res.redirect(updatedCategory.url)
                }
                else {
                    // password is incorrect. redirect to update form without updating
                    res.render("category_form", {
                        title: "Update Category",
                        category: category,
                        updateState: updateState,
                        errMsg: "Incorrect Password. Try Again"
                    })
                }
            }
        })
]