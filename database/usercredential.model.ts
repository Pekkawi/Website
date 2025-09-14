import mongoose, { Schema } from 'mongoose';

export interface IUserCredential {
  _id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'User' | 'Admin' | 'Staff';
}

const UserCredentialSchema = new Schema<IUserCredential>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email is invalid'],
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    role: {
      type: String,
      default: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserCredentials =
  mongoose.models.userCredentials ||
  mongoose.model<IUserCredential>('userCredentials', UserCredentialSchema);

// Check if the model already exists , otherwise create a model based on the schema

export default UserCredentials;
