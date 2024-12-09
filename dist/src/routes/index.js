"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Offer_1 = require("../models/Offer");
const Image_1 = require("../models/Image");
const multer_config_1 = __importDefault(require("../middleware/multer-config"));
const router = (0, express_1.Router)();
let savedImageID;
router.post("/upload", multer_config_1.default.single("image"), async (req, res) => {
    try {
        const existingOffer = await Offer_1.Offer.findOne({
            poem: req.body.title,
        });
        if (existingOffer) {
            return res.status(403).json({ message: "Offer already existed" });
        }
        if (req.file) {
            const imgPath = req.file.path.replace("public", "");
            const image = new Image_1.Image({
                filename: req.file.filename,
                description: req.body.description,
                path: imgPath,
            });
            const savedImage = await image.save();
            savedImageID = savedImage._id.toString();
        }
        const offer = new Offer_1.Offer({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            imageId: savedImageID,
        });
        await offer.save();
        return res.status(201).json({ message: "Offer saved successfully" });
        console.log("Offer saved!");
    }
    catch (error) {
        console.error(`Error while saving data: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/offers", async (req, res) => {
    try {
        const offers = await Offer_1.Offer.find();
        if (!offers) {
            return res.status(404).json({ message: "No offers found" });
        }
        const offersWithImages = await Promise.all(offers.map(async (offer) => {
            let image = null;
            if (offer.imageId) {
                image = await Image_1.Image.findById(offer.imageId);
            }
            /*return {
              title: offer.title,
              price: offer.price,
              description: offer.description,
              image: image ? { filename: image.filename, path: image.path } : null, // Attach image data or null
            }*/
            return {
                title: offer.title,
                description: offer.description,
                price: offer.price,
                imagePath: image ? image.path : null, // Include image path if it exists
            };
        }));
        return res.status(200).json(offersWithImages); // Return offers with images
        //res.status(200).json(images)
        console.log("Images fetched successfully from database");
    }
    catch (error) {
        console.error(`Error while fetching a file: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = router;
