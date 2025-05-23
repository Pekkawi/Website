import { IPrinter } from '@/interfaces/database.interfaces';
import { model, models, Schema } from 'mongoose';

const printerSchema = new Schema({
  TotalPrintTime: {
    type: String,
    required: false,
    default: 'None',
  },
  PrintTimeLeft: {
    type: String,
    required: false,
    default: 'None',
  },
  FileName: {
    type: String,
    required: false,
    default: 'None',
  },
  History: {
    type: [
      {
        email: String,
        Date: String,
        name: String,
        FileName: String,
        TotalPrintTime: String,
      },
    ],
    default: [],
  },
  IP: {
    type: String,
    required: true,
  },
  SerialNumber: {
    type: String,
    required: true,
  },
  AccessCode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: false,
  },
});

const Printers = models.Printers || model<IPrinter>('Printers', printerSchema);

export default Printers;
