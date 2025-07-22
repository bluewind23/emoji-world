// data/emojiData.js
import { emoji_smileys } from './emoji_smileys.js';
import { emoji_people } from './emoji_people.js';
import { emoji_animals } from './emoji_animals.js';
import { emoji_food } from './emoji_food.js';
import { emoji_travel } from './emoji_travel.js';
import { emoji_symbols } from './emoji_symbols.js';
import { emoji_flags } from './emoji_flags.js';
import { emoji_recents } from './emoji_recents.js';

export const emojiData = {
  recent: emoji_recents,
  smileys: emoji_smileys,
  people: emoji_people,
  animals: emoji_animals,
  food: emoji_food,
  travel: emoji_travel,
  symbols: emoji_symbols,
  flags: emoji_flags,
};
