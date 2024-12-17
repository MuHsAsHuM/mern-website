import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, 
    bundle: {
      type: String,
      required: true,
    }, 
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    }, 
    orderID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);
export default Order;
