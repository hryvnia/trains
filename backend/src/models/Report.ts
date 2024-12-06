import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    generatedAt: { type: Date, default: Date.now },
    data: [{ type: mongoose.Schema.Types.Mixed, required: true }],
  },
  { timestamps: true }
);

reportSchema.virtual("user", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

reportSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Report = mongoose.model("Report", reportSchema);
export default Report;
