// /src/data/emoji-data.js
// 현재 파일 위치를 기준으로 상대 경로('./')를 사용하여 import 오류를 해결합니다.

// 1. 모든 카테고리별 데이터 파일 가져오기 (경로 수정)
import { smileysEmotion } from './categories/smileys_emotion.js';
import { peopleBody } from './categories/people_body.js';
import { professions } from './categories/professions.js';
import { animalsNature } from './categories/animals_nature.js';
import { foodDrink } from './categories/food_drink.js';
import { travelPlaces } from './categories/travel_places.js';
import { activities } from './categories/activities.js';
import { objects } from './categories/objects.js';
import { symbols } from './categories/symbols.js';
import { festivalsEvents } from './categories/festivals_events.js';
import { flags } from './categories/flags.js';

// 2. 특수 카테고리 처리 (HTML 필터 호환용)
const hands = peopleBody.filter(emoji => emoji.sub_category === 'Hand Gestures');

// 3. 카테고리별로 데이터를 정리한 객체
export const emojiCategories = {
  smileys: smileysEmotion,
  people: peopleBody,
  hands: hands,
  animals: animalsNature,
  food: foodDrink,
  activities: activities,
  travel: travelPlaces,
  festivals: festivalsEvents,
  objects: objects,
  symbols: symbols,
  flags: flags,
  professions: professions,
  status: symbols.filter(emoji => emoji.sub_category === 'Status & Notification')
};

// 4. 전체 검색을 위한 모든 이모지 통합 배열
export const allEmojis = Object.values(emojiCategories).flat();