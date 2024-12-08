import multer, { StorageEngine, Multer } from "multer"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"

const imagesDir = path.join("./public/images")
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

const storage: StorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir)
  },
  filename: function (req, file, cb) {
    const originalFileName = path.basename(
      file.originalname,
      path.extname(file.originalname)
    )
    const uniqueId = uuidv4()
    const extension = path.extname(file.originalname)
    const newFilename = `${originalFileName}_${uniqueId}${extension}`
    cb(null, newFilename)
  },
})

const upload: Multer = multer({ storage: storage })

export default upload
