import { Request, Response, Router } from "express"
import { Offer, IOffer } from "../models/Offer"
import { Image, IImage } from "../models/Image"
import upload from "../middleware/multer-config"

const router: Router = Router()
let savedImageID: string | undefined
router.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const existingOffer: IOffer | null = await Offer.findOne({
        poem: req.body.title,
      })

      if (existingOffer) {
        return res.status(403).json({ message: "Offer already existed" })
      }

      if (req.file) {
        const imgPath: string = req.file.path.replace("public", "")

        const image: IImage = new Image({
          filename: req.file.filename,
          description: req.body.description,
          path: imgPath,
        })

        const savedImage = await image.save()

        savedImageID = savedImage._id.toString()
      }

      const offer: IOffer = new Offer({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageId: savedImageID,
      })
      await offer.save()
      return res.status(201).json({ message: "Offer saved successfully" })
      console.log("Offer saved!")
    } catch (error: any) {
      console.error(`Error while saving data: ${error}`)
      return res.status(500).json({ message: "Internal server error" })
    }
  }
)

export default router
