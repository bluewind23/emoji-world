import { smileysEmotion } from '../data/categories/smileys_emotion.js';
import { peopleBody } from '../data/categories/people_body.js';
import { professions } from '../data/categories/professions.js';
import { animalsNature } from '../data/categories/animals_nature.js';
import { foodDrink } from '../data/categories/food_drink.js';
import { travelPlaces } from '../data/categories/travel_places.js';
import { activities } from '../data/categories/activities.js';
import { objects } from '../data/categories/objects.js';
import { symbols } from '../data/categories/symbols.js';
import { festivalsEvents } from '../data/categories/festivals_events.js';
import { flags } from '../data/categories/flags.js';
import { FontConverter } from './fontConverter.js';

// 플랫폼별 최적화된 이모지 폰트 설정
function getOptimizedEmojiFontFamily() {
  const ua = navigator.userAgent;
  const platform = navigator.platform;

  // Windows 환경 (특히 Chrome에서 Segoe UI Emoji 문제 해결)
  if (/Windows/i.test(ua) || /Win32|Win64/i.test(platform)) {
    // Windows에서는 Noto Color Emoji를 우선으로 하여 컬러 이모지 보장
    return '"Noto Color Emoji", "Segoe UI Emoji", "Twemoji Mozilla", "EmojiOne Color", sans-serif';
  }

  // macOS/iOS 환경
  if (/Mac OS X|iPhone|iPad/i.test(ua) || /MacIntel/i.test(platform)) {
    return '"Apple Color Emoji", "Noto Color Emoji", sans-serif';
  }

  // Android 환경
  if (/Android/i.test(ua)) {
    return '"Noto Color Emoji", "Apple Color Emoji", sans-serif';
  }

  // 기타 Linux/Firefox 환경
  return '"Noto Color Emoji", "Twemoji Mozilla", "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
}

// 플랫폼별 국기 이모지 최적화 폰트
function getFlagEmojiFontFamily() {
  const ua = navigator.userAgent;

  // Windows Chrome에서 국기 이모지가 문자로 보이는 문제 해결
  if (/Windows/i.test(ua) && /Chrome/i.test(ua)) {
    return '"Twemoji Mozilla", "Noto Color Emoji", "Segoe UI Emoji", sans-serif';
  }

  return getOptimizedEmojiFontFamily();
}

// 동적 폰트 적용 함수
function applyOptimizedFonts() {
  const emojiFont = getOptimizedEmojiFontFamily();
  const flagFont = getFlagEmojiFontFamily();

  // 동적 스타일 생성
  const style = document.createElement('style');
  style.id = 'dynamic-emoji-fonts';
  style.innerHTML = `
    /* 플랫폼 최적화 이모지 폰트 오버라이드 */
    .emoji-char,
    .rec-emoji,
    .modal-emoji,
    .related-emoji,
    .logo-icon,
    .search-clear,
    .font-nav-btn,
    .modal-close,
    .btn-icon,
    .skintone-close,
    .slider-controls {
      font-family: ${emojiFont} !important;
      font-variant-emoji: emoji !important;
      -webkit-font-feature-settings: "liga" off !important;
      font-feature-settings: "liga" off !important;
    }
    
    /* 국기 이모지 특별 처리 */
    .flag-emoji,
    .related-emoji.flag-emoji {
      font-family: ${flagFont} !important;
      font-variant-emoji: emoji !important;
    }
    
    /* Windows Chrome 추가 최적화 */
    @supports (-webkit-text-stroke: 1px) {
      .emoji-char,
      .modal-emoji,
      .related-emoji {
        -webkit-text-stroke: 0 !important;
        text-stroke: 0 !important;
      }
    }
  `;

  // 기존 동적 스타일 제거 후 새로 추가
  const existingStyle = document.getElementById('dynamic-emoji-fonts');
  if (existingStyle) {
    existingStyle.remove();
  }

  document.head.appendChild(style);

  console.log('🎨 플랫폼별 최적화 폰트 적용:', {
    platform: navigator.platform,
    userAgent: navigator.userAgent.substring(0, 50) + '...',
    emojiFont: emojiFont,
    flagFont: flagFont
  });
}

// Twemoji를 사용한 이모지 렌더링 최적화
function applyTwemoji() {
  // Twemoji가 로드되었는지 확인
  if (typeof twemoji === 'undefined') {
    console.warn('⚠️ Twemoji 라이브러리가 로드되지 않았습니다.');
    return;
  }

  // Windows Chrome에서만 Twemoji 적용 (성능 최적화)
  const ua = navigator.userAgent;
  const shouldUseTwemoji = /Windows/i.test(ua) && /Chrome/i.test(ua);

  if (!shouldUseTwemoji) {
    console.log('🎯 현재 환경에서는 Twemoji 적용하지 않음');
    return;
  }

  // 국기 이모지에만 Twemoji 적용
  function parseFlagEmojis() {
    const flagElements = document.querySelectorAll('.flag-emoji, .related-emoji.flag-emoji');

    flagElements.forEach(element => {
      // 국기 이모지인지 확인 (U+1F1E6-U+1F1FF 범위)
      const text = element.textContent;
      const flagRegex = /[\u{1F1E6}-\u{1F1FF}]/gu;

      if (flagRegex.test(text)) {
        // Twemoji로 파싱하여 이미지로 대체
        twemoji.parse(element, {
          folder: 'svg',
          ext: '.svg',
          base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
          className: 'twemoji-flag'
        });
      }
    });
  }

  // 초기 적용
  parseFlagEmojis();

  // 동적으로 추가되는 요소들에 대한 MutationObserver
  const observer = new MutationObserver((mutations) => {
    let hasNewFlags = false;

    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const flagElements = node.querySelectorAll?.('.flag-emoji, .related-emoji.flag-emoji') || [];
            if (flagElements.length > 0 || node.classList?.contains('flag-emoji')) {
              hasNewFlags = true;
            }
          }
        });
      }
    });

    if (hasNewFlags) {
      setTimeout(parseFlagEmojis, 50); // 약간의 지연 후 적용
    }
  });

  // DOM 변경 감시 시작
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('🏁 Twemoji 국기 이모지 최적화 적용 완료');
}

// 이모지 fallback 시스템 - HTML 엔티티로 변환
function createEmojiFallback(emoji) {
  // 이모지를 유니코드 코드포인트 배열로 변환
  const codePoints = Array.from(emoji).map(char => {
    const codePoint = char.codePointAt(0);
    return `&#x${codePoint.toString(16).toUpperCase()};`;
  });

  return codePoints.join('');
}

