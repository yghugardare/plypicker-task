import mongoose, { Schema, Document, models } from "mongoose";

interface IProuct extends Document {
  productName: string;
  price: string;
  description: string;
  productFirebaseImageLink: string;
  productBase64ImageUrl : string;
  imgType : string;
}

const ProductSchema: Schema<IProuct> = new Schema(
  {
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
    productBase64ImageUrl : {
      type : String,
      required : [true,"Base 64 image link is required"]
    },
    imgType : {
      type :String,
      required : [true,"File type is required"]
    }
  },
  { timestamps: true }
);

const Product =
  (mongoose.models.Product as mongoose.Model<IProuct>) ||
  mongoose.model("Product", ProductSchema);

export default Product;
