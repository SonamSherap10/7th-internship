const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  requestId: { type: Schema.Types.ObjectId, ref: 'RepairRequest', required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  amount: { type: Number, required: true },
  receivedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  paymentMethod: { type: String }
}, { timestamps: true });

paymentSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
