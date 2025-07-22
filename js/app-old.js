// 이모지 사이트 메인 애플리케이션
import { emojiDataExtended, themeEmojis } from '../src/data/emojiDataExtended.js';
import { FontConverter } from './fontConverter.js';

class EmojiApp {
  constructor() {
    this.allEmojis = this.flattenEmojiData(emojiDataExtended);
    this.filteredEmojis = [...this.allEmojis];
    this.copyHistory = this.loadCopyHistory();
    this.currentCategory = 'all';
    this.currentTheme = 'all';
    this.currentFilterType = 'category';
    this.searchQuery = '';
    this.fontConverter = new FontConverter();
    
    this.initializeElements();
    this.bindEvents();
    this.setupRecommendations();
    this.renderEmojis();
    this.renderHistory();
    this.hideLoading();
  }

  // 이모지 데이터를 평면화
  flattenEmojiData(data) {
    const flattened = [];
    Object.values(data).forEach(categoryEmojis => {
      flattened.push(...categoryEmojis);
    });
    return flattened;
  }

  // DOM 요소 초기화
  initializeElements() {
    this.elements = {
      emojiGrid: document.getElementById('emojiGrid'),
      searchInput: document.getElementById('searchInput'),
      searchClear: document.getElementById('searchClear'),
      filterTabs: document.querySelectorAll('.filter-tab'),
      categoryFilters: document.getElementById('categoryFilters'),
      themeFilters: document.getElementById('themeFilters'),
      filterBtns: document.querySelectorAll('.filter-btn'),
      recommendedContent: document.getElementById('recommendedContent'),
      popularContent: document.getElementById('popularContent'),
      fontInput: document.getElementById('fontInput'),
      fontStyle: document.getElementById('fontStyle'),
      fontOutput: document.getElementById('fontOutput'),
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
      loading: document.getElementById('loading')
    };
  }

