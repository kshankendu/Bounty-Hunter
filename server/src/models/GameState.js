import mongoose from 'mongoose';

const gameStateSchema = new mongoose.Schema({
  singletonKey: { type: String, default: 'game', unique: true },
  ended: { type: Boolean, default: false },
  endedAt: { type: Number, default: null }
});

const GameState = mongoose.model('GameState', gameStateSchema);

// The game only ever has one state document; create it on first access.
export async function getOrCreateGameState() {
  let state = await GameState.findOne({ singletonKey: 'game' });
  if (!state) {
    state = await GameState.create({ singletonKey: 'game', ended: false, endedAt: null });
  }
  return state;
}

export default GameState;
