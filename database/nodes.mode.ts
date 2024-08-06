import { Schema, models, model, Document } from "mongoose";

export interface IPerm extends Document {
  serialNumber: String;
  MAC_Address: String;
  operatingSystem: String;
  ssh_name: String;
  ssh_password_local: String;
}

const permissionSchema = new Schema({
  abbreviation: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
    unique: false,
    default: "",
  },
  scheduling: {
    type: String,
    required: true,
    unique: false,
    default: defaultScheduling,
    enum: schedulings,
  },
  workflow: {
    type: String,
    required: true,
    unique: false,
    default: defaultWorkflow,
    enum: workflows,
  },
  default: {
    type: Boolean,
    required: true,
    unique: false,
    default: false,
  },
});

const Permissions =
  models.permissions || model("NODE", permissionSchema, "NODE"); // Check if the model already exists , otherwise create a model based on the Schema

export default Permissions;
