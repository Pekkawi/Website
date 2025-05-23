import { INode } from '@/interfaces/database.interfaces';
import { Schema, models, model } from 'mongoose';

const status = ['Open', 'Busy', 'Maintenance'];
const [defaultStatus] = status; // set default status to Open

const nodeSchema = new Schema({
  IP: {
    type: String,
    required: true,
  },
  SerialNumber: {
    type: String,
    required: false,
    // unique: true,
  },
  usedBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: false,
    unqiue: false,
    default: null,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  MACAddress: {
    type: String,
    // required: true,
    required: false,
    // unique: true,
  },
  MachineType: {
    type: Schema.Types.ObjectId,
    ref: 'permissions',
  },
  DeviceName: {
    type: String,
    // required: false,
    // unique: true,
  },
  // History: [
  //   {
  //     time: {
  //       type: Date,
  //       default: Date.now,
  //     },
  //     user: {
  //       type: String,
  //     },
  //   },
  // ],
  Status: {
    type: String,
    required: false,
    default: defaultStatus,
    enum: status,
    unique: false,
  },
  // os: {
  //   type: String,
  //   required: false,
  //   unique: false,
  // },
});

const NewNode = models.NewNode || model<INode>('NewNode', nodeSchema);

// Check if the model already exists , otherwise create a model based on the schema

export default NewNode;
