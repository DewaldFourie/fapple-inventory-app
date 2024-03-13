const mongoose  = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({ 
    title: { type: String, required: true, maxLength: 50 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    count: { type: Number, required: true },
    image: { type: String, required: true },
});

// virtual for Item's URL
ItemSchema.virtual("url").get(function () {
    return `/catalog/item/${this.id}`;
});

// Export Model 
module.exports = mongoose.model("Item", ItemSchema);