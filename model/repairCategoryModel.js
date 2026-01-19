const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const repairCategorySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

repairCategorySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('RepairCategory', repairCategorySchema);
