import mongoose from "mongoose";

// Схема для розкладу
const scheduleSchema = new mongoose.Schema({
  train_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Train", // Зв'язок з моделлю Train
    required: true,
  },
  station_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station", // Зв'язок з моделлю Station
    required: true,
  },
  arrivalTime: { type: Date, required: false },
  departureTime: { type: Date, required: false },
  platform: { type: String, required: true },
  delay_minutes: {
    type: Number,
    default: 0,
  },
});

// Валідація перед збереженням розкладу
scheduleSchema.pre("validate", function (next) {
  // Перевірка наявності хоча б одного з полів arrivalTime або departureTime
  if (!this.arrivalTime && !this.departureTime) {
    next(
      new Error("Either 'arrivalTime' or 'departureTime' must be provided.")
    );
  } else {
    next();
  }
});

// Віртуальне поле для зв'язку з потягом
scheduleSchema.virtual("train", {
  ref: "Train",
  localField: "train_id",
  foreignField: "_id",
  justOne: true,
});

// Віртуальне поле для зв'язку зі станцією
scheduleSchema.virtual("station", {
  ref: "Station",
  localField: "station_id",
  foreignField: "_id",
  justOne: true,
});

// Налаштування перетворення об'єкта перед відправкою у JSON
scheduleSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Створення моделі розкладу на основі її схеми
const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;
