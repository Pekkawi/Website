import { Types } from 'mongoose';

export interface IDevice {
  _id: Types.ObjectId;
  device_model: string;
  serial_number: string;
  node?: Types.ObjectId;
  application_name: string;
  mac_address: string;
}

export interface IPrinter {
  _id: Types.ObjectId;
  SerialNumber: string;
  AccessCode: string;
  IP: string;
  status: string;
}

export interface IPerm {
  _id: Types.ObjectId;
  description: string;
  scheduling: 'on_demand' | 'scheduled' | 'locking';
  workflow: 'open' | 'timed' | 'controlled';
  default: boolean;
  abbreviation: string;
  name: string;
  image: Types.ObjectId;
  created: Date;
  updated: Date;
  __v: number;
}

// Interface for a new User
export interface IUser {
  _id: Types.ObjectId;
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

// Interface for an image
export interface IImage {}
