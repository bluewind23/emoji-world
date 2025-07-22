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
    this.currentEmojiForSkintone = null;
    this.selectedSkintone = '';

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
      skintoneSelector: document.getElementById('skintoneSelector'),
      skintoneClose: document.getElementById('skintoneClose'),
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
      fontStyleName: document.getElementById('fontStyleName')
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

    this.elements.skintoneClose.addEventListener('click', () => this.closeSkintoneSelector());

    document.addEventListener('click', (e) => {
      if (this.elements.skintoneSelector.classList.contains('show') && !e.target.closest('.skintone-selector') && !e.target.closest('.skintone-trigger')) {
        this.closeSkintoneSelector();
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('skintone-option')) {
        const skintone = e.target.dataset.skintone;
        this.applySkintone(skintone);
      }
    });

    this.elements.emojiGrid.addEventListener('click', (e) => {
      const skintoneBtn = e.target.closest('.skintone-trigger');
      const emojiItem = e.target.closest('.emoji-item');
      if (skintoneBtn) {
        e.stopPropagation();
        const emojiData = JSON.parse(emojiItem.dataset.emoji);
        this.showSkintoneSelector(emojiData, emojiItem);
      } else if (emojiItem) {
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
      this.elements.recommendedContent.innerHTML = recommended.map(emoji => `<span class="rec-emoji" data-emoji="${emoji}">${emoji}</span>`).join('');
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
      this.elements.popularContent.innerHTML = popular.map(emoji => `<span class="rec-emoji" data-emoji="${emoji}">${emoji}</span>`).join('');
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
      
      return `
          <div class="emoji-item" data-emoji='${JSON.stringify(emoji)}'>
            <div class="emoji-char">${emoji.emoji}</div>
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
    this.elements.modalEmoji.textContent = emojiData.emoji;
    this.elements.modalEmojiName.textContent = emojiData.name_ko || emojiData.name || '';
    this.elements.modalKeywords.textContent = emojiData.keywords || '';
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

  showSkintoneSelector(emojiData, element) {
    this.currentEmojiForSkintone = emojiData;
    const rect = element.getBoundingClientRect();
    this.elements.skintoneSelector.style.top = `${rect.bottom + 5}px`;
    this.elements.skintoneSelector.style.left = `${rect.left}px`;
    this.elements.skintoneSelector.classList.add('show');
  }

  closeSkintoneSelector() {
    this.elements.skintoneSelector.classList.remove('show');
    this.currentEmojiForSkintone = null;
  }

  applySkintone(skintone) {
    if (!this.currentEmojiForSkintone || !this.currentEmojiForSkintone.skintones) return;
    
    const skintoneEmoji = this.currentEmojiForSkintone.skintones[skintone];
    if (skintoneEmoji) {
      this.handleEmojiClick({
        ...this.currentEmojiForSkintone,
        emoji: skintoneEmoji
      });
    }
    this.closeSkintoneSelector();
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

  openModal(emojiData) {
    this.currentModalEmoji = emojiData;
    this.elements.modalEmoji.textContent = emojiData.emoji;
    this.elements.modalEmojiName.textContent = emojiData.name_ko || emojiData.name;
    this.elements.modalKeywords.textContent = (emojiData.keywords || '').replace(/,/g, ', ');
    this.elements.emojiModal.classList.add('show');
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
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => new EmojiApp());

// 서비스 워커 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg))
      .catch(err => console.log('SW registration failed:', err));
  });
}