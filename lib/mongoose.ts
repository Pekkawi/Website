import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return mongoose.connection.db;
  }
  mongoose.set('strictQuery', true);
  if (!process.env.MONGODB_URL) {
    return new Error('MONGODB_URL is not set');
  }

  try {
    const mongodbUrl = process.env.MONGODB_URL;
    await mongoose.connect(mongodbUrl);
    isConnected = true;
    console.log('=> new database connection');
    return mongoose.connection.db;
  } catch (err) {
    console.log(err);
  }
};
