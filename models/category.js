const mongoose  = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    title: { type: String, required: true, maxLength: 50 },
    description: { type: String, required: true, maxLength: 100 },
    image: { type: String, required: true }
});

// Virtual for category's URL 
CategorySchema.virtual("url").get(function () {
    return `/catalog/category/${this.id}`;
});

// Export Model
module.exports = mongoose.model("Category", CategorySchema);