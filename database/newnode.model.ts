import mongoose, { Schema, models, model } from 'mongoose';

// shared enum for status
const statusOptions = ['Open', 'Busy', 'Maintenance'];
const [defaultStatus] = statusOptions;

const baseNodeSchema = new Schema({
  name: {
    type: String,
    // required: true,
  },
  permission: {
    type: Schema.Types.ObjectId,
    ref: 'permission',
    // required: true,
  },
  device: {
    type: Schema.Types.ObjectId,
    ref: 'devices',
  },
  Status: {
    type: String,
    default: defaultStatus,
    enum: statusOptions,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  occupiedBy: {
    type: String,
  },
});

const LASSchema = new Schema({
  history: {
    type: [
      {
        student_name: { type: String, required: true },
        student_email: { type: String, required: true },
        date: {
          type: Date, // required: true,
          default: Date.now,
        },
      },
    ],
    // required: true,
  },
});

const BAMSchema = new Schema({
  IP: {
    type: String,
    // required: true,
  },
  accessCode: {
    type: String,
    // required: true,
  },
  fileName: {
    type: String,
  },
  timeLeft: {
    type: String,
  },
  totalTime: {
    type: String,
  },
  SerialNumber: {
    type: String,
    unique: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'newnode',
    // required: true,
  },
  history: {
    type: [
      {
        student_name: { type: String, required: true },
        student_email: { type: String, required: true },
        file_name: { type: String, required: true },
        duration: { type: String, required: true },
        date: {
          type: Date, // required: true,
          default: Date.now,
        },
      },
    ],
    // required: true,
  },
});

const BCPSchema = new Schema({
  history: {
    type: [
      {
        printer: { type: Schema.Types.ObjectId },
        student_name: { type: String, required: true },
        student_email: { type: String, required: true },
        file_name: { type: String, required: true },
        duration: { type: String, required: true },
        date: {
          type: Date, // required: true,
          default: Date.now,
        },
      },
    ],
  },
  owns: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'newnode',
        // required: true,
      },
    ],
  },
});

const baseNode = models.newnode || model('newnode', baseNodeSchema);

// If you have a new permissions that you want to add with certain cusqtom fields

const LaserNode =
  mongoose.models['Laser Cutter'] || baseNode.discriminator('Laser Cutter', LASSchema);

const BambuPrinterNode =
  mongoose.models['Bambu Printer'] || baseNode.discriminator('Bambu Printer', BAMSchema);

const BambuControlPanelNode =
  mongoose.models['Bambu Control Panel'] ||
  baseNode.discriminator('Bambu Control Panel', BCPSchema);

export { baseNode, LaserNode, BambuPrinterNode, BambuControlPanelNode };
