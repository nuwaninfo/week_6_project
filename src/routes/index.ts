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

router.get("/offers", async (req: Request, res: Response) => {
  try {
    const offers: IOffer[] | null = await Offer.find()

    if (!offers) {
      return res.status(404).json({ message: "No offers found" })
    }

    const offersWithImages = await Promise.all(
      offers.map(async (offer) => {
        let image = null

        if (offer.imageId) {
          image = await Image.findById(offer.imageId)
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
        }
      })
    )
    return res.status(200).json(offersWithImages) // Return offers with images
    //res.status(200).json(images)
    console.log("Images fetched successfully from database")
  } catch (error: any) {
    console.error(`Error while fetching a file: ${error}`)
    return res.status(500).json({ message: "Internal server error" })
  }
})

export default router
