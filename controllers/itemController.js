const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Category = require("../models/category");


//Display list of all the Items
exports.item_list = asyncHandler(async (req, res, next) => {
    const allItems = await Item.find({}, "title category")
        .sort({ title: -1 })
        .populate("category")
        .exec()

    res.render("item_list", { title: "Item List", item_list: allItems });
});

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
    // Get details of item 
    const item = await Item.findById(req.params.id).populate("category").exec()

    if (item === null) {
        // no result
        const err = new Error("Item not found.");
        err.status = 404;
        return next(err)
    }

    res.render("item_detail", {
        title: "Item Details",
        item: item,
    })
});

// Display item create form on GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
    // Get all categories, which we must use to add our item
    const allCategories = await Category.find().sort({ title: 1 }).exec();

    res.render("item_form", {
        title: "Create Item",
        categories: allCategories,
    });
});

// handle item create on post
exports.item_create_post = [
    // validate and sanitize fields
    body("item_title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("item_category", "Category must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("item_description", "Description must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("item_price", "Price must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("item_count", "Item Count must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract validation errors from request
        const errors = validationResult(req)

        // Create an Item object with escaped and trimmed data
        const item = new Item({
            title: req.body.item_title,
            category: req.body.item_category,
            description: req.body.item_description,
            price: req.body.item_price,
            count: req.body.item_count,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/err msgs

            // Get all categories, which we must use to add our item
            const allCategories = await Category.find().sort({ title: 1 }).exec();

            res.render("item_form", {
                title: "Create Item",
                categories: allCategories,
                item: item,
                errors: errors.array(),
            });
        } else {
            // data from form is valid. save item
            await item.save()
            res.redirect(item.url)
        }
    }),
];

// Display item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
    // get details of Item
    const item = await Item.findById(req.params.id).exec()

    if (item===null) {
        // no results
        res.redirect("/catalog/items");
    }

    res.render("item_delete", {
        title: "Delete Item",
        item: item,
    });
});

// handle item delete on post
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    // Delete object and redirect to list of items
    await Item.findByIdAndDelete(req.body.itemid);
    res.redirect("/catalog/items")
});

// Display item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item update GET");
});

// handle item update on post
exports.item_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item update POST");
});