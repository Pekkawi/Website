import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URL) {
    return console.log("Missing mongodb_url");
  }

  try {
    const mongodbUrl = process.env.MONGODB_URL;
    await mongoose.connect(mongodbUrl);
    isConnected = true;
    console.log("MONGODB IS CONNECTED");
  } catch (err) {
    console.log(err);
  }
};
