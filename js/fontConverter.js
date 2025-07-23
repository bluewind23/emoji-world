// FontConverter.js - 완전한 인스타 폰트 변환 시스템
export class FontConverter {
  constructor() {
    // 폰트 지원 감지
    this.supportedFonts = this.detectSupportedFonts();
    this.styleNames = {
      ko: {
        'bold': '굵게',
        'italic': '이탤릭',
        'boldItalic': '굵은 이탤릭',
        'script': '손글씨',
        'boldScript': '굵은 손글씨',
        'doubleStruck': '더블라인',
        'monospace': '고정폭',
        'smallCaps': '스모올캐프스',
        'flipped': '뒤집기',
        'mirror': '거울',
        'underline': '밑줄',
        'strikethrough': '취소선',
        'circled': '원형글자',
        'squared': '사각글자',
        'parenthesized': '부분원형',
        'negative': '네거티브'
      },
      en: {
        'bold': 'Bold',
        'italic': 'Italic',
        'boldItalic': 'Bold Italic',
        'script': 'Script',
        'boldScript': 'Bold Script',
        'doubleStruck': 'Double Struck',
        'monospace': 'Monospace',
        'smallCaps': 'Small Caps',
        'flipped': 'Flipped',
        'mirror': 'Mirror',
        'underline': 'Underline',
        'strikethrough': 'Strikethrough',
        'circled': 'Circled',
        'squared': 'Squared',
        'parenthesized': 'Parenthesized',
        'negative': 'Negative'
      }
    };
    
    this.styles = [
      { name: '굵게', key: 'bold' },
      { name: '이탤릭', key: 'italic' },
      { name: '굵은 이탤릭', key: 'boldItalic' },
      { name: '손글씨', key: 'script' },
      { name: '굵은 손글씨', key: 'boldScript' },
      { name: '더블라인', key: 'doubleStruck' },
      { name: '고정폭', key: 'monospace' },
      { name: '소문자', key: 'smallCaps' },
      { name: '뒤집기', key: 'flipped' },
      { name: '거울', key: 'mirror' },
      { name: '밑줄', key: 'underline' },
      { name: '취소선', key: 'strikethrough' },
      { name: '원형글자', key: 'circled' },
      { name: '사각글자', key: 'squared' },
      { name: '부분원형', key: 'parenthesized' },
      { name: '네거티브', key: 'negative' }
    ];
    
    // 특수 문자 매핑들
    this.scriptExceptions = {
      'B': '𝓑', 'E': '𝓔', 'F': '𝓕', 'H': '𝓗', 'I': '𝓘', 'L': '𝓛', 'M': '𝓜', 'R': '𝓡',
      'e': 'ℯ', 'g': 'ℊ', 'o': 'ℴ'
    };
    
    this.doubleStruckExceptions = {
      'C': 'ℂ', 'H': 'ℍ', 'N': 'ℕ', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'Z': 'ℤ'
    };
    
    this.smallCapsMap = {
      'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ',
      'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ',
      'q': 'ǫ', 'r': 'ʀ', 's': 'ꜱ', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x',
      'y': 'ʏ', 'z': 'ᴢ'
    };
    
    this.flippedMap = {
      'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
      'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
      'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
      'y': 'ʎ', 'z': 'z', ' ': ' ', '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ',
      '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6'
    };
    
    // 원형 글자 매핑 (Ⓐ, ⓐ, ➀, ➊)
    this.circledMap = {
      'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ',
      'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ',
      'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ',
      'Y': 'Ⓨ', 'Z': 'Ⓩ',
      'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ',
      'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ',
      'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ',
      'y': 'ⓨ', 'z': 'ⓩ',
      '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
    };
    
    // 사각형 글자 매핑 (🄰, 🄱...)
    this.squaredMap = {
      'A': '🄰', 'B': '🄱', 'C': '🄲', 'D': '🄳', 'E': '🄴', 'F': '🄵', 'G': '🄶', 'H': '🄷',
      'I': '🄸', 'J': '🄹', 'K': '🄺', 'L': '🄻', 'M': '🄼', 'N': '🄽', 'O': '🄾', 'P': '🄿',
      'Q': '🅀', 'R': '🅁', 'S': '🅂', 'T': '🅃', 'U': '🅄', 'V': '🅅', 'W': '🅆', 'X': '🅇',
      'Y': '🅈', 'Z': '🅉'
    };
    
    // 괄호 글자 매핑 (⒜, ⒝...)
    this.parenthesizedMap = {
      'a': '⒜', 'b': '⒝', 'c': '⒞', 'd': '⒟', 'e': '⒠', 'f': '⒡', 'g': '⒢', 'h': '⒣',
      'i': '⒤', 'j': '⒥', 'k': '⒦', 'l': '⒧', 'm': '⒨', 'n': '⒩', 'o': '⒪', 'p': '⒫',
      'q': '⒬', 'r': '⒭', 's': '⒮', 't': '⒯', 'u': '⒰', 'v': '⒱', 'w': '⒲', 'x': '⒳',
      'y': '⒴', 'z': '⒵'
    };
    
    // 네거티브 사각형 글자 매핑 (🅰, 🅱...)
    this.negativeMap = {
      'A': '🅰', 'B': '🅱', 'C': '🅲', 'D': '🅳', 'E': '🅴', 'F': '🅵', 'G': '🅶', 'H': '🅷',
      'I': '🅸', 'J': '🅹', 'K': '🅺', 'L': '🅻', 'M': '🅼', 'N': '🅽', 'O': '🅾', 'P': '🅿',
      'Q': '🆀', 'R': '🆁', 'S': '🆂', 'T': '🆃', 'U': '🆄', 'V': '🆅', 'W': '🆆', 'X': '🆇',
      'Y': '🆈', 'Z': '🆉'
    };
  }
  
