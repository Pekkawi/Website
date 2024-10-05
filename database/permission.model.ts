import { IPerm } from "@/interfaces/database.interfaces";
import { Schema, models, model, Types } from "mongoose";

const schedulings = ["on_demand", "scheduled", "locking"];
const workflows = ["open", "timed", "controlled"];



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
    default: "on_demand",
    enum: schedulings,
  },
  workflow: {
    type: String,
    required: true,
    unique: false,
    default: "open",
    enum: workflows,
  },
  default: {
    type: Boolean,
    required: true,
    unique: false,
    default: false,
  },
  image: {
    type:Types.ObjectId,
    required:true,
  },
 
},{
  timestamps:{createdAt:"created",updatedAt:"updated"} // Change the name of time stamps
});

const Permissions =
  models.permissions || model<IPerm>("permissions", permissionSchema, "permissions"); // Check if the model already exists , otherwise create a model based on the Schema

export default Permissions;
