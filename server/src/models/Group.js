import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    avatar: { type: String, required: true },
    score: { type: Number, default: 0 },
    stageIndex: { type: Number, default: 0 },
    passed: { type: [Number], default: [] },
    solvedBonuses: { type: [String], default: [] }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

export default mongoose.model('Group', groupSchema);
