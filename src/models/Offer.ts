import mongoose, { Document, Schema, Model } from "mongoose"

interface IOffer extends Document {
  title: string
  description: string
  price: number
  imageId?: string
}

const OfferSchema: Schema = new Schema<IOffer>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
})

const Offer: Model<IOffer> = mongoose.model<IOffer>("Offer", OfferSchema)

export { Offer, IOffer }