// 이모지 렌더링 문제 감지 및 fallback 적용
function detectAndFixEmojiRendering() {
  // 간단한 테스트 이모지로 렌더링 문제 감지
  const testEmoji = '🇰🇷'; // 한국 국기
  const testElement = document.createElement('div');
  testElement.style.cssText = 'position: absolute; top: -9999px; font-size: 20px;';
  testElement.textContent = testEmoji;
  document.body.appendChild(testElement);

  // 렌더링된 크기로 문제 감지 (정상적으로 렌더링되면 일정 크기 이상)
  const rect = testElement.getBoundingClientRect();
  const isRenderingProperly = rect.width > 10 && rect.height > 10;

  document.body.removeChild(testElement);

  if (!isRenderingProperly) {
    console.warn('⚠️ 이모지 렌더링 문제 감지됨 - fallback 시스템 활성화');

    // 국기 이모지를 HTML 엔티티로 변환
    const flagElements = document.querySelectorAll('.flag-emoji');
    flagElements.forEach(element => {
      const originalText = element.textContent;
      const flagRegex = /[\u{1F1E6}-\u{1F1FF}]/gu;

      if (flagRegex.test(originalText)) {
        const fallbackHTML = createEmojiFallback(originalText);
        element.innerHTML = fallbackHTML;
        element.classList.add('emoji-fallback');
      }
    });

    // fallback CSS 스타일 추가
    const fallbackStyle = document.createElement('style');
    fallbackStyle.innerHTML = `
      .emoji-fallback {
        font-family: "Segoe UI", "Arial Unicode MS", sans-serif !important;
        font-weight: normal !important;
      }
    `;
    document.head.appendChild(fallbackStyle);

    return false;
  }

  console.log('✅ 이모지 렌더링 정상 확인');
  return true;
}

// 2. 특수 카테고리(hands, status)를 동적으로 생성합니다.
const hands = peopleBody.filter(emoji => emoji.sub_category === 'Hand Gestures');
const status = symbols.filter(emoji => emoji.sub_category === 'Status & Notification');

// 3. HTML 필터와 연동할 최종 데이터 객체를 만듭니다.
const emojiCategories = {
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
  status: status
};

// 4. 전체 검색을 위한 통합 배열을 만듭니다.
const allEmojis = Object.values(emojiCategories).flat();

// --- 데이터 불러오기 끝 ---

// 스킨톤 유니코드 맵 정의
const SKIN_TONES = {
  default: '',
  '🏻': '\u{1F3FB}', // Light Skin Tone
  '🏼': '\u{1F3FC}', // Medium-Light Skin Tone  
  '🏽': '\u{1F3FD}', // Medium Skin Tone
  '🏾': '\u{1F3FE}', // Medium-Dark Skin Tone
  '🏿': '\u{1F3FF}'  // Dark Skin Tone
};

// 스킨톤 적용 가능한 이모지인지 확인하는 함수
function isSkinToneSupported(emoji) {
  // 기존 스킨톤 제거하여 기본 이모지만 추출
  const cleanEmoji = emoji.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '');

  // 스킨톤 적용 가능한 이모지 패턴들
  const skinToneSupportedEmojis = [
    // 손 제스처
    '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤝', '🙏',
    // 신체 부위
    '👂', '👃', '🦵', '🦶', '💪', '🤳', '✍️',
    // 사람 얼굴과 표현
    '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓', '👴', '👵',
    // 사람과 직업
    '👮', '🕵️', '💂', '👷', '🤴', '👸', '👳', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '💆', '💇', '🚶', '🏃', '💃', '🕺', '🧖', '🧗', '🏇', '⛷️', '🏂', '🏌️', '🏄', '🚣', '🏊', '⛹️', '🏋️', '🚴', '🚵', '🤸', '🤼', '🤽', '🤾', '🤹', '🧘', '🛀', '🛌',
    // 제스처와 표현 (추가)
    '🤦', '🤷', '💁', '🙅', '🙆', '🙋', '🧏', '🙇', '🤢', '🤧', '🤲'
  ];

  return skinToneSupportedEmojis.includes(cleanEmoji);
}

// [수정된 코드 시작]
// 스킨톤을 적용하는 함수
function applySkinTone(emojiChar, skinToneKey) {
  // 스킨톤 적용이 불가능한 이모지는 그대로 반환
  if (!isSkinToneSupported(emojiChar)) {
    return emojiChar;
  }

  // 1. 기존 스킨톤을 제거하여 기본 이모지만 추출
  const cleanEmoji = emojiChar.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '');

  // 2. 'default'나 빈 키가 오면 깨끗한 이모지만 반환 (노란색으로 복귀)
  if (!skinToneKey || skinToneKey === '' || skinToneKey === 'default') {
    return cleanEmoji;
  }

  // 3. 유효한 스킨톤 키가 오면 해당 유니코드를 찾아 조합
  const skinToneUnicode = SKIN_TONES[skinToneKey];
  if (!skinToneUnicode) {
    return cleanEmoji; // 유효하지 않은 키면 기본 이모지 반환
  }

  // 4. 기본 이모지에 새 스킨톤 적용
  return cleanEmoji + skinToneUnicode;
}
// [수정된 코드 끝]

//  kelas EmojiApp 정의
class EmojiApp {
  constructor() {
    // 클래스 프로퍼티 초기화
    this.elements = {};
    this.allEmojis = allEmojis; // 외부에서 불러온 데이터를 클래스 프로퍼티로 할당
    this.emojiCategories = emojiCategories;
    this.filteredEmojis = [];
    this.copyHistory = this.loadCopyHistory();

    this.searchQuery = '';
    this.currentCategory = 'all';
    this.currentSubcategory = null;
    this.currentLanguage = 'ko';

    this.currentModalEmoji = null;

    // 인스타 폰트 관련 - FontConverter 사용
    this.fontConverter = new FontConverter();
    this.fontStyles = this.fontConverter.getStyles();
    this.currentFontIndex = 0;
    this.inputText = 'Hello';

    // 앱 초기화 메서드 호출
    this.initializeElements();
    this.bindEvents();
    this.setupRecommendations();
    this.renderHistory();

    // 초기 폰트 설정
    this.updateFontOutput();
    this.updateFontStyleName();

    // 최적 폰트 적용
    this.fontConverter.applyOptimalFont(this.elements.fontOutput);

    // 초기 이모지 렌더링
    this.handleCategoryFilter('all');
    this.hideLoading();
  }

