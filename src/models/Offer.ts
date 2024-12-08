import mongoose, { Document, Schema, Model } from "mongoose"

interface IOffer extends Document {
  title: string
  description: string
  price: number
}

const OfferSchema: Schema = new Schema<IOffer>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
})

const Offer: Model<IOffer> = mongoose.model<IOffer>("Offer", OfferSchema)

export { Offer, IOffer }
