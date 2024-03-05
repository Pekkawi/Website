import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    return console.log("Missing mongodb_url");
  }

  if (isConnected) {
    return console.log("Mongodb is already connected");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("MONGODB IS CONNECTED");
  } catch (err) {
    console.log(err);
  }
};
