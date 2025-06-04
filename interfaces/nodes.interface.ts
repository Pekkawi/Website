import { Types } from 'mongoose';

// src/types/nodes.ts
export interface BaseNode {
  _id: string;
  name: string;
  permission: Types.ObjectId;
  device: Types.ObjectId;
  Status: 'Open' | 'Busy' | 'Maintenance';
  created: string; // or Date, depending on how you parse it
  updated: string;
  __t: 'Laser Cutter' | 'Bambu Printer' | 'Bambu Control Panel';
  occupiedBy: string;
}

export interface LaserNode extends BaseNode {
  __t: 'Laser Cutter'; // this narrows down to LaserNode
  history: Array<{
    student_name: string;
    student_email: string;
    date: string;
  }>;
}

export interface BambuPrinterNode extends BaseNode {
  __t: 'Bambu Printer';
  IP: string;
  accessCode: string;
  timeLeft: string;
  totalTime: string;
  fileName: string;
  SerialNumber: string;
  owner: Types.ObjectId;
  history: Array<{
    student_name: string;
    student_email: string;
    file_name: string;
    duration: string;
    date: string;
  }>;
}

export interface BambuControlPanelNode extends BaseNode {
  __t: 'Bambu Control Panel';
  history: Array<{
    printer: Types.ObjectId;
    student_name: string;
    student_email: string;
    file_name: string;
    duration: string;
    date: string;
  }>;
  owns: Types.ObjectId[];
}

export type NodeType = LaserNode | BambuPrinterNode | BambuControlPanelNode;
