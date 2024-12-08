import { Request, Response, Router } from "express"
import { Offer, IOffer } from "../models/Offer"
import upload from "../middleware/multer-config"

const router: Router = Router()

router.post("/upload", upload.none(), async (req: Request, res: Response) => {
  try {
    const existingOffer: IOffer | null = await Offer.findOne({
      poem: req.body.title,
    })

    if (existingOffer) {
      return res.status(403).json({ message: "Offer already existed" })
    }

    const offer: IOffer = new Offer({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
    })
    await offer.save()
    return res.status(201).json({ message: "Offer saved successfully" })
    console.log("Offer saved!")
  } catch (error: any) {
    console.error(`Error while saving data: ${error}`)
    return res.status(500).json({ message: "Internal server error" })
  }
})

export default router
