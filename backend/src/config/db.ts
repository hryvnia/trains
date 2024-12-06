import mongoose, { ConnectOptions } from "mongoose";

// Функція для підключення до бази даних MongoDB
const connectDB = async () => {
  try {
    // Підключення через URI, який зберігається в змінній середовища
    await mongoose.connect(
      process.env.MONGODB_URI as string,
      {} as ConnectOptions
    );
    console.log("Database is connected");
  } catch (error: any) {
    // Помилка, якщо підключення не вдалося
    console.log(error.message);
  }
};

export default connectDB;