  // 메인 변환 함수
  convert(text, styleKey) {
    if (!text) return '';
    
    // CSS로 처리할 스타일들
    const cssStyles = ['bold', 'italic', 'boldItalic', 'script', 'boldScript', 'doubleStruck', 'monospace'];
    if (cssStyles.includes(styleKey)) {
      return this.convertWithFallback(text, styleKey);
    }
    
    switch (styleKey) {
      case 'smallCaps': return this.toSmallCaps(text);
      case 'flipped': return this.toFlipped(text);
      case 'mirror': return this.toMirror(text);
      case 'underline': return this.toUnderline(text);
      case 'strikethrough': return this.toStrikethrough(text);
      case 'circled': return this.toCircled(text);
      case 'squared': return this.toSquared(text);
      case 'parenthesized': return this.toParenthesized(text);
      case 'negative': return this.toNegative(text);
      default: return text;
    }
  }
  
  // 개별 변환 함수들
  toBold(text) {
    return text.replace(/[A-Za-z0-9]/g, char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCharCode(code - 65 + 0x1D400); // A-Z
      if (code >= 97 && code <= 122) return String.fromCharCode(code - 97 + 0x1D41A); // a-z
      if (code >= 48 && code <= 57) return String.fromCharCode(code - 48 + 0x1D7CE); // 0-9
      return char;
    });
  }
  
  toItalic(text) {
    // CSS 기반 이탤릭 스타일링
    return text.replace(/[A-Za-z]/g, char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCharCode(code - 65 + 0x1D434); // A-Z
      if (code >= 97 && code <= 122) return String.fromCharCode(code - 97 + 0x1D44E); // a-z
      return char;
    });
  }
  
  toBoldItalic(text) {
    // 굵은 이탤릭은 더 진한 기울임과 굵은 폰트 가중치 적용
    return text.replace(/[A-Za-z]/g, char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCharCode(code - 65 + 0x1D468); // A-Z
      if (code >= 97 && code <= 122) return String.fromCharCode(code - 97 + 0x1D482); // a-z
      return char;
    });
  }
  
  toScript(text) {
    // Safari 호환성을 위해 CSS 기반 손글씨 스타일 사용
    const transformed = text.replace(/[A-Za-z]/g, char => {
      // 특수 케이스 먼저 확인
      if (this.scriptExceptions[char]) return this.scriptExceptions[char];
      
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCharCode(code - 65 + 0x1D49C); // A-Z
      if (code >= 97 && code <= 122) return String.fromCharCode(code - 97 + 0x1D4B6); // a-z
      return char;
    });
    
    // Safari에서 문제가 있으면 CSS 스타일 반환
    return this.isSafari() ? `<span class="script-font">${text}</span>` : transformed;
  }
  
  toBoldScript(text) {
    // 굵은 손글씨는 더 진한 손글씨 효과와 굵은 가중치
    const transformed = text.replace(/[A-Za-z]/g, char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCharCode(code - 65 + 0x1D4D0); // A-Z
      if (code >= 97 && code <= 122) return String.fromCharCode(code - 97 + 0x1D4EA); // a-z
      return char;
    });
    
    // Safari에서 문제가 있으면 CSS 스타일 반환
    return this.isSafari() ? `<span class="bold-script-font">${text}</span>` : transformed;
  }
  
  toDoubleStruck(text) {
    // 더블라인 효과를 위해 text-shadow 사용
    const transformed = text.replace(/[A-Za-z0-9]/g, char => {
      // 특수 케이스 먼저 확인
      if (this.doubleStruckExceptions[char]) return this.doubleStruckExceptions[char];
      
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCharCode(code - 65 + 0x1D538); // A-Z
      if (code >= 97 && code <= 122) return String.fromCharCode(code - 97 + 0x1D552); // a-z
      if (code >= 48 && code <= 57) return String.fromCharCode(code - 48 + 0x1D7D8); // 0-9
      return char;
    });
    
    // CSS 더블라인 효과 추가
    return `<span class="double-struck-font">${transformed}</span>`;
  }
  
  toMonospace(text) {
    return text.replace(/[A-Za-z0-9]/g, char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCharCode(code - 65 + 0x1D670); // A-Z
      if (code >= 97 && code <= 122) return String.fromCharCode(code - 97 + 0x1D68A); // a-z
      if (code >= 48 && code <= 57) return String.fromCharCode(code - 48 + 0x1D7F6); // 0-9
      return char;
    });
  }
  
  toSmallCaps(text) {
    return text.toLowerCase().replace(/[a-z]/g, char => {
      return this.smallCapsMap[char] || char;
    });
  }
  
  toFlipped(text) {
    return text.toLowerCase()
      .split('')
      .reverse()
      .map(char => this.flippedMap[char] || char)
      .join('');
  }
  
  toMirror(text) {
    return text.split('').reverse().join('');
  }
  
  // 새로운 변환 함수들
  toUnderline(text) {
    return text.split('').map(char => char + '\u0332').join('');
  }
  
  toStrikethrough(text) {
    return text.split('').map(char => char + '\u0336').join('');
  }
  
  toCircled(text) {
    return text.replace(/[A-Za-z0-9]/g, char => {
      return this.circledMap[char] || char;
    });
  }
  
  toSquared(text) {
    return text.replace(/[A-Z]/g, char => {
      return this.squaredMap[char] || char;
    });
  }
  
  toParenthesized(text) {
    return text.toLowerCase().replace(/[a-z]/g, char => {
      return this.parenthesizedMap[char] || char;
    });
  }
  
  toNegative(text) {
    return text.toUpperCase().replace(/[A-Z]/g, char => {
      return this.negativeMap[char] || char;
    });
  }
  
  // 스타일 목록 반환
  getStyles() {
    return this.styles;
  }
  
  // 스타일 이름으로 키 찾기
  getStyleKey(name) {
    const style = this.styles.find(s => s.name === name);
    return style ? style.key : null;
  }
  
  // 키로 스타일 이름 찾기
  getStyleName(key, language = 'ko') {
    return this.styleNames[language][key] || key;
  }
  
  // 언어별 스타일 목록 반환
  getStylesForLanguage(language = 'ko') {
    return this.styles.map(style => ({
      ...style,
      name: this.styleNames[language][style.key] || style.key
    }));
  }
  
  // 폰트 지원 감지
  detectSupportedFonts() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 테스트용 Mathematical Alphanumeric Symbols
    const testChars = ['𝐇', '𝑯', '𝓗', '𝗛', '𝘏']; // bold, italic, script 등
    const supportedFonts = [];
    
    // 다양한 폰트들 테스트
    const fontsToTest = [
      'STIX Two Math',
      'Cambria Math', 
      'Times New Roman',
      'DejaVu Sans',
      'Liberation Sans',
      'Computer Modern'
    ];
    
    fontsToTest.forEach(font => {
      ctx.font = `16px "${font}", sans-serif`;
      let supported = true;
      
      testChars.forEach(char => {
        const width1 = ctx.measureText(char).width;
        ctx.font = `16px sans-serif`; // fallback
        const width2 = ctx.measureText(char).width;
        
        // 폰트가 지원되면 글자 폭이 다를 것
        if (Math.abs(width1 - width2) < 0.1) {
          supported = false;
        }
      });
      
      if (supported) {
        supportedFonts.push(font);
      }
    });
    
    return supportedFonts;
  }
  
  // 최적 폰트 적용
  applyOptimalFont(element) {
    if (this.supportedFonts.length > 0) {
      const fontStack = this.supportedFonts.join(', ') + ', Times New Roman, serif';
      element.style.fontFamily = fontStack;
    }
  }
  
  // Canvas를 사용한 폰트 렌더링 (fallback)
  renderAsImage(text, style) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 캔버스 크기 설정
    canvas.width = text.length * 20 + 40;
    canvas.height = 40;
    
    // 폰트 설정 - 시스템에서 가장 잘 지원되는 폰트들 시도
    const fonts = [
      'Cambria Math',
      'Times New Roman', 
      'Arial Unicode MS',
      'serif'
    ];
    
    let fontFound = false;
    for (const font of fonts) {
      ctx.font = `16px "${font}"`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#202124';
      
      // 텍스트가 제대로 렌더링되는지 테스트
      const testWidth = ctx.measureText(text).width;
      if (testWidth > 0) {
        fontFound = true;
        break;
      }
    }
    
    if (fontFound) {
      // 배경 클리어
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 텍스트 렌더링
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      
      // 이미지로 변환
      return canvas.toDataURL();
    }
    
    return null;
  }
  
  // 문제가 있는 스타일들을 대체 문자로 변환
  convertWithFallback(text, styleKey) {
    // CSS 기반 스타일로만 처리할 스타일들
    const cssOnlyStyles = ['bold', 'italic', 'boldItalic', 'script', 'boldScript', 'doubleStruck', 'monospace'];
    
    if (cssOnlyStyles.includes(styleKey)) {
      return this.convertToAlternativeChars(text, styleKey);
    }
    
    // 나머지는 직접 개별 함수 호출
    switch (styleKey) {
      case 'smallCaps': return this.toSmallCaps(text);
      case 'flipped': return this.toFlipped(text);
      case 'mirror': return this.toMirror(text);
      case 'underline': return this.toUnderline(text);
      case 'strikethrough': return this.toStrikethrough(text);
      case 'circled': return this.toCircled(text);
      case 'squared': return this.toSquared(text);
      case 'parenthesized': return this.toParenthesized(text);
      case 'negative': return this.toNegative(text);
      default: return text;
    }
  }
  
  // 대체 문자 변환 (잘 지원되는 Unicode 영역 사용)
  convertToAlternativeChars(text, styleKey) {
    const alternativeMaps = {
      bold: {
        // 전각 문자 사용 (굵게 효과)
        'A': 'Ａ', 'B': 'Ｂ', 'C': 'Ｃ', 'D': 'Ｄ', 'E': 'Ｅ', 'F': 'Ｆ', 'G': 'Ｇ', 'H': 'Ｈ', 'I': 'Ｉ', 'J': 'Ｊ',
        'K': 'Ｋ', 'L': 'Ｌ', 'M': 'Ｍ', 'N': 'Ｎ', 'O': 'Ｏ', 'P': 'Ｐ', 'Q': 'Ｑ', 'R': 'Ｒ', 'S': 'Ｓ', 'T': 'Ｔ',
        'U': 'Ｕ', 'V': 'Ｖ', 'W': 'Ｗ', 'X': 'Ｘ', 'Y': 'Ｙ', 'Z': 'Ｚ',
        'a': 'ａ', 'b': 'ｂ', 'c': 'ｃ', 'd': 'ｄ', 'e': 'ｅ', 'f': 'ｆ', 'g': 'ｇ', 'h': 'ｈ', 'i': 'ｉ', 'j': 'ｊ',
        'k': 'ｋ', 'l': 'ｌ', 'm': 'ｍ', 'n': 'ｎ', 'o': 'ｏ', 'p': 'ｐ', 'q': 'ｑ', 'r': 'ｒ', 's': 'ｓ', 't': 'ｔ',
        'u': 'ｕ', 'v': 'ｖ', 'w': 'ｗ', 'x': 'ｘ', 'y': 'ｙ', 'z': 'ｚ',
        '0': '０', '1': '１', '2': '２', '3': '３', '4': '４', '5': '５', '6': '６', '7': '７', '8': '８', '9': '９'
      },
      italic: {
        // CSS 이탤릭 스타일로 처리
        return: 'css-style'
      },
      boldItalic: {
        // CSS 굵은 이탤릭 스타일로 처리
        return: 'css-style'
      },
      script: {
        // CSS 손글씨 스타일로 처리
        return: 'css-style'
      },
      boldScript: {
        // CSS 굵은 손글씨 스타일로 처리
        return: 'css-style'
      },
      doubleStruck: {
        // CSS 더블라인 스타일로 처리
        return: 'css-style'
      },
      monospace: {
        // 전각 문자 사용 (모노스페이스 효과)
        'A': 'Ａ', 'B': 'Ｂ', 'C': 'Ｃ', 'D': 'Ｄ', 'E': 'Ｅ', 'F': 'Ｆ', 'G': 'Ｇ', 'H': 'Ｈ', 'I': 'Ｉ', 'J': 'Ｊ',
        'K': 'Ｋ', 'L': 'Ｌ', 'M': 'Ｍ', 'N': 'Ｎ', 'O': 'Ｏ', 'P': 'Ｐ', 'Q': 'Ｑ', 'R': 'Ｒ', 'S': 'Ｓ', 'T': 'Ｔ',
        'U': 'Ｕ', 'V': 'Ｖ', 'W': 'Ｗ', 'X': 'Ｘ', 'Y': 'Ｙ', 'Z': 'Ｚ',
        'a': 'ａ', 'b': 'ｂ', 'c': 'ｃ', 'd': 'ｄ', 'e': 'ｅ', 'f': 'ｆ', 'g': 'ｇ', 'h': 'ｈ', 'i': 'ｉ', 'j': 'ｊ',
        'k': 'ｋ', 'l': 'ｌ', 'm': 'ｍ', 'n': 'ｎ', 'o': 'ｏ', 'p': 'ｐ', 'q': 'ｑ', 'r': 'ｒ', 's': 'ｓ', 't': 'ｔ',
        'u': 'ｕ', 'v': 'ｖ', 'w': 'ｗ', 'x': 'ｘ', 'y': 'ｙ', 'z': 'ｚ',
        '0': '０', '1': '１', '2': '２', '3': '３', '4': '４', '5': '５', '6': '６', '7': '７', '8': '８', '9': '９'
      }
    };
    
    const map = alternativeMaps[styleKey];
    
    // CSS 스타일로 처리해야 하는 경우들
    if (!map || map.return === 'css-style') {
      switch (styleKey) {
        case 'bold':
          return `<span class="bold-enhanced">${text}</span>`;
        case 'italic':
          return `<span class="italic-enhanced">${text}</span>`;
        case 'boldItalic':
          return `<span class="bold-italic-enhanced">${text}</span>`;
        case 'script':
          return `<span class="script-enhanced">${text}</span>`;
        case 'boldScript':
          return `<span class="bold-script-enhanced">${text}</span>`;
        case 'doubleStruck':
          return `<span class="double-struck-enhanced">${text}</span>`;
        case 'monospace':
          return `<span class="monospace-enhanced">${text}</span>`;
        default:
          return text;
      }
    }
    
    return text.split('').map(char => map[char] || char).join('');
  }
  
  // Safari 감지 함수
  isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }
  
  // 소문자 폰트 설명 업데이트
  getSmallCapsDescription(language = 'ko') {
    return language === 'ko' 
      ? '소문자를 작은 대문자 모양으로 변환합니다. (예: hello → ᴀᴇʟʟᴏ)'
      : 'Converts lowercase letters to small capital forms. (e.g., hello → ᴀᴇʟʟᴏ)';
  }
  
  // 더블라인 폰트 설명
  getDoubleStruckDescription(language = 'ko') {
    return language === 'ko'
      ? '중단선(더블라인) 효과로 수학적 느낌을 준니다.'
      : 'Creates a mathematical double-struck (outline) effect.';
  }
}