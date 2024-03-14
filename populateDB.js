
console.log('This script populates some test items & categories to your database:: Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"');

// Get the arguments passed on command line to access db
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to Connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be Connected?");
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// category[0] will always be the same category, regardless of the order
// in which the elements of promise.all's argument complete.

async function categoryCreate(index, title, description, image) {
    const category = new Category({ title:title, description:description, image: image});
    await category.save();
    categories[index] = category;
    console.log(`Added Category: ${category}`);
}

async function itemCreate(index, title, category, description, price, count, image) {
    const itemDetail = {
        title: title,
        description: description,
        price: price,
        count: count,
        image: image,

    };
    if (category != false) itemDetail.category = category;

    const item = new Item(itemDetail);
    await item.save();
    items[index] = item;
    console.log(`Added Item: ${title}`);
}

async function createCategories() {
    console.log("Adding Categories");
    await Promise.all([
        categoryCreate(
            0, 
            "iPhone", 
            "The latest smartphone collection that Fapple has to offer.",
            "https://www.istore.co.za/media/catalog/product/i/p/iphone_14_pro_deep_purple_pdp_image_position-1a__eaen_1_1_1.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700",
        ),
        categoryCreate(
            1,
            "iPad",
            "The latest iPads collection that Fapple has to offer.",
            "https://www.istore.co.za/media/catalog/product/i/p/ipad_air_cellular_starlight_pdp_image_position-1b_5g__wwen_1_1.png?format=jpeg",
        ),
        categoryCreate(
            2, 
            "Mac", 
            "The latest MacBook laptop range that Fapple has to offer.",
            "https://www.istore.co.za/media/catalog/product/m/a/macbook_air_15_in_m3_midnight_pdp_image_position_1__wwen_2.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700",
        ),
        categoryCreate(
            3, 
            "Fapple Watch", 
            "The latest smart watches that Fapple has to offer.",
            "https://www.istore.co.za/media/catalog/product/a/p/apple_watch_series_9_lte_41mm_gold_stainless_steel_clay_sport_band_pdp_image_position-1__wwen.jpg_2_1.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700",
        ),
    ]);
}

