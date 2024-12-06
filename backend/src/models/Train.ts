import mongoose from "mongoose";

// Схема для потяга
const trainSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    route: { type: String, required: true },
  },
  { timestamps: true }
);

// Перетворення об'єкта перед відправкою у JSON
trainSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Створення моделі потяга на основі її схеми
const Train = mongoose.model("Train", trainSchema);
export default Train;
