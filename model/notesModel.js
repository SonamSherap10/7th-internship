const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notesSchema = new Schema({
  requestId: {
    type: Schema.Types.ObjectId,
    ref: 'RepairRequest',
    required: true
  },
  
  estimatedCost: {
    type: String, 
    default: null
  },

  images: {
    type: [String],
    default: []
  },

  description: {
    type: String,
    required: true
  }

}, { timestamps: true });


notesSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("Notes", notesSchema);
