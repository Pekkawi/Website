import { model, models, Schema, Types } from 'mongoose';

const historySchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'users',
    required: true,
  },
  node: {
    type: Types.ObjectId,
    ref: 'newnode',
    required: true,
  },
  timeStamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  fileName: {
    type: String,
  },
  printDuration: {
    type: Number,
  },
});

historySchema.index({ timeStamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 20 }); // deletes the item after 20 days

const History = models.histories || model('histories', historySchema);

export { History };
