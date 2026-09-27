import mongoose from 'mongoose';

const bonusSchema = new mongoose.Schema(
  {
    clue: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    points: { type: Number, required: true },
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

export default mongoose.model('Bonus', bonusSchema);
