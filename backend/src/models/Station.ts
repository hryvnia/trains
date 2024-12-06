import mongoose from "mongoose";

// Схема для станції
const stationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// Перетворення об'єкта перед відправкою у JSON
stationSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Створення моделі станції на основі її схеми
const Station = mongoose.model("Station", stationSchema);
export default Station;
