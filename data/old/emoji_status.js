// 상태 및 체크마크 관련 이모지 데이터
export const status = [
  // 체크마크 & 확인
  { emoji: '✅', name: '체크마크', keywords: '체크 확인 완료 맞음 check mark done correct', category: 'symbols', theme: 'status', subcategory: 'check' },
  { emoji: '☑️', name: '체크 박스', keywords: '체크박스 확인 선택 checkbox check selection', category: 'symbols', theme: 'status', subcategory: 'check' },
  { emoji: '✔️', name: '체크 표시', keywords: '체크 확인 맞음 올바른 check correct right', category: 'symbols', theme: 'status', subcategory: 'check' },
  { emoji: '🗸', name: '가벼운 체크마크', keywords: '체크 확인 light check mark', category: 'symbols', theme: 'status', subcategory: 'check' },
  
  // X 표시 & 오류
  { emoji: '❌', name: 'X 표시', keywords: 'X 틀림 오류 취소 wrong error cancel', category: 'symbols', theme: 'status', subcategory: 'error' },
  { emoji: '❎', name: '엑스 버튼', keywords: 'X 버튼 취소 닫기 cross button cancel close', category: 'symbols', theme: 'status', subcategory: 'error' },
  { emoji: '🚫', name: '금지', keywords: '금지 안됨 불가 prohibited not allowed forbidden', category: 'symbols', theme: 'status', subcategory: 'error' },
  { emoji: '⛔', name: '출입 금지', keywords: '금지 차단 막힘 no entry block', category: 'symbols', theme: 'status', subcategory: 'error' },
  
  // 경고 & 주의
  { emoji: '⚠️', name: '경고', keywords: '경고 주의 위험 warning caution danger', category: 'symbols', theme: 'status', subcategory: 'warning' },
  { emoji: '🔴', name: '빨간 원', keywords: '빨강 원 정지 위험 red circle stop danger', category: 'symbols', theme: 'status', subcategory: 'warning' },
  { emoji: '🟡', name: '노란 원', keywords: '노랑 원 주의 경고 yellow circle caution', category: 'symbols', theme: 'status', subcategory: 'warning' },
  { emoji: '🚨', name: '경보등', keywords: '경보 사이렌 응급 emergency siren alarm', category: 'symbols', theme: 'status', subcategory: 'warning' },
  
  // 정보 & 알림
  { emoji: 'ℹ️', name: '정보', keywords: '정보 안내 인포 information info guide', category: 'symbols', theme: 'status', subcategory: 'info' },
  { emoji: '🔵', name: '파란 원', keywords: '파랑 원 정보 blue circle info', category: 'symbols', theme: 'status', subcategory: 'info' },
  { emoji: '🟢', name: '초록 원', keywords: '초록 원 성공 완료 green circle success', category: 'symbols', theme: 'status', subcategory: 'success' },
  { emoji: '💚', name: '초록 하트', keywords: '초록 하트 성공 좋음 green heart success good', category: 'symbols', theme: 'status', subcategory: 'success' },
  
  // 진행 상태
  { emoji: '⏳', name: '모래시계', keywords: '시간 대기 진행중 loading time wait progress', category: 'symbols', theme: 'status', subcategory: 'progress' },
  { emoji: '⌛', name: '빈 모래시계', keywords: '시간 완료 끝 time finished done', category: 'symbols', theme: 'status', subcategory: 'progress' },
  { emoji: '🔄', name: '새로고침', keywords: '새로고침 반복 순환 refresh repeat cycle', category: 'symbols', theme: 'status', subcategory: 'progress' },
  { emoji: '🔁', name: '반복', keywords: '반복 순환 다시 repeat cycle again', category: 'symbols', theme: 'status', subcategory: 'progress' },
  { emoji: '🔃', name: '시계방향 화살표', keywords: '순환 회전 clockwise rotation', category: 'symbols', theme: 'status', subcategory: 'progress' },
  
  // 우선순위 & 중요도
  { emoji: '⭐', name: '별', keywords: '별 중요 즐겨찾기 star important favorite', category: 'symbols', theme: 'status', subcategory: 'priority' },
  { emoji: '🌟', name: '반짝이는 별', keywords: '별 반짝 중요 특별 glowing star special important', category: 'symbols', theme: 'status', subcategory: 'priority' },
  { emoji: '❗', name: '느낌표', keywords: '느낌표 중요 주의 exclamation important attention', category: 'symbols', theme: 'status', subcategory: 'priority' },
  { emoji: '❓', name: '물음표', keywords: '물음표 질문 궁금 question mark wonder', category: 'symbols', theme: 'status', subcategory: 'priority' },
  { emoji: '‼️', name: '이중 느낌표', keywords: '느낌표 매우중요 긴급 double exclamation urgent very important', category: 'symbols', theme: 'status', subcategory: 'priority' },
  { emoji: '⁉️', name: '느낌표 물음표', keywords: '놀람 의문 exclamation question surprise wonder', category: 'symbols', theme: 'status', subcategory: 'priority' },
  
  // 상태 표시
  { emoji: '🔘', name: '라디오 버튼', keywords: '선택 버튼 radio button selection', category: 'symbols', theme: 'status', subcategory: 'selection' },
  { emoji: '🔲', name: '빈 체크박스', keywords: '체크박스 빈 선택안됨 empty checkbox unselected', category: 'symbols', theme: 'status', subcategory: 'selection' },
  { emoji: '🔳', name: '흰 체크박스', keywords: '체크박스 흰색 white checkbox', category: 'symbols', theme: 'status', subcategory: 'selection' },
  { emoji: '⬜', name: '흰 사각형', keywords: '흰색 사각형 white square', category: 'symbols', theme: 'status', subcategory: 'selection' },
  { emoji: '⬛', name: '검은 사각형', keywords: '검은색 사각형 black square', category: 'symbols', theme: 'status', subcategory: 'selection' },
  
  // 배지 & 마크
  { emoji: '🏆', name: '트로피', keywords: '트로피 우승 1등 성과 trophy winner achievement', category: 'objects', theme: 'status', subcategory: 'achievement' },
  { emoji: '🥇', name: '금메달', keywords: '금메달 1등 우승 gold medal first winner', category: 'objects', theme: 'status', subcategory: 'achievement' },
  { emoji: '🥈', name: '은메달', keywords: '은메달 2등 silver medal second', category: 'objects', theme: 'status', subcategory: 'achievement' },
  { emoji: '🥉', name: '동메달', keywords: '동메달 3등 bronze medal third', category: 'objects', theme: 'status', subcategory: 'achievement' },
  { emoji: '🎖️', name: '군 훈장', keywords: '훈장 메달 military medal honor', category: 'objects', theme: 'status', subcategory: 'achievement' },
  { emoji: '🏅', name: '메달', keywords: '메달 상장 포상 medal award', category: 'objects', theme: 'status', subcategory: 'achievement' },
  
  // 레벨 & 상태
  { emoji: '📈', name: '상승 그래프', keywords: '상승 증가 성장 up graph growth increase', category: 'objects', theme: 'status', subcategory: 'trend' },
  { emoji: '📉', name: '하강 그래프', keywords: '하강 감소 하락 down graph decrease decline', category: 'objects', theme: 'status', subcategory: 'trend' },
  { emoji: '📊', name: '막대 그래프', keywords: '그래프 통계 데이터 bar chart statistics data', category: 'objects', theme: 'status', subcategory: 'trend' },
  { emoji: '💹', name: '증가 차트', keywords: '증가 상승 주식 chart increase stock', category: 'symbols', theme: 'status', subcategory: 'trend' }
];