// 데이터 통합 모듈 (Aggregator)

// 1. 카테고리별 데이터 가져오기
import { emoji_smileys as smileys } from './emoji_smileys.js';
import { people } from './emoji_people.js';
import { hands } from './categories/hands.js'; // hands.js 파일이 categories 폴더 안에 있다고 가정
import { emoji_body as body } from './emoji_body.js';
import { animals } from './categories/animals.js'; // animals.js 파일이 categories 폴더 안에 있다고 가정
import { food } from './categories/food.js'; // food.js 파일이 categories 폴더 안에 있다고 가정
import { activities } from './categories/activities.js'; // activities.js 파일이 categories 폴더 안에 있다고 가정
import { travel } from './emoji_travel.js';
import { vehicles } from './emoji_vehicles.js';
import { objects } from './categories/objects.js'; // objects.js 파일이 categories 폴더 안에 있다고 가정
import { emoji_symbols as symbols } from './emoji_symbols.js';
import { flags } from './categories/flags.js'; // flags.js 파일이 categories 폴더 안에 있다고 가정
import { professions } from './professions.js';
import { status } from './status.js';


// 2. 테마별 데이터 가져오기
import { events } from './themes/events.js'; // events.js 파일이 themes 폴더 안에 있다고 가정
import { christmas } from './christmas.js';
import { cincoDeMaxo as cincoDeMayo } from './cinco-de-mayo.js';

// 3. 테마 구조/매핑 정보 가져오기
import { themeStructure, themeEmojis } from './themeMapping.js';

// 4. 모든 이모지 데이터를 하나의 객체로 통합하여 내보내기
export const emojiDataExtended = {
  smileys,
  people,
  body, // 'body' 카테고리가 누락되지 않도록 추가합니다.
  hands,
  animals,
  food,
  activities,
  travel,
  vehicles,
  objects,
  symbols,
  flags,
  professions,
  status,
  events,
  christmas,
  'cinco-de-mayo': cincoDeMayo,
};
// 5. 테마 구조/매핑 정보도 함께 내보내기
export { themeStructure, themeEmojis };