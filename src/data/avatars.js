// Avatar art + metadata for the hunt.
// Each avatar image lives in src/assets/avatars/ and was cropped from the
// character sheet you provided. Swap any file in that folder to re-skin a hunter.
import Jesus from '../assets/avatars/Jesus.png';
import Moses from '../assets/avatars/Moses.png';
import David from '../assets/avatars/David.png';
import Solomon from '../assets/avatars/Solomon.png';
import Paul from '../assets/avatars/Paul.png';
import Peter from '../assets/avatars/Peter.png';
import John from '../assets/avatars/John.png';
import Matthew from '../assets/avatars/Matthew.png';
import Mark from '../assets/avatars/Mark.png';
import Luke from '../assets/avatars/Luke.png';
import Judas from '../assets/avatars/Judas.png';
import Abraham from '../assets/avatars/Abraham.png';
import Isaac from '../assets/avatars/Isaac.png';
import Jacob from '../assets/avatars/Jacob.png';
import Joseph from '../assets/avatars/Joseph.png';
import Daniel from '../assets/avatars/Daniel.png';
import Esther from '../assets/avatars/Esther.png';
import Ruth from '../assets/avatars/Ruth.png';
import Samson from '../assets/avatars/Samson.png';
import Jonah from '../assets/avatars/Jonah.png';

export const AVATAR_ORDER = [
  'Jesus', 'Moses', 'David', 'Solomon', 'Paul',
  'Peter', 'John', 'Matthew', 'Mark', 'Luke',
  'Judas', 'Abraham', 'Isaac', 'Jacob', 'Joseph',
  'Daniel', 'Esther', 'Ruth', 'Samson', 'Jonah'
];

export const NAME_SUGGEST = {
  Jesus: 'Miracle Squad',
  Moses: 'Sea Parters',
  David: 'Giant Slayers',
  Solomon: 'Wisdom Kings',
  Paul: 'Road Trip Crew',
  Peter: 'Rock Solid',
  John: 'Beloved Legends',
  Matthew: 'Coin Counters',
  Mark: 'Fast Facts',
  Luke: 'Storytellers',
  Judas: 'Plot Twist',
  Abraham: 'Star Gazers',
  Isaac: 'Wood Haulers',
  Jacob: 'Wrestle Squad',
  Joseph: 'Technicolor Team',
  Daniel: 'Lion Tamers',
  Esther: 'Crown Chasers',
  Ruth: 'Harvest Hustlers',
  Samson: 'Pillar Pushers',
  Jonah: 'Big Fish Energy'
};

export const AVATAR_IMAGES = {
  Jesus, Moses, David, Solomon, Paul,
  Peter, John, Matthew, Mark, Luke,
  Judas, Abraham, Isaac, Jacob, Joseph,
  Daniel, Esther, Ruth, Samson, Jonah
};