  // 이벤트 바인딩
  bindEvents() {
    // 검색 입력
    this.elements.searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    // 검색 지우기
    this.elements.searchClear.addEventListener('click', () => {
      this.clearSearch();
    });

    // 카테고리 필터
    this.elements.categoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleCategoryFilter(e.target.dataset.category);
      });
    });

    // 히스토리 패널 토글
    this.elements.historyToggle.addEventListener('click', () => {
      this.toggleHistoryPanel();
    });

    // 히스토리 전체 삭제
    this.elements.clearHistory.addEventListener('click', () => {
      this.clearAllHistory();
    });

    // 모달 닫기
    this.elements.modalClose.addEventListener('click', () => {
      this.closeModal();
    });

    this.elements.emojiModal.addEventListener('click', (e) => {
      if (e.target === this.elements.emojiModal) {
        this.closeModal();
      }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });

    // 모달 액션 버튼들
    this.elements.copyEmoji.addEventListener('click', () => {
      this.copyCurrentEmoji();
    });

    this.elements.downloadSvg.addEventListener('click', () => {
      this.downloadCurrentEmoji('svg');
    });

    this.elements.downloadPng.addEventListener('click', () => {
      this.downloadCurrentEmoji('png');
    });
  }

  // 검색 처리
  handleSearch(query) {
    this.searchQuery = query.trim().toLowerCase();
    
    // 검색 지우기 버튼 표시/숨김
    if (this.searchQuery) {
      this.elements.searchClear.classList.add('show');
    } else {
      this.elements.searchClear.classList.remove('show');
    }

    this.filterEmojis();
    this.renderEmojis();
  }

  // 검색 지우기
  clearSearch() {
    this.elements.searchInput.value = '';
    this.searchQuery = '';
    this.elements.searchClear.classList.remove('show');
    this.filterEmojis();
    this.renderEmojis();
  }

  // 카테고리 필터 처리
  handleCategoryFilter(category) {
    this.currentCategory = category;
    
    // 버튼 활성화 상태 업데이트
    this.elements.categoryBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.category === category) {
        btn.classList.add('active');
      }
    });

    this.filterEmojis();
    this.renderEmojis();
  }

  // 이모지 필터링
  filterEmojis() {
    this.filteredEmojis = this.allEmojis.filter(emoji => {
      // 카테고리 필터
      const categoryMatch = this.currentCategory === 'all' || emoji.category === this.currentCategory;
      
      // 검색 필터
      const searchMatch = !this.searchQuery || 
        emoji.name.toLowerCase().includes(this.searchQuery) ||
        emoji.keywords.toLowerCase().includes(this.searchQuery);

      return categoryMatch && searchMatch;
    });
  }

  // 이모지 렌더링
  renderEmojis() {
    if (this.filteredEmojis.length === 0) {
      this.elements.emojiGrid.style.display = 'none';
      this.elements.noResults.style.display = 'block';
      return;
    }

    this.elements.emojiGrid.style.display = 'grid';
    this.elements.noResults.style.display = 'none';

    this.elements.emojiGrid.innerHTML = this.filteredEmojis.map(emoji => `
      <div class="emoji-item" data-emoji='${JSON.stringify(emoji)}'>
        <div class="emoji-char">${emoji.emoji}</div>
        <div class="emoji-name">${emoji.name}</div>
      </div>
    `).join('');

    // 이모지 클릭 이벤트 바인딩
    this.elements.emojiGrid.addEventListener('click', (e) => {
      const emojiItem = e.target.closest('.emoji-item');
      if (emojiItem) {
        const emojiData = JSON.parse(emojiItem.dataset.emoji);
        this.handleEmojiClick(emojiData);
      }
    });
  }

  // 이모지 클릭 처리
  async handleEmojiClick(emojiData) {
    // 즉시 복사
    await this.copyToClipboard(emojiData.emoji);
    
    // 히스토리에 추가
    this.addToHistory(emojiData);
    
    // 토스트 알림 표시
    this.showToast(`${emojiData.emoji} 복사됨!`);
  }

  // 클립보드에 복사
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // 폴백: 임시 textarea 사용
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      return true;
    } catch (err) {
      console.error('복사 실패:', err);
      return false;
    }
  }

  // 히스토리에 추가
  addToHistory(emojiData) {
    // 중복 제거
    this.copyHistory = this.copyHistory.filter(item => item.emoji !== emojiData.emoji);
    
    // 맨 앞에 추가
    this.copyHistory.unshift({
      ...emojiData,
      copiedAt: new Date().toISOString()
    });

    // 최대 50개까지만 유지
    if (this.copyHistory.length > 50) {
      this.copyHistory = this.copyHistory.slice(0, 50);
    }

    this.saveCopyHistory();
    this.renderHistory();
  }

  // 히스토리 렌더링
  renderHistory() {
    if (this.copyHistory.length === 0) {
      this.elements.historyList.innerHTML = `
        <div class="history-empty">
          <div class="empty-icon">📋</div>
          <p>아직 복사한 이모지가 없습니다</p>
        </div>
      `;
      return;
    }

    this.elements.historyList.innerHTML = this.copyHistory.map(item => `
      <div class="history-item" data-emoji='${JSON.stringify(item)}'>
        <div class="history-emoji">${item.emoji}</div>
        <div class="history-info">
          <div class="history-name">${item.name}</div>
          <div class="history-time">${this.formatTime(item.copiedAt)}</div>
        </div>
        <button class="history-remove" data-emoji="${item.emoji}">×</button>
      </div>
    `).join('');

    // 히스토리 아이템 클릭 이벤트
    this.elements.historyList.addEventListener('click', async (e) => {
      const historyItem = e.target.closest('.history-item');
      const removeBtn = e.target.closest('.history-remove');

      if (removeBtn) {
        e.stopPropagation();
        this.removeFromHistory(removeBtn.dataset.emoji);
      } else if (historyItem) {
        const emojiData = JSON.parse(historyItem.dataset.emoji);
        await this.copyToClipboard(emojiData.emoji);
        this.showToast(`${emojiData.emoji} 다시 복사됨!`);
      }
    });
  }

  // 히스토리에서 제거
  removeFromHistory(emoji) {
    this.copyHistory = this.copyHistory.filter(item => item.emoji !== emoji);
    this.saveCopyHistory();
    this.renderHistory();
  }

  // 히스토리 전체 삭제
  clearAllHistory() {
    if (confirm('복사 기록을 모두 삭제하시겠습니까?')) {
      this.copyHistory = [];
      this.saveCopyHistory();
      this.renderHistory();
    }
  }

  // 히스토리 패널 토글
  toggleHistoryPanel() {
    this.elements.historyPanel.classList.toggle('collapsed');
  }

  // 모달 열기
  openModal(emojiData) {
    this.currentModalEmoji = emojiData;
    this.elements.modalEmoji.textContent = emojiData.emoji;
    this.elements.modalEmojiName.textContent = emojiData.name;
    this.elements.modalKeywords.textContent = emojiData.keywords;
    this.elements.emojiModal.classList.add('show');
  }

  // 모달 닫기
  closeModal() {
    this.elements.emojiModal.classList.remove('show');
    this.currentModalEmoji = null;
  }

  // 현재 모달 이모지 복사
  async copyCurrentEmoji() {
    if (this.currentModalEmoji) {
      await this.copyToClipboard(this.currentModalEmoji.emoji);
      this.addToHistory(this.currentModalEmoji);
      this.showToast(`${this.currentModalEmoji.emoji} 복사됨!`);
      this.closeModal();
    }
  }

  // 이모지 다운로드
  downloadCurrentEmoji(format) {
    if (!this.currentModalEmoji) return;

    const emoji = this.currentModalEmoji.emoji;
    const filename = `${this.currentModalEmoji.name.replace(/\s+/g, '_')}.${format}`;

    if (format === 'svg') {
      this.downloadAsSVG(emoji, filename);
    } else if (format === 'png') {
      this.downloadAsPNG(emoji, filename);
    }
  }

  // SVG로 다운로드
  downloadAsSVG(emoji, filename) {
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
        <text x="50%" y="50%" text-anchor="middle" dy=".35em" font-size="96" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji">${emoji}</text>
      </svg>
    `;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    this.downloadBlob(blob, filename);
  }

  // PNG로 다운로드
  downloadAsPNG(emoji, filename) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 128;
    
    canvas.width = size;
    canvas.height = size;
    
    // 배경을 투명하게 설정
    ctx.clearRect(0, 0, size, size);
    
    // 이모지 그리기
    ctx.font = '96px Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size/2, size/2);
    
    canvas.toBlob((blob) => {
      this.downloadBlob(blob, filename);
    }, 'image/png');
  }

  // 블롭 다운로드
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

  // 토스트 알림 표시
  showToast(message) {
    this.elements.toast.querySelector('.toast-message').textContent = message;
    this.elements.toast.classList.add('show');
    
    setTimeout(() => {
      this.elements.toast.classList.remove('show');
    }, 2000);
  }

  // 시간 포맷팅
  formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // 1분 미만
      return '방금 전';
    } else if (diff < 3600000) { // 1시간 미만
      return `${Math.floor(diff / 60000)}분 전`;
    } else if (diff < 86400000) { // 24시간 미만
      return `${Math.floor(diff / 3600000)}시간 전`;
    } else { // 24시간 이상
      return date.toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  // 히스토리 로드
  loadCopyHistory() {
    try {
      const stored = localStorage.getItem('emojiCopyHistory');
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('히스토리 로드 실패:', err);
      return [];
    }
  }

  // 히스토리 저장
  saveCopyHistory() {
    try {
      localStorage.setItem('emojiCopyHistory', JSON.stringify(this.copyHistory));
    } catch (err) {
      console.error('히스토리 저장 실패:', err);
    }
  }

  // 로딩 숨기기
  hideLoading() {
    setTimeout(() => {
      this.elements.loading.classList.add('hide');
    }, 500);
  }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  new EmojiApp();
});

// 서비스 워커 등록 (오프라인 지원)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}