  // DOM 요소 초기화
  initializeElements() {
    this.elements = {
      emojiGrid: document.getElementById('emojiGrid'),
      searchInput: document.getElementById('searchInput'),
      searchClear: document.getElementById('searchClear'),
      categoryFilters: document.getElementById('categoryFilters'),
      recommendedContent: document.getElementById('recommendedContent'),
      popularContent: document.getElementById('popularContent'),
      historyPanel: document.getElementById('historyPanel'),
      historyToggle: document.getElementById('historyToggle'),
      historyList: document.getElementById('historyList'),
      clearHistory: document.getElementById('clearHistory'),
      emojiModal: document.getElementById('emojiModal'),
      modalClose: document.getElementById('modalClose'),
      modalEmoji: document.getElementById('modalEmoji'),
      modalEmojiName: document.getElementById('modalEmojiName'),
      modalKeywords: document.getElementById('modalKeywords'),
      copyEmoji: document.getElementById('copyEmoji'),
      downloadSvg: document.getElementById('downloadSvg'),
      downloadPng: document.getElementById('downloadPng'),
      toast: document.getElementById('toast'),
      noResults: document.getElementById('noResults'),
      loading: document.getElementById('loading'),
      subcategoryTags: document.getElementById('subcategoryTags'),
      subcategoryButtons: document.getElementById('subcategoryButtons'),
      // 언어 관련 요소들
      languageBtns: document.querySelectorAll('.search-lang-btn'),
      logoText: document.getElementById('logoText'),
      tagline: document.getElementById('tagline'),
      searchInput: document.getElementById('searchInput'),
      // 폰트 관련 요소들
      fontInput: document.getElementById('fontInput'),
      fontOutput: document.getElementById('fontOutput'),
      fontPrev: document.getElementById('fontPrev'),
      fontNext: document.getElementById('fontNext'),
      fontStyleName: document.getElementById('fontStyleName'),
      // 연관 이모티콘 요소들
      relatedEmojis: document.getElementById('relatedEmojis'),
      relatedTitle: document.getElementById('relatedTitle'),
      relatedTrack: document.getElementById('relatedTrack'),
      sliderPrev: document.getElementById('sliderPrev'),
      sliderNext: document.getElementById('sliderNext'),
      // 스킨톤 팔레트 요소들
      skintonePalette: document.getElementById('skintonePalette')
    };
  }

