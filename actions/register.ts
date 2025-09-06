'use server';
import { connectToDatabase } from '@/lib/mongoose';
import UserCredentials from '@/database/usercredential.model';
import bcrypt from 'bcryptjs';

export const register = async (values: any) => {
  const { email, password, name } = values;

  try {
    await connectToDatabase();
    const userFound = await UserCredentials.findOne({ email });
    if (userFound) {
      return {
        error: 'Email already exists!',
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await new UserCredentials({
      name,
      email,
      password: hashedPassword,
    }).save();
  } catch (e) {
    console.log(e);
  }
};
