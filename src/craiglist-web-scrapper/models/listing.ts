import mongoose from 'mongoose'

export interface IListing {
  title: string
  datePosted: Date
  neighborhood: string
  url: string
  jobDescription: string
  compensation: string
}

interface ListingDocument extends IListing, mongoose.Document {}

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  datePosted: {
    type: Date,
    required: true,
    default: new Date(),
  },
  neighborhood: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  compensation: {
    type: String,
  },
})

export default mongoose.model<ListingDocument>('Listing', listingSchema)
