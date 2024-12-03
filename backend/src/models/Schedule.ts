import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  train_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Train",
    required: true,
  },
  station_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
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

scheduleSchema.pre("validate", function (next) {
  if (!this.arrivalTime && !this.departureTime) {
    next(
      new Error("Either 'arrivalTime' or 'departureTime' must be provided.")
    );
  } else {
    next();
  }
});

// Віртуальне поле для train
scheduleSchema.virtual("train", {
  ref: "Train",
  localField: "train_id",
  foreignField: "_id",
  justOne: true,
});

// Віртуальне поле для station
scheduleSchema.virtual("station", {
  ref: "Station",
  localField: "station_id",
  foreignField: "_id",
  justOne: true,
});

// Налаштування toJSON для включення віртуальних полів
scheduleSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;
