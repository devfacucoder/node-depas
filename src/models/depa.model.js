import { Schema, Types, model } from "mongoose";

const depaSchema = new Schema({
  title: String,
  author: {
    type: Types.ObjectId,
    ref: "user",
    require: true,
  },
  imgs: [
    {
      url: String,
      idkey: String,
    },
  ],

  contactNumber: Number,
  wasapNumber: Number,
  description: String,
  currency: {
    type: String,
    enum: ["ARS", "USD"],
    default: "ARS",
  },
  price: {
    type: Number,
  },
  location: String,
  features: {
    type: [String],
    default: [],
  },
});
const depaModel = model("depa", depaSchema);
export default depaModel;
