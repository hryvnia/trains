import mongoose from "mongoose";

const trainSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    route: { type: String, required: true },
  },
  { timestamps: true }
);

trainSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Train = mongoose.model("Train", trainSchema);
export default Train;
