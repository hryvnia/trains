import mongoose from "mongoose";

const trainSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    route: { type: String, required: true },
  },
  { timestamps: true }
);

const Train = mongoose.model("Train", trainSchema);
export default Train;
