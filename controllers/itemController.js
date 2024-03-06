const Item = require("../models/item");
const asyncHandler = require("express-async-handler");

//Display list of all the Items
exports.item_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item List")
});

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: item Detail: ${req.params.id}`);
});

// Display item create form on GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item create GET");
});

// handle item create on post
exports.item_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item create POST");
});

// Display item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item delete GET");
});

// handle item delete on post
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item delete POST");
});

// Display item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item update GET");
});

// handle item update on post
exports.item_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item update POST");
});