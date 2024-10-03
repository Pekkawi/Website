import { Types } from "mongoose";


export interface INode  {
    _id:Types.ObjectId,
    SerialNumber: string;
    MACAddress: string;
    DeviceName: string;
    History: string;
    Status: string;
    os: string;
  }

  export interface IPerm  {
    _id:Types.ObjectId,
    abbreviation: string;
    name: string;
    description: string;
    scheduling: string;
    workflow: string;
    default: boolean;
  }
  
  export interface IUser {
    _id:Types.ObjectId,
    azure_id: string;
    email: string;
    first_name: string;
    last_name: string;
    display_name: string;
    card_id: string;
    card_number: string;
    role: string;
    permissions?: Types.ObjectId[];
  }