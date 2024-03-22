const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Category = require("../models/category");

const PASSWORD = 'admin';


//Display list of all the Items
exports.item_list = asyncHandler(async (req, res, next) => {
    const allItems = await Item.find({}, "title category image")
        .sort({ title: 1 })
        .populate("category")
        .exec()

    res.render("item_list", { title: "All Items", item_list: allItems });
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
    body("item_image")
        .trim()
        .isLength({ min: 1 })
        .withMessage("URL must not be empty.")
        .isURL()
        .withMessage("Must enter a valid URL"),

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
            image: req.body.item_image,
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

    // Check if password matches
    const { password } = req.body;
    if ( password === PASSWORD ) {
        // Delete object and redirect to list of items if password matches
        await Item.findByIdAndDelete(req.body.itemid);
        res.redirect("/catalog/items")
    }
    else {
        // password is incorrect, redirect back to delete form without deleting
        const item = await Item.findById(req.params.id).exec()
        res.render("item_delete", {
            title: "Delete Item",
            item: item,
            errMsg: "Incorrect Password. Try Again.",
        });
    }


});

// Display item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
    // Get item and categories for form
    const [item, allCategories] = await Promise.all([
        Item.findById(req.params.id).populate("category").exec(),
        Category.find().sort({ title: 1 }).exec(),
    ]);

    const updateSate = true

    if (item===null) {
        // no results
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    res.render("item_form", {
        title: "Update Item",
        categories: allCategories,
        item: item,
        updateState: updateSate,
    });
});

// handle item update on post
exports.item_update_post = [
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
    body("item_image")
        .trim()
        .isLength({ min: 1 })
        .withMessage("URL must not be empty.")
        .isURL()
        .withMessage("Must enter a valid URL"),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // extract validation errors from request
        const errors = validationResult(req)

        const updateSate = true

        // Create an Item object with escaped/trimmed data and old ID
        const item = new Item({
            title: req.body.item_title,
            category: req.body.item_category,
            description: req.body.item_description,
            price: req.body.item_price,
            count: req.body.item_count,
            image: req.body.item_image,
            _id: req.params.id, // This is required, or a new ID will be assigned!
        });

        if (!errors.isEmpty()) {
            // there are errors. Render form again with sanitized val/err msgs
            const allCategories = await Category.find().sort({ title: 1 }).exec();

            res.render("item_form", {
                title: "Update Item",
                categories: allCategories,
                item: item,
                updateState: updateSate,
                errors: errors.array(),
            });
            return;
        }
        else {
            //data from form is valid. Do security check
            const { password } = req.body
            // check if password matches
            if ( password === PASSWORD ) {
                // Update object and redirect to updated item
                const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
                //redirect to item detail page
                res.redirect(updatedItem.url)
            }
            else {
                const allCategories = await Category.find().sort({ title: 1 }).exec();
                //password is incorrect. redirect back to update form without updating
                res.render("item_form", {
                    title: "Update Item",
                    categories: allCategories,
                    item: item,
                    updateState: updateSate,
                    errMsg: "Incorrect Password. Try Again"
                });
            }
        }
    })
]