  // 이벤트 바인딩
  bindEvents() {
    this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    this.elements.searchClear.addEventListener('click', () => this.clearSearch());

    // 언어 전환 이벤트
    this.elements.languageBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.switchLanguage(e.target.dataset.lang));
    });

    // 이벤트 위임 사용
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-category]')) this.handleCategoryFilter(e.target.dataset.category);
      if (e.target.matches('[data-subcategory]')) this.handleSubcategoryFilter(e.target.dataset.subcategory);
    });

    // 인스타 폰트 이벤트
    this.elements.fontInput.addEventListener('input', (e) => this.handleFontInput(e.target.value));
    this.elements.fontPrev.addEventListener('click', () => this.prevFontStyle());
    this.elements.fontNext.addEventListener('click', () => this.nextFontStyle());
    this.elements.fontOutput.addEventListener('click', () => this.copyFontText());

    // 연관 이모티콘 슬라이드 이벤트
    this.elements.sliderPrev.addEventListener('click', () => this.slideRelated(-1));
    this.elements.sliderNext.addEventListener('click', () => this.slideRelated(1));

    // 연관 이모티콘 슬라이드 초기화
    this.currentSlideIndex = 0;
    this.relatedEmojisData = [];

    this.elements.historyToggle.addEventListener('click', () => this.toggleHistoryPanel());
    this.elements.clearHistory.addEventListener('click', () => this.clearAllHistory());

    this.elements.modalClose.addEventListener('click', () => this.closeModal());
    this.elements.emojiModal.addEventListener('click', (e) => {
      if (e.target === this.elements.emojiModal) this.closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });

    this.elements.copyEmoji.addEventListener('click', () => this.copyCurrentEmoji());
    this.elements.downloadSvg.addEventListener('click', () => this.downloadCurrentEmoji('svg'));
    this.elements.downloadPng.addEventListener('click', () => this.downloadCurrentEmoji('png'));

    // 스킨톤 팔레트 클릭 이벤트
    this.elements.skintonePalette.addEventListener('click', (e) => {
      if (e.target.classList.contains('skintone-dot')) {
        const skintone = e.target.dataset.skintone;
        this.applyModalSkintone(skintone);

        // 선택된 상태 표시
        this.elements.skintonePalette.querySelectorAll('.skintone-dot').forEach(dot => {
          dot.classList.remove('active');
        });
        e.target.classList.add('active');
      }
    });


    this.elements.emojiGrid.addEventListener('click', (e) => {
      const emojiItem = e.target.closest('.emoji-item');
      if (emojiItem) {
        const emojiData = JSON.parse(emojiItem.dataset.emoji);
        this.handleEmojiClick(emojiData);
      }
    });
  }

  // 추천 시스템 설정
  setupRecommendations() {
    this.renderRecommended();
    this.renderPopular();

    // 주기적으로 추천 이모지 업데이트 (30초마다)
    this.recommendedTimer = setInterval(() => {
      this.renderRecommended();
    }, 30000);

    // 주기적으로 인기 이모지 업데이트 (45초마다)  
    this.popularTimer = setInterval(() => {
      this.renderPopular();
    }, 45000);

    // 페이지 언로드시 타이머 정리
    window.addEventListener('beforeunload', () => {
      if (this.recommendedTimer) clearInterval(this.recommendedTimer);
      if (this.popularTimer) clearInterval(this.popularTimer);
    });
  }

  // 추천 이모지 렌더링
  renderRecommended() {
    // 다양한 추천 이모지 풀
    const recommendedPool = [
      // 특별한 이모지들
      '🌟', '💫', '✨', '🎨', '🚀', '💎', '🔮', '🎯', '🏆', '🎪', '🎭', '🌈', '🦄', '🔥', '💝',
      // 감정 이모지들
      '🥰', '😍', '🤩', '😇', '🤗', '😊', '😂', '🥳', '😌', '🤤',
      // 재미있는 이모지들
      '🎉', '🎈', '🎁', '🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🌿',
      // 동물들
      '🐱', '🐶', '🐰', '🦊', '🐻', '🐼', '🦄', '🐸', '🦋', '🐧',
      // 음식들
      '🍰', '🧁', '🍭', '🍪', '🍯', '🍓', '🍇', '🥝', '🍑', '🥭',
      // 활동들
      '⭐', '💖', '💕', '💗', '💘', '💝', '🎵', '🎶', '🎼', '🎤'
    ];

    // 사용자 복사 기록을 바탕으로 개인화된 추천 추가
    const recentEmojis = this.copyHistory.slice(0, 5).map(item => item.emoji);
    const personalizedEmojis = recentEmojis.length > 0 ? recentEmojis : [];

    // 개인화된 이모지와 추천 풀을 합쳐서 랜덤 선택
    const combinedPool = [...personalizedEmojis, ...recommendedPool.filter(emoji => !personalizedEmojis.includes(emoji))];
    const shuffled = combinedPool.sort(() => 0.5 - Math.random());
    const recommended = shuffled.slice(0, 15);

    // 부드러운 업데이트 애니메이션
    this.elements.recommendedContent.classList.add('updating');

    setTimeout(() => {
      this.elements.recommendedContent.innerHTML = recommended.map(emoji => {
        const emojiData = this.findEmojiData(emoji);
        const isFlag = emojiData && emojiData.main_category === 'Flags';
        return `<span class="rec-emoji${isFlag ? ' flag-emoji' : ''}" data-emoji="${emoji}">${emoji}</span>`;
      }).join('');
      this.elements.recommendedContent.classList.remove('updating');
    }, 150);

    // 클릭 이벤트는 한 번만 등록 (중복 방지)
    if (!this.elements.recommendedContent.hasAttribute('data-events-bound')) {
      this.elements.recommendedContent.setAttribute('data-events-bound', 'true');
      this.elements.recommendedContent.addEventListener('click', (e) => {
        if (e.target.classList.contains('rec-emoji')) {
          const emojiData = this.findEmojiData(e.target.dataset.emoji);
          if (emojiData) this.handleEmojiClick(emojiData);
        }
      });
    }
  }

  // 인기 이모지 렌더링
  renderPopular() {
    // 실제 인기 있는 이모지들의 큰 풀
    const popularPool = [
      // 기본 인기 이모지들
      '😀', '😂', '❤️', '😍', '🤔', '😭', '👍', '👎', '🙏', '💪', '👏', '😎', '😊', '🎉', '💯', '🔥',
      // 새로운 인기 이모지들
      '🥰', '🤩', '😇', '🤗', '🥳', '😌', '🤤', '🥱', '🤨', '🤐',
      // 하트 시리즈
      '💖', '💕', '💗', '💘', '💝', '💙', '💚', '💛', '💜', '🖤',
      // 제스처들
      '✌️', '🤞', '🤟', '🤘', '👌', '👊', '✊', '🤝', '👋', '🤚',
      // 활동/상황
      '😴', '🤒', '🤕', '🥵', '🥶', '😵', '🤪', '🤯', '🥺', '🥴',
      // 기타 인기
      '✨', '🌟', '⭐', '🎯', '🎪', '🎭', '🎨', '🚀', '💎', '🔮'
    ];

    // 시간대별로 다른 가중치 적용
    const hour = new Date().getHours();
    let weightedPool = [];

    if (hour >= 6 && hour < 12) {
      // 아침 시간대 - 활기찬 이모지들
      weightedPool = ['😊', '☀️', '🌅', '☕', '🥰', '😍', '👍', '💪', '🎯', '🚀', '✨', '🌟', '😀', '😇', '🤗', '😌'];
    } else if (hour >= 12 && hour < 18) {
      // 오후 시간대 - 일반적인 인기 이모지들
      weightedPool = ['😂', '🤔', '👏', '💯', '🔥', '❤️', '😍', '🥳', '🎉', '😎', '🤩', '💖', '✌️', '👌', '😊', '🙏'];
    } else if (hour >= 18 && hour < 22) {
      // 저녁 시간대 - 편안한 이모지들
      weightedPool = ['😌', '🥰', '💕', '🍕', '🍰', '🎵', '📚', '🌙', '⭐', '💖', '😇', '🤗', '🍯', '🌸', '🎭', '💝'];
    } else {
      // 밤 시간대 - 조용한 이모지들
      weightedPool = ['😴', '🌙', '⭐', '✨', '💫', '🌟', '😌', '💤', '🥱', '🌃', '🦉', '💜', '🖤', '🔮', '🌌', '💙'];
    }

    // 가중치가 적용된 풀과 전체 풀을 섞어서 사용
    const combinedPool = [...weightedPool, ...popularPool.filter(emoji => !weightedPool.includes(emoji))];
    const shuffled = combinedPool.sort(() => 0.5 - Math.random());
    const popular = shuffled.slice(0, 16);

    // 부드러운 업데이트 애니메이션
    this.elements.popularContent.classList.add('updating');

    setTimeout(() => {
      this.elements.popularContent.innerHTML = popular.map(emoji => {
        const emojiData = this.findEmojiData(emoji);
        const isFlag = emojiData && emojiData.main_category === 'Flags';
        return `<span class="rec-emoji${isFlag ? ' flag-emoji' : ''}" data-emoji="${emoji}">${emoji}</span>`;
      }).join('');
      this.elements.popularContent.classList.remove('updating');
    }, 150);

    // 클릭 이벤트는 한 번만 등록 (중복 방지)
    if (!this.elements.popularContent.hasAttribute('data-events-bound')) {
      this.elements.popularContent.setAttribute('data-events-bound', 'true');
      this.elements.popularContent.addEventListener('click', (e) => {
        if (e.target.classList.contains('rec-emoji')) {
          const emojiData = this.findEmojiData(e.target.dataset.emoji);
          if (emojiData) this.handleEmojiClick(emojiData);
        }
      });
    }
  }

  // 이모지 데이터 찾기
  findEmojiData(emoji) {
    return this.allEmojis.find(item => item.emoji === emoji) || { emoji: emoji, name_ko: '이모지', keywords: '', main_category: 'unknown' };
  }

  // 언어 전환
  switchLanguage(lang) {
    this.currentLanguage = lang;

    // 언어 버튼 활성화 상태 변경
    this.elements.languageBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // UI 텍스트 업데이트
    this.updateUITexts();

    // 폰트 스타일 이름 업데이트
    this.updateFontStyleName();

    // 이모지 표시명 업데이트
    this.renderEmojis();
  }

  // UI 텍스트 업데이트
  updateUITexts() {
    const texts = {
      ko: {
        logoText: '이모지 월드',
        tagline: '모든 이모지를 한 곳에서 쉽게 찾고 복사하세요',
        searchPlaceholder: '이모지나 키워드 검색...',
        recommendedTitle: '✨ 추천 이모지',
        fontTitle: '🎨 인스타 폰트',
        popularTitle: '🔥 인기 이모지',
        recentCopyTitle: '최근 복사',
        categories: {
          'all': '전체', 'smileys': '😊 표정', 'people': '👋 사람', 'hands': '👌 손동작',
          'animals': '🐶 동물', 'food': '🍕 음식', 'activities': '⚽ 활동', 'travel': '✈️ 여행',
          'festivals': '🎃 축제', 'objects': '📱 사물', 'symbols': '❤️ 기호', 'flags': '🇰🇷 국기',
          'professions': '👨‍💼 직업', 'status': '✅ 상태'
        }
      },
      en: {
        logoText: 'Emoji World',
        tagline: 'Find and copy all emojis easily in one place',
        searchPlaceholder: 'Search emojis or keywords...',
        recommendedTitle: '✨ Recommended',
        fontTitle: '🎨 IG Fonts',
        popularTitle: '🔥 Popular',
        recentCopyTitle: 'Recent',
        categories: {
          'all': 'All', 'smileys': '😊 Smileys', 'people': '👋 People', 'hands': '👌 Hands',
          'animals': '🐶 Animals', 'food': '🍕 Food', 'activities': '⚽ Activities', 'travel': '✈️ Travel',
          'festivals': '🎃 Festivals', 'objects': '📱 Objects', 'symbols': '❤️ Symbols', 'flags': '🇰🇷 Flags',
          'professions': '👨‍💼 Jobs', 'status': '✅ Status'
        }
      }
    };

    const currentTexts = texts[this.currentLanguage];

    // 헤더 텍스트
    this.elements.logoText.textContent = currentTexts.logoText;
    this.elements.tagline.textContent = currentTexts.tagline;
    this.elements.searchInput.placeholder = currentTexts.searchPlaceholder;

    // 추천 박스 타이틀들
    const recommendedTitle = document.querySelector('#recommendedBox .rec-title');
    const fontTitle = document.querySelector('#fontBox .rec-title');
    const popularTitle = document.querySelector('#popularBox .rec-title');
    const recentTitle = document.querySelector('.history-header h3');

    if (recommendedTitle) recommendedTitle.textContent = currentTexts.recommendedTitle;
    if (fontTitle) fontTitle.textContent = currentTexts.fontTitle;
    if (popularTitle) popularTitle.textContent = currentTexts.popularTitle;
    if (recentTitle) recentTitle.textContent = currentTexts.recentCopyTitle;

    // 카테고리 버튼 텍스트
    Object.entries(currentTexts.categories).forEach(([category, text]) => {
      const btn = document.querySelector(`[data-category="${category}"]`);
      if (btn) btn.textContent = text;
    });
  }

  // 검색 처리
  handleSearch(query) {
    this.searchQuery = query.trim().toLowerCase();
    this.elements.searchClear.classList.toggle('show', !!this.searchQuery);
    this.filterAndRender();
  }

  // 검색 지우기
  clearSearch() {
    this.elements.searchInput.value = '';
    this.searchQuery = '';
    this.elements.searchClear.classList.remove('show');
    this.filterAndRender();
  }

  // 카테고리 필터 처리
  handleCategoryFilter(category) {
    this.currentCategory = category;
    this.currentSubcategory = null;
    this.elements.categoryFilters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });
    this.elements.subcategoryTags.style.display = 'none';
    this.filterAndRender();
  }

  // 이모지 필터링 및 렌더링 통합
  filterAndRender() {
    this.filterEmojis();
    this.renderEmojis();
  }


  // 하위 카테고리 필터 처리
  handleSubcategoryFilter(subcategory) {
    this.currentSubcategory = subcategory;
    this.elements.subcategoryButtons.querySelectorAll('.subcategory-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.subcategory === subcategory);
    });
    this.filterAndRender();
  }

  // 인스타 폰트 기능들
  handleFontInput(text) {
    this.inputText = text || 'Hello';
    this.updateFontOutput();
  }

  nextFontStyle() {
    this.currentFontIndex = (this.currentFontIndex + 1) % this.fontStyles.length;
    this.updateFontOutput();
    this.updateFontStyleName();
  }

  prevFontStyle() {
    this.currentFontIndex = this.currentFontIndex === 0 ? this.fontStyles.length - 1 : this.currentFontIndex - 1;
    this.updateFontOutput();
    this.updateFontStyleName();
  }

  updateFontOutput() {
    const currentStyle = this.fontStyles[this.currentFontIndex];

    // 문제가 있는 스타일들은 fallback 변환 사용
    const transformedText = this.fontConverter.convertWithFallback(this.inputText, currentStyle.key);

    // HTML이 포함된 경우와 일반 텍스트 처리
    if (transformedText.includes('<span')) {
      this.elements.fontOutput.innerHTML = transformedText;
    } else {
      this.elements.fontOutput.textContent = transformedText;
    }
  }

  updateFontStyleName() {
    const currentStyle = this.fontStyles[this.currentFontIndex];
    const styleName = this.fontConverter.getStyleName(currentStyle.key, this.currentLanguage);
    this.elements.fontStyleName.textContent = styleName;
  }

  async copyFontText() {
    // HTML 포함된 경우 텍스트만 추출, 일반 텍스트는 그대로
    const textToCopy = this.elements.fontOutput.textContent || this.elements.fontOutput.innerText;
    const success = await this.copyToClipboard(textToCopy);
    if (success) {
      this.showToast('폰트 텍스트가 복사되었습니다!');
    } else {
      this.showToast('복사에 실패했습니다.');
    }
  }

  // 폰트 변환 함수들은 FontConverter 클래스로 이동됨

  // 이모지 렌더링
  renderEmojis() {
    if (this.filteredEmojis.length === 0) {
      this.elements.emojiGrid.style.display = 'none';
      this.elements.noResults.style.display = 'block';
      return;
    }

    this.elements.emojiGrid.style.display = 'grid';
    this.elements.noResults.style.display = 'none';

    this.elements.emojiGrid.innerHTML = this.filteredEmojis.map(emoji => {
      // 언어에 따른 이름 선택
      const displayName = this.currentLanguage === 'ko' ?
        (emoji.name_ko || emoji.name || '') :
        (emoji.name_en || emoji.name || '');

      // 국기 이모지인 경우 추가 CSS 클래스
      const isFlag = emoji.main_category === 'Flags';

      return `
          <div class="emoji-item" data-emoji='${JSON.stringify(emoji)}'>
            <div class="emoji-char${isFlag ? ' flag-emoji' : ''}">${emoji.emoji}</div>
            <div class="emoji-name">${displayName}</div>
            ${emoji.skintones ? '<button class="skintone-trigger" title="스킨톤 변경">🎨</button>' : ''}
          </div>
        `;
    }).join('');
  }

  // 이모지 필터링
  filterEmojis() {
    // 카테고리 이름 매핑
    const categoryMap = {
      'smileys': 'Smileys & Emotion',
      'people': 'People & Body',
      'hands': 'Hand Gestures',
      'animals': 'Animals & Nature',
      'food': 'Food & Drink',
      'activities': 'Activities',
      'travel': 'Travel & Places',
      'festivals': 'Festivals & Events',
      'objects': 'Objects',
      'symbols': 'Symbols',
      'flags': 'Flags',
      'professions': 'Professions',
      'status': 'Status & Notification'
    };

    this.filteredEmojis = this.allEmojis.filter(emoji => {
      const searchMatch = !this.searchQuery ||
        (emoji.name_ko && emoji.name_ko.toLowerCase().includes(this.searchQuery)) ||
        (emoji.name_en && emoji.name_en.toLowerCase().includes(this.searchQuery)) ||
        (emoji.keywords && emoji.keywords.toLowerCase().includes(this.searchQuery));

      if (!searchMatch) return false;

      if (this.currentCategory === 'all') return true;

      // 특수 카테고리 처리
      if (this.currentCategory === 'hands') {
        return emoji.sub_category === 'Hand Gestures';
      } else if (this.currentCategory === 'status') {
        return emoji.sub_category === 'Status & Notification';
      } else if (this.currentCategory === 'professions') {
        return emoji.sub_category === 'Professions' || emoji.main_category === 'Professions';
      }

      // 일반 카테고리
      const mappedCategory = categoryMap[this.currentCategory];
      return emoji.main_category === mappedCategory;
    });
  }

  async handleEmojiClick(emojiData) {
    this.openModal(emojiData);
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('복사 실패:', err);
      return false;
    }
  }

  addToHistory(emojiData) {
    this.copyHistory = this.copyHistory.filter(item => item.emoji !== emojiData.emoji);
    this.copyHistory.unshift({ ...emojiData, copiedAt: new Date().toISOString() });
    if (this.copyHistory.length > 50) this.copyHistory.length = 50;
    this.saveCopyHistory();
    this.renderHistory();
  }

  renderHistory() {
    if (this.copyHistory.length === 0) {
      this.elements.historyList.innerHTML = '';
      return;
    }
    this.elements.historyList.innerHTML = this.copyHistory.map(item => `
            <div class="history-emoji-item" data-emoji='${JSON.stringify(item)}' title="${item.name_ko || item.name}">
                ${item.emoji}
                <button class="history-remove" data-emoji="${item.emoji}">×</button>
            </div>
        `).join('');
    this.elements.historyList.querySelectorAll('.history-emoji-item').forEach(item => {
      item.addEventListener('click', async (e) => {
        const emojiData = JSON.parse(item.dataset.emoji);
        if (e.target.classList.contains('history-remove')) {
          e.stopPropagation();
          this.removeFromHistory(emojiData.emoji);
        } else {
          await this.copyToClipboard(emojiData.emoji);
          this.showToast(`${emojiData.emoji} 다시 복사됨!`);
        }
      });
    });
  }

  removeFromHistory(emoji) {
    this.copyHistory = this.copyHistory.filter(item => item.emoji !== emoji);
    this.saveCopyHistory();
    this.renderHistory();
  }

  openModal(emojiData) {
    this.currentModalEmoji = emojiData;

    // 기본 모달 데이터 설정
    this.elements.modalEmoji.textContent = emojiData.emoji;
    this.elements.modalEmojiName.textContent = this.currentLanguage === 'ko'
      ? (emojiData.name_ko || emojiData.name || '')
      : (emojiData.name_en || emojiData.name || '');
    this.elements.modalKeywords.textContent = emojiData.keywords || '';

    // 국기 이모지인 경우 CSS 클래스 추가
    if (emojiData.main_category === 'Flags') {
      this.elements.modalEmoji.classList.add('flag-emoji');
    } else {
      this.elements.modalEmoji.classList.remove('flag-emoji');
    }

    // 스킨톤 팔레트 표시/숨김 처리
    if (isSkinToneSupported(emojiData.emoji)) {
      this.elements.skintonePalette.style.display = 'flex';

      // 현재 이모지의 스킨톤 상태 확인
      const currentSkinTone = this.getCurrentSkinTone(emojiData.emoji);

      // 모든 스킨톤 버튼의 활성화 상태 초기화
      this.elements.skintonePalette.querySelectorAll('.skintone-dot').forEach(dot => {
        dot.classList.remove('active');
      });

      // 현재 스킨톤에 해당하는 버튼 활성화
      const activeButton = this.elements.skintonePalette.querySelector(`[data-skintone="${currentSkinTone}"]`);
      if (activeButton) {
        activeButton.classList.add('active');
      }
    } else {
      this.elements.skintonePalette.style.display = 'none';
    }

    // 연관 이모티콘 렌더링
    this.renderRelatedEmojis(emojiData);

    this.elements.emojiModal.classList.add('show');
  }

  closeModal() {
    this.elements.emojiModal.classList.remove('show');
    this.currentModalEmoji = null;
  }

  toggleHistoryPanel() {
    const isOpen = this.elements.historyPanel.classList.toggle('open');
    this.elements.historyToggle.textContent = isOpen ? '❌' : '📋';
  }

  async copyCurrentEmoji() {
    if (!this.currentModalEmoji) return;

    const success = await this.copyToClipboard(this.currentModalEmoji.emoji);
    if (success) {
      this.addToHistory(this.currentModalEmoji);
      this.showToast('이모지가 복사되었습니다!');
      this.closeModal();
    } else {
      this.showToast('복사에 실패했습니다.');
    }
  }

  downloadCurrentEmoji(format) {
    if (!this.currentModalEmoji) return;

    const emoji = this.currentModalEmoji.emoji;
    const name = this.currentModalEmoji.name_ko || this.currentModalEmoji.name || 'emoji';
    const filename = `${name}_${emoji}.${format}`;

    if (format === 'svg') {
      this.downloadAsSVG(emoji, filename);
    } else if (format === 'png') {
      this.downloadAsPNG(emoji, filename);
    }
  }


  clearAllHistory() {
    if (confirm('복사 기록을 모두 삭제하시겠습니까?')) {
      this.copyHistory = [];
      this.saveCopyHistory();
      this.renderHistory();
    }
  }

  toggleHistoryPanel() {
    this.elements.historyPanel.classList.toggle('collapsed');
  }

  closeModal() {
    this.elements.emojiModal.classList.remove('show');
    this.currentModalEmoji = null;
  }

  async copyCurrentEmoji() {
    if (this.currentModalEmoji) {
      await this.copyToClipboard(this.currentModalEmoji.emoji);
      this.addToHistory(this.currentModalEmoji);
      this.showToast(`${this.currentModalEmoji.emoji} 복사됨!`);
      this.closeModal();
    }
  }

  downloadCurrentEmoji(format) {
    if (!this.currentModalEmoji) return;
    const emoji = this.currentModalEmoji.emoji;
    const filename = `${(this.currentModalEmoji.name_ko || this.currentModalEmoji.name).replace(/\s+/g, '_')}.${format}`;
    if (format === 'svg') this.downloadAsSVG(emoji, filename);
    else if (format === 'png') this.downloadAsPNG(emoji, filename);
  }

  downloadAsSVG(emoji, filename) {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><text x="50%" y="50%" text-anchor="middle" dy=".35em" font-size="96" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji">${emoji}</text></svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    this.downloadBlob(blob, filename);
  }

  downloadAsPNG(emoji, filename) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 128;
    canvas.width = size;
    canvas.height = size;
    ctx.font = '96px Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2);
    canvas.toBlob((blob) => this.downloadBlob(blob, filename), 'image/png');
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  showToast(message) {
    this.elements.toast.querySelector('.toast-message').textContent = message;
    this.elements.toast.classList.add('show');
    setTimeout(() => this.elements.toast.classList.remove('show'), 2000);
  }

  loadCopyHistory() {
    try {
      const stored = localStorage.getItem('emojiCopyHistory');
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('히스토리 로드 실패:', err);
      return [];
    }
  }

  saveCopyHistory() {
    try {
      localStorage.setItem('emojiCopyHistory', JSON.stringify(this.copyHistory));
    } catch (err) {
      console.error('히스토리 저장 실패:', err);
    }
  }

  hideLoading() {
    this.elements.loading.classList.add('hide');
  }

  // 연관 이모티콘 슬라이드 기능 - 페이지 단위
  slideRelated(direction) {
    if (this.relatedEmojisData.length === 0) {
      console.log('slideRelated: 데이터 없음');
      return;
    }

    const itemsPerPage = 6; // 한 페이지에 보여질 이모지 개수
    const totalPages = Math.ceil(this.relatedEmojisData.length / itemsPerPage);

    // 페이지 인덱스 업데이트 (루프 구조)
    this.currentPageIndex = this.currentPageIndex || 0;
    this.currentPageIndex += direction;

    // 루프 처리: 마지막 페이지에서 다음을 누르면 처음으로, 첫 페이지에서 이전을 누르면 마지막으로
    if (this.currentPageIndex >= totalPages) {
      this.currentPageIndex = 0;
    } else if (this.currentPageIndex < 0) {
      this.currentPageIndex = totalPages - 1;
    }

    // 현재 페이지에 표시할 이모지들 추출
    const startIdx = this.currentPageIndex * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentPageEmojis = this.relatedEmojisData.slice(startIdx, endIdx);

    console.log(`slideRelated: 페이지 ${this.currentPageIndex + 1}/${totalPages}, 이모지 ${currentPageEmojis.length}개`);

    // 연관 이모지 HTML 다시 생성
    this.elements.relatedTrack.innerHTML = currentPageEmojis.map(relatedEmoji => {
      const isFlag = relatedEmoji.main_category === 'Flags';
      return `
        <div class="related-emoji${isFlag ? ' flag-emoji' : ''}" 
             data-emoji="${relatedEmoji.emoji}" 
             title="${this.currentLanguage === 'ko' ? relatedEmoji.name_ko : relatedEmoji.name_en}">
          ${relatedEmoji.emoji}
        </div>
      `;
    }).join('');

    // 루프 구조에서는 버튼을 비활성화하지 않음 (항상 순환 가능)
    this.elements.sliderPrev.classList.remove('disabled');
    this.elements.sliderNext.classList.remove('disabled');
  }

  // 연관 이모티콘 생성
  generateRelatedEmojis(emoji) {
    const related = [];

    // 1. 같은 카테고리의 이모지들
    const sameCategory = this.allEmojis.filter(e =>
      e.main_category === emoji.main_category &&
      e.emoji !== emoji.emoji
    ).slice(0, 10);
    related.push(...sameCategory);

    // 2. 같은 서브 카테고리의 이모지들
    if (emoji.sub_category) {
      const sameSubCategory = this.allEmojis.filter(e =>
        e.sub_category === emoji.sub_category &&
        e.emoji !== emoji.emoji &&
        !related.some(r => r.emoji === e.emoji)
      ).slice(0, 8);
      related.push(...sameSubCategory);
    }

    // 3. 키워드가 비슷한 이모지들
    const emojiKeywords = emoji.keywords.toLowerCase().split(', ');
    const keywordMatches = this.allEmojis.filter(e => {
      if (e.emoji === emoji.emoji || related.some(r => r.emoji === e.emoji)) return false;
      const eKeywords = e.keywords.toLowerCase();
      return emojiKeywords.some(keyword => eKeywords.includes(keyword));
    }).slice(0, 6);
    related.push(...keywordMatches);

    // 4. 랜덤 인기 이모지 추가
    if (related.length < 18) {
      const popularEmojis = ['😂', '🥰', '😍', '😁', '👍', '👏', '🎉', '❤️', '😊', '🙏', '💪', '😎', '🤩', '🥳', '🎆', '✨'];
      const randomPopular = this.allEmojis.filter(e =>
        popularEmojis.includes(e.emoji) &&
        e.emoji !== emoji.emoji &&
        !related.some(r => r.emoji === e.emoji)
      );
      related.push(...randomPopular.slice(0, 18 - related.length));
    }

    return related.slice(0, 24); // 최대 24개 (4페이지)
  }

  // 연관 이모티콘 렌더링
  renderRelatedEmojis(emoji) {
    this.relatedEmojisData = this.generateRelatedEmojis(emoji);
    this.currentPageIndex = 0; // 페이지 인덱스 초기화

    console.log('연관 이모티콘 데이터:', this.relatedEmojisData.length, '개'); // 디버깅

    if (this.relatedEmojisData.length === 0) {
      console.log('연관 이모티콘 없음'); // 디버깅
      this.elements.relatedEmojis.style.display = 'none';
      return;
    }

    this.elements.relatedEmojis.style.display = 'block';
    this.elements.relatedTitle.textContent = this.currentLanguage === 'ko' ? '연관 이모티콘' : 'Related Emojis';

    // 첫 번째 페이지 렌더링
    this.slideRelated(0); // 처음 페이지 표시

    // 연관 이모지 클릭 이벤트 (중복 방지)
    if (!this.elements.relatedTrack.hasAttribute('data-events-bound')) {
      this.elements.relatedTrack.setAttribute('data-events-bound', 'true');
      this.elements.relatedTrack.addEventListener('click', (e) => {
        if (e.target.classList.contains('related-emoji')) {
          const emojiChar = e.target.dataset.emoji;
          const emojiData = this.allEmojis.find(emoji => emoji.emoji === emojiChar);
          if (emojiData) {
            this.openModal(emojiData);
          }
        }
      });
    }
  }

  // 현재 이모지의 스킨톤 상태를 확인하는 함수
  getCurrentSkinTone(emoji) {
    // 스킨톤 유니코드 패턴으로 현재 스킨톤 찾기
    const skinToneMatches = emoji.match(/[\u{1F3FB}-\u{1F3FF}]/gu);

    if (!skinToneMatches || skinToneMatches.length === 0) {
      return ''; // 기본 스킨톤
    }

    // 첫 번째 스킨톤 유니코드를 해당 키로 변환
    const skinToneUnicode = skinToneMatches[0];
    for (const [key, value] of Object.entries(SKIN_TONES)) {
      if (value === skinToneUnicode) {
        return key;
      }
    }

    return ''; // 기본값
  }

  // 모달 내 스킨톤 적용 (새로운 유니코드 조합 방식)
  applyModalSkintone(skintone) {
    if (!this.currentModalEmoji) {
      return;
    }

    // 스킨톤 지원 여부 확인
    if (skintone !== '' && !isSkinToneSupported(this.currentModalEmoji.emoji)) {
      return;
    }

    // 유니코드 조합으로 스킨톤 적용
    const newEmoji = applySkinTone(this.currentModalEmoji.emoji, skintone);

    // 새로운 이모지 데이터 생성
    const newEmojiData = {
      ...this.currentModalEmoji,
      emoji: newEmoji
    };

    // 모달 업데이트
    this.currentModalEmoji = newEmojiData;
    this.elements.modalEmoji.textContent = newEmoji;

    // 연관 이모티콘 다시 렌더링 (새로운 이모지 기준으로)
    this.renderRelatedEmojis(newEmojiData);
  }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 플랫폼별 최적화 폰트 먼저 적용
  applyOptimizedFonts();

  // 메인 앱 초기화
  new EmojiApp();

  // 앱 로딩 후 렌더링 최적화 적용 (충분한 지연)
  setTimeout(() => {
    // 이모지 렌더링 문제 감지 및 fallback
    const isRenderingOk = detectAndFixEmojiRendering();

    // 렌더링 문제가 있을 때만 Twemoji 적용
    if (!isRenderingOk) {
      applyTwemoji();
    }
  }, 500);
});

