import mongoose from "mongoose";

// Схема звіту
const reportSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Зв'язок з моделлю User
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    generatedAt: { type: Date, default: Date.now },
    data: [{ type: mongoose.Schema.Types.Mixed, required: true }],
  },
  { timestamps: true }
);

// Віртуальне поле для зв'язку з User, що створив звіт
reportSchema.virtual("user", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

// Налаштування перетворення об'єкта перед відправкою у JSON
reportSchema.set("toJSON", {
  virtuals: true, // Включення віртуальних
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Створення моделі звіта на основі її схеми
const Report = mongoose.model("Report", reportSchema);
export default Report;
