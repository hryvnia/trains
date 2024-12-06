import mongoose from "mongoose";

// Схема для користувача
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Перетворення об'єкта перед відправкою у JSON
userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Створення моделі користувача на основі її схеми
const User = mongoose.model("User", userSchema);
export default User;
