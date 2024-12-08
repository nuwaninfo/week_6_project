"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const imagesDir = path_1.default.join("./public/images");
if (!fs_1.default.existsSync(imagesDir)) {
    fs_1.default.mkdirSync(imagesDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imagesDir);
    },
    filename: function (req, file, cb) {
        const originalFileName = path_1.default.basename(file.originalname, path_1.default.extname(file.originalname));
        const uniqueId = (0, uuid_1.v4)();
        const extension = path_1.default.extname(file.originalname);
        const newFilename = `${originalFileName}_${uniqueId}${extension}`;
        cb(null, newFilename);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
exports.default = upload;
