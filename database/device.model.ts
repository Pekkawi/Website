import { Schema, models, model, Types } from 'mongoose';

const deviceSchema = new Schema({
  device_model: {
    type: String,
    required: true,
  },
  node: {
    type: Types.ObjectId,
    ref: 'newnode',
  },
  serial_number: {
    type: String,
    required: true,
    unique: true,
  },
  application_name: {
    type: String,
    required: true,
  },
  mac_address: {
    type: String,
    required: true,
    unique: true,
  },
});

const Devices = models.devices || model('devices', deviceSchema); // Check if the model already exists , otherwise create a model based on the Schema

export default Devices;
