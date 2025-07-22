// 직업 관련 이모지 데이터
export const professions = [
  // 의료진
  { emoji: '👨‍⚕️', name: '남성 의사', keywords: '의사 남성 의료 병원 doctor man medical', category: 'people', theme: 'professions', subcategory: 'medical', skintones: true },
  { emoji: '👩‍⚕️', name: '여성 의사', keywords: '의사 여성 의료 병원 doctor woman medical', category: 'people', theme: 'professions', subcategory: 'medical', skintones: true },
  { emoji: '👨‍⚕️', name: '남성 의료진', keywords: '간호사 남성 의료 병원 nurse man medical', category: 'people', theme: 'professions', subcategory: 'medical', skintones: true },
  { emoji: '👩‍⚕️', name: '여성 의료진', keywords: '간호사 여성 의료 병원 nurse woman medical', category: 'people', theme: 'professions', subcategory: 'medical', skintones: true },
  
  // 교육
  { emoji: '👨‍🏫', name: '남성 교사', keywords: '교사 선생님 남성 교육 학교 teacher man education', category: 'people', theme: 'professions', subcategory: 'education', skintones: true },
  { emoji: '👩‍🏫', name: '여성 교사', keywords: '교사 선생님 여성 교육 학교 teacher woman education', category: 'people', theme: 'professions', subcategory: 'education', skintones: true },
  { emoji: '👨‍🎓', name: '남성 졸업생', keywords: '졸업 남성 학생 학위 graduate man student', category: 'people', theme: 'professions', subcategory: 'education', skintones: true },
  { emoji: '👩‍🎓', name: '여성 졸업생', keywords: '졸업 여성 학생 학위 graduate woman student', category: 'people', theme: 'professions', subcategory: 'education', skintones: true },
  
  // 기술직
  { emoji: '👨‍💻', name: '남성 프로그래머', keywords: '프로그래머 개발자 남성 컴퓨터 programmer developer man computer', category: 'people', theme: 'professions', subcategory: 'technology', skintones: true },
  { emoji: '👩‍💻', name: '여성 프로그래머', keywords: '프로그래머 개발자 여성 컴퓨터 programmer developer woman computer', category: 'people', theme: 'professions', subcategory: 'technology', skintones: true },
  { emoji: '👨‍🔧', name: '남성 정비공', keywords: '정비공 기계공 남성 수리 mechanic man repair', category: 'people', theme: 'professions', subcategory: 'technology', skintones: true },
  { emoji: '👩‍🔧', name: '여성 정비공', keywords: '정비공 기계공 여성 수리 mechanic woman repair', category: 'people', theme: 'professions', subcategory: 'technology', skintones: true },
  { emoji: '👨‍🔬', name: '남성 과학자', keywords: '과학자 연구원 남성 실험 scientist man research', category: 'people', theme: 'professions', subcategory: 'technology', skintones: true },
  { emoji: '👩‍🔬', name: '여성 과학자', keywords: '과학자 연구원 여성 실험 scientist woman research', category: 'people', theme: 'professions', subcategory: 'technology', skintones: true },
  
  // 서비스업
  { emoji: '👨‍🍳', name: '남성 요리사', keywords: '요리사 셰프 남성 음식 chef man cooking', category: 'people', theme: 'professions', subcategory: 'service', skintones: true },
  { emoji: '👩‍🍳', name: '여성 요리사', keywords: '요리사 셰프 여성 음식 chef woman cooking', category: 'people', theme: 'professions', subcategory: 'service', skintones: true },
  { emoji: '👨‍🌾', name: '남성 농부', keywords: '농부 농업 남성 farming man agriculture', category: 'people', theme: 'professions', subcategory: 'service', skintones: true },
  { emoji: '👩‍🌾', name: '여성 농부', keywords: '농부 농업 여성 farming woman agriculture', category: 'people', theme: 'professions', subcategory: 'service', skintones: true },
  { emoji: '👨‍💼', name: '남성 사무직', keywords: '사무직 직장인 남성 비즈니스 office man business', category: 'people', theme: 'professions', subcategory: 'office', skintones: true },
  { emoji: '👩‍💼', name: '여성 사무직', keywords: '사무직 직장인 여성 비즈니스 office woman business', category: 'people', theme: 'professions', subcategory: 'office', skintones: true },
  
  // 공공 서비스
  { emoji: '👮‍♂️', name: '남성 경찰', keywords: '경찰 남성 치안 police man security', category: 'people', theme: 'professions', subcategory: 'public', skintones: true },
  { emoji: '👮‍♀️', name: '여성 경찰', keywords: '경찰 여성 치안 police woman security', category: 'people', theme: 'professions', subcategory: 'public', skintones: true },
  { emoji: '👨‍🚒', name: '남성 소방관', keywords: '소방관 남성 화재 firefighter man fire', category: 'people', theme: 'professions', subcategory: 'public', skintones: true },
  { emoji: '👩‍🚒', name: '여성 소방관', keywords: '소방관 여성 화재 firefighter woman fire', category: 'people', theme: 'professions', subcategory: 'public', skintones: true },
  { emoji: '👨‍✈️', name: '남성 조종사', keywords: '조종사 파일럿 남성 비행기 pilot man airplane', category: 'people', theme: 'professions', subcategory: 'transport', skintones: true },
  { emoji: '👩‍✈️', name: '여성 조종사', keywords: '조종사 파일럿 여성 비행기 pilot woman airplane', category: 'people', theme: 'professions', subcategory: 'transport', skintones: true },
  
  // 예술/창작
  { emoji: '👨‍🎨', name: '남성 예술가', keywords: '예술가 화가 남성 미술 artist man art', category: 'people', theme: 'professions', subcategory: 'creative', skintones: true },
  { emoji: '👩‍🎨', name: '여성 예술가', keywords: '예술가 화가 여성 미술 artist woman art', category: 'people', theme: 'professions', subcategory: 'creative', skintones: true },
  { emoji: '👨‍🎤', name: '남성 가수', keywords: '가수 남성 음악 singer man music', category: 'people', theme: 'professions', subcategory: 'creative', skintones: true },
  { emoji: '👩‍🎤', name: '여성 가수', keywords: '가수 여성 음악 singer woman music', category: 'people', theme: 'professions', subcategory: 'creative', skintones: true },
  
  // 법조계
  { emoji: '👨‍⚖️', name: '남성 판사', keywords: '판사 남성 법원 법률 judge man law', category: 'people', theme: 'professions', subcategory: 'legal', skintones: true },
  { emoji: '👩‍⚖️', name: '여성 판사', keywords: '판사 여성 법원 법률 judge woman law', category: 'people', theme: 'professions', subcategory: 'legal', skintones: true },
  
  // 우주/항공
  { emoji: '👨‍🚀', name: '남성 우주인', keywords: '우주인 남성 우주 astronaut man space', category: 'people', theme: 'professions', subcategory: 'space', skintones: true },
  { emoji: '👩‍🚀', name: '여성 우주인', keywords: '우주인 여성 우주 astronaut woman space', category: 'people', theme: 'professions', subcategory: 'space', skintones: true }
];