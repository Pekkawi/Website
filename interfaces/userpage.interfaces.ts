import { Types } from "mongoose";

export interface UserType {
    _id: Types.ObjectId,
    email: string;
    first_name: string;
    display_name: string;
  }