import mongoose, { Schema } from 'mongoose';

export interface UserCredentialDocument {
  _id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserCredentialSchema = new Schema<UserCredentialDocument>(
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
  },
  {
    timestamps: true,
  }
);

const UserCredentials =
  mongoose.models.userCredentials ||
  mongoose.model<UserCredentialDocument>('userCredentials', UserCredentialSchema);

// Check if the model already exists , otherwise create a model based on the schema

export default UserCredentials;
