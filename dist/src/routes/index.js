"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Offer_1 = require("../models/Offer");
const multer_config_1 = __importDefault(require("../middleware/multer-config"));
const router = (0, express_1.Router)();
router.post("/upload", multer_config_1.default.none(), async (req, res) => {
    try {
        const existingOffer = await Offer_1.Offer.findOne({
            poem: req.body.title,
        });
        if (existingOffer) {
            return res.status(403).json({ message: "Offer already existed" });
        }
        const offer = new Offer_1.Offer({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
        });
        await offer.save();
        console.log("Offer saved!");
    }
    catch (error) {
        console.error(`Error while saving data: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = router;
