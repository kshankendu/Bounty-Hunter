import mongoose from 'mongoose';

const stageSchema = new mongoose.Schema(
  {
    clue: { type: String, required: true },
    answer: { type: String, required: true }
  },
  { _id: false }
);

const avatarClueSchema = new mongoose.Schema({
  avatar: { type: String, required: true, unique: true },
  stages: { type: [stageSchema], default: [] }
});

export default mongoose.model('AvatarClue', avatarClueSchema);
