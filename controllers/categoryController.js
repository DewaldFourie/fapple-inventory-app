const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");

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
    res.send(`NOT IMPLEMENTED: Category Detail: ${req.params.id}`);
});

// Display Category create form on GET
exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category create GET");
});

// handle Category create on post
exports.category_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category create POST");
});

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