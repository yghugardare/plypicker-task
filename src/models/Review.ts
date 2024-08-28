import mongoose, { Schema, Document, models } from "mongoose";

interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  productName: string;
  price: string;
  description: string;
  productFirebaseImageLink: string;
  productBase64ImageUrl: string;
  status: "pending" | "approved" | "rejected";
  author: string; // The user (team-member) who submitted the review
  admin: string | null; // The admin who reviewed it (null if not reviewed yet)
}

const ReviewSchema: Schema<IReview> = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: [true, "Product Name is required"],
    },
    price: {
      type: String,
      required: [true, "Product Price is required"],
    },
    description: {
      type: String,
      required: [true, "Product Description is required"],
    },
    productFirebaseImageLink: {
      type: String,
      required: [true, "Product Image is required"],
    },
    productBase64ImageUrl: {
      type: String,
      required: [true, "Base 64 image link is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    author: {
      type: String,
      // required: [true, "Email is required"],
      // no two docs should have same email
      // unique: true,
    },
    admin: {
      type: String,
      // required: [true, "Email is required"],
      // no two docs should have same email
      // unique: true,
    },
  },
  { timestamps: true }
);

const Review =
  (mongoose.models.Review as mongoose.Model<IReview>) ||
  mongoose.model("Review", ReviewSchema);

export default Review;
