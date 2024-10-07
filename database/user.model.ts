import { Schema, models, model} from "mongoose";
import { IUser } from "@/interfaces/database.interfaces";

const roles = ["user", "maintainer", "admin"];
const [defaultRole] = roles;


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

const User = models.users || model<IUser>("users", userSchema, "users");

// Check if the model already exists , otherwise create a model based on the schema

export default User;
