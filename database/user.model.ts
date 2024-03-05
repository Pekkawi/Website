import { Schema, models, model, Document } from "mongoose";

const roles = ["user", "admin"];
const [defaultRole] = roles;

export interface IUser extends Document {
  azure_id: String;
  email: String;
  first_name: String;
  last_name: String;
  display_name: String;
  card_id: String;
  card_number: String;
  role: String;
  permissions?: Schema.Types.ObjectId[];
}

const userSchema = new Schema({
  azure_id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  card_id: {
    type: String,
    required: true,
    unique: true,
  },
  card_number: {
    type: String,
    required: true,
    unique: false,
  },
  first_name: {
    type: String,
    required: true,
    unique: false,
  },
  last_name: {
    type: String,
    required: true,
    unique: false,
  },
  display_name: {
    type: String,
    required: true,
    unique: false,
  },
  role: {
    type: String,
    required: true,
    unique: false,
    enum: roles,
    default: defaultRole,
  },
  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: "permissions",
      required: false,
      unique: false,
      default: [],
    },
  ],
});

const User = models.users || model("users", userSchema, "users");

// Check if the model already exists , otherwise create a model based on the schema

export default User;