// 서비스 워커 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg))
      .catch(err => console.log('SW registration failed:', err));
  });
}

/* === 정확도 보정 검색 === */
(function () {
  const STAR_EXCLUDE = ['별로', '특별', '구별', '차별', '식별', '분별', '개별', '별칭', '별개', '별도', '별안간'];

  function starWordMatch(s) {
    if (!s) return false;
    const str = String(s).toLowerCase();
    if (STAR_EXCLUDE.some(x => str.includes(x))) return false;

    // 한국어 '별'이 '단어'처럼 쓰인 경우만 허용
    return (
      str.trim() === '별' ||                     // 정확히 '별'
      str.includes(' 별') || str.includes('별 ') || // 공백 경계
      str.startsWith('별') ||                     // '별자리', '별똥별' 등
      str.includes('별자리') || str.includes('별똥별') ||
      str.includes('반짝이는 별') ||
      str.includes('glowing star') || str.includes('shooting star') || str.includes(' star')
    );
  }

  function fields(e) { return [(e.name_ko || ''), (e.name_en || ''), (e.keywords || '')]; }

  function matchEmoji(e, q) {
    const qn = q.trim().toLowerCase();
    const [ko, en, kw] = fields(e).map(v => v.toLowerCase());

    // '별' 특수 처리
    if (qn === '별') return [ko, en, kw].some(starWordMatch);

    // 일반 쿼리: 부분포함(기존 동작 유지)
    return [ko, en, kw].some(v => v.includes(qn));
  }

  function score(e, q) {
    let s = 0;
    const ko = (e.name_ko || '');
    if (q.trim() === '별') {
      if (['⭐', '🌟', '✨', '🌠', '🔯'].includes(e.emoji)) s += 80;
      if (ko === '별') s += 100;
      if (ko.startsWith('별')) s += 40;               // 별자리, 별똥별 등
      if ((e.keywords || '').includes('별자리')) s += 30;
    }
    return s;
  }

  // drop-in: 기존 검색 사용부에서 이 함수로 바꿔 호출
  window.searchEmojisAccurate = function (list, query) {
    const res = list.filter(e => matchEmoji(e, query));
    // 중복 제거(같은 이모지 중복 방지)
    const seen = new Set();
    const uniq = [];
    for (const e of res) {
      if (seen.has(e.emoji)) continue;
      seen.add(e.emoji);
      uniq.push(e);
    }
    // 랭킹 정렬
    uniq.sort((a, b) => score(b, query) - score(a, query));
    return uniq;
  };
})();