async function createItems() {
    console.log("Adding Items");
    await Promise.all([
        itemCreate(
            0,
            "iPhone 12",
            categories[0],
            "The iPhone 12 combines sleek design with powerful performance, boasting a stunning Super Retina XDR display for vibrant visuals. Its A14 Bionic chip delivers lightning-fast processing speeds, ideal for multitasking and gaming. With 5G capability, users can experience faster download and streaming speeds. The dual-camera system captures stunning photos and videos, while Night mode enhances low-light photography. Featuring MagSafe technology, it allows for easy wireless charging and accessory attachment.",
            13299,
            105,
            "https://www.istore.co.za/media/catalog/product/m/g/mgj83aaa1.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700",
        ), 
        itemCreate(
            1,
            "iPhone 13",
            categories[0],
            "The iPhone 13 elevates the smartphone experience with its sleek design and advanced features. Equipped with an A15 Bionic chip, it delivers blazing-fast performance for seamless multitasking and gaming. Its stunning Super Retina XDR display offers vibrant colors and sharp details for an immersive viewing experience. With 5G connectivity, users can enjoy faster downloads and streaming. The improved dual-camera system captures stunning photos and videos, while the Night mode enhances low-light photography.",
            16999,
            65,
            "https://www.istore.co.za/media/catalog/product/i/p/iphone_13_green_pure_back_iphone_13_green_pure_front_2-up_screen__usen.png?format=jpeg",
        ),
        itemCreate(
            2,
            "iPhone 14",
            categories[0],
            "Powered by the latest A-series chip, possibly A16 Bionic, it promises lightning-fast performance and improved energy efficiency. Its advanced camera system is likely to offer enhanced computational photography capabilities, capturing stunning photos and videos in any lighting conditions. With 5G connectivity, users can enjoy blazing-fast speeds for seamless streaming and downloading. MagSafe technology may see further refinements, offering convenient wireless charging and accessory compatibility. ",
            21999,
            84,
            "https://www.istore.co.za/media/catalog/product/i/p/iphone_14_blue-5_3_1.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700",
        ),
        itemCreate(
            3,
            "iPhone 15",
            categories[0],
            "Powered by an advanced A-series chip, possibly A17 Bionic, it promises unparalleled performance and energy efficiency. Its cutting-edge camera system is expected to redefine mobile photography, capturing breathtaking images and videos with ease. With lightning-fast 5G connectivity, users can experience seamless streaming and downloading like never before. Enhanced MagSafe technology may offer even more convenience with wireless charging and accessory integration.",
            28999,
            39,
            "https://www.istore.co.za/media/catalog/product/i/p/iphone_15_plus_black_pdp_image_position-1__wwen_4.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700",
        ),
        itemCreate(
            4, 
            "iPad Air",
            categories[1],
            "The iPad Air blends power and portability, featuring a stunning 10.9-inch Liquid Retina display for immersive viewing. Powered by the A14 Bionic chip, it delivers impressive performance for multitasking, gaming, and creative tasks. Its sleek design incorporates Touch ID for secure authentication and compatibility with the Apple Pencil (2nd generation) and Magic Keyboard.",
            13499,
            56,
            "https://www.istore.co.za/media/catalog/product/i/p/ipad_air_cellular_blue_pdp_image_position-1b_5g__wwen_3.png?format=jpeg",
        ),
        itemCreate(
            5, 
            "iPad Pro M2",
            categories[1],
            "The iPad Pro redefines what's possible with a tablet, boasting a stunning Liquid Retina XDR display that delivers incredible brightness and contrast. Powered by the M1 chip, it offers desktop-class performance for demanding tasks like photo and video editing, gaming, and more. The iPad Pro features an advanced camera system with LiDAR scanner for augmented reality experiences and professional-quality photos and videos.",
            19299,
            21,
            "https://www.istore.co.za/media/catalog/product/i/p/ipad_pro_cellular_12-9_in_6th_generation_silver_pdp_image_position-1b__wwen_2.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700",
        ),
        itemCreate(
            6, 
            "MacBook Air",
            categories[2],
            "The MacBook Air is the perfect blend of power and portability, featuring a lightweight design and impressive performance. With the latest Apple Silicon chip, it delivers fast processing speeds for everyday tasks like web browsing, document editing, and multimedia consumption. The vibrant Retina display offers crisp visuals, while the Magic Keyboard provides a comfortable typing experience.",
            18999,
            36,
            "https://www.istore.co.za/media/catalog/product/m/a/macbook_air_gold_with_m1_chip_.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700",
        ),
        itemCreate(
            7, 
            "MacBook Pro",
            categories[2],
            "The MacBook Pro is the epitome of power and performance in a sleek and portable design. Equipped with the latest Intel or Apple Silicon processors, it delivers blazing-fast speeds for intensive tasks like video editing, coding, and graphic design. The stunning Retina display offers vivid colors and sharp details, perfect for creative professionals. Featuring an innovative Touch Bar and Touch ID, it offers convenient access and security.",
            37499,
            15,
            "https://www.istore.co.za/media/catalog/product/m/a/macbook_pro_14-in_m3_space_gray_pure_front_open_screen__usen_1.png?format=jpeg",
        ),
        itemCreate(
            8,
            "Fapple Watch",
            categories[3],
            "The Apple Watch is a revolutionary wearable device that seamlessly integrates into your lifestyle. With its sleek design and advanced features, it's more than just a timepiece. Stay connected with notifications, calls, and messages right on your wrist. Track your fitness goals with built-in activity and workout tracking, and monitor your health with features like heart rate monitoring and ECG.",
            20999,
            65,
            "https://www.istore.co.za/media/catalog/product/a/p/apple_watch_series_9_gps_41mm_midnight_aluminum_midnight_sport_band_pdp_image_position-1__wwen-2_1.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700",
        )
    ])
}