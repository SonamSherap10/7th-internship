const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const repairRequestSchema = new Schema({
  serviceCode: { type: String },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  deviceModel: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  categoryId: { type: String, required: true },
  technicianId: { type: Schema.Types.ObjectId, ref: 'User' }, 
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

repairRequestSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('RepairRequest', repairRequestSchema);