// ===== 상단 라인 맞춤: 우측 '최근 복사'와 좌측 결과 그리드의 윗선 정렬 =====
function alignResultsTopWithSidebar() {
  const sidebar = document.querySelector('.recent-copy, .recent-copies, .recent-panel, .sidebar .card:first-child');
  const grid = document.querySelector('.emoji-grid, .emoji-list, .emoji-results');
  if (!sidebar || !grid) return;

  const sTop = sidebar.getBoundingClientRect().top + window.scrollY;
  const gTop = grid.getBoundingClientRect().top + window.scrollY;
  const delta = Math.round(sTop - gTop);

  if (delta !== 0) {
    const cur = parseFloat(getComputedStyle(grid).marginTop) || 0;
    grid.style.marginTop = (cur + delta) + 'px';
  }
}
window.addEventListener('load', alignResultsTopWithSidebar);
window.addEventListener('resize', alignResultsTopWithSidebar);

// ===== 공백 원인 제거: 'ff' 같은 텍스트 노드 + 빈 슬롯 접기 =====
(function collapseGaps() {
  const domReady = (fn) =>
    (document.readyState === 'loading')
      ? document.addEventListener('DOMContentLoaded', fn)
      : fn();

  domReady(() => {
    // 1) 'ff' 같은 노이즈 텍스트 노드 제거
    const scope = document.querySelector('.main-content') || document.body;
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const trash = [];
    while (walker.nextNode()) {
      const s = (walker.currentNode.textContent || '').trim().toLowerCase();
      if (s === 'ff' || s === 'f' || s === 'ads' || s === 'ad') trash.push(walker.currentNode);
    }
    trash.forEach(n => n.remove());

    // 2) 비어 있는 광고/배너 컨테이너 접기
    const adSel = [
      'ins.adsbygoogle', '.adsbygoogle', '.ad-slot', '.ad-container', '.ad-banner',
      '.gpt-ad', '#gpt-ad', '[id^="google_ads_iframe_"]'
    ];
    document.querySelectorAll(adSel.join(',')).forEach(el => {
      const hasElementChild = el.querySelector('*') !== null;
      const txt = (el.textContent || '').trim();
      const noise = txt === '' || /^f{1,3}$/i.test(txt) || /^ad(s)?$/i.test(txt);
      if (!hasElementChild && noise) {
        Object.assign(el.style, { display: 'none', minHeight: 0, height: 0, margin: 0, padding: 0 });
      }
    });
  });
})();
