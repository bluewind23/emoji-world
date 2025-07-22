# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Korean emoji data library that provides comprehensive emoji datasets organized by categories. The project maintains emoji collections with Korean names, Unicode values, and Korean keywords for search and categorization purposes.

## Architecture

### Data Structure
The project follows a modular data architecture where emoji data is organized into category-specific modules that are then consolidated through a central export system.

#### Core Data Schema
Each emoji entry follows a consistent structure:
```javascript
{
  emoji: '😀',           // The actual emoji character
  name: '웃는 얼굴',      // Korean name
  unicode: 'U+1F600',    // Unicode code point
  keywords: ['웃음', '행복', '기쁨']  // Korean search keywords
}
```

#### Module Organization (`src/data/`)
- **`emojiData.js`**: Central aggregator that exports all emoji categories
- **Category modules**: Individual files for each emoji category
  - `emoji_smileys.js` - 표정 및 감정 이모지
  - `emoji_people.js` - 사람 및 제스처 이모지
  - `emoji_animals.js` - 동물 이모지
  - `emoji_food.js` - 음식 및 음료 이모지
  - `emoji_travel.js` - 여행 및 장소 이모지
  - `emoji_symbols.js` - 기호 및 상징 이모지
  - `emoji_flags.js` - 국기 이모지
  - `emoji_recents.js` - 최근 사용 이모지 (빈 배열로 초기화)

#### Dual Data Format Support
The project maintains two data formats:
1. **Structured format** (category modules): Full metadata with Unicode and detailed Korean keywords
2. **Simplified format** (`emojis.js`): Flattened structure with category tags and bilingual keywords

### Data Flow
```
Individual category files → emojiData.js aggregator → External consumption
```

## Development Guidelines

### Adding New Emojis
When adding new emoji entries:

1. **Unicode Compliance**: Always include proper Unicode code points (format: `U+XXXXX`)
2. **Korean Localization**: Provide accurate Korean names and culturally appropriate keywords
3. **Consistent Categorization**: Follow existing category patterns and ensure proper module placement
4. **Keyword Strategy**: Include both Korean and English keywords for broad accessibility

### Category Management
- Each category should maintain thematic consistency
- New categories require updates to the central `emojiData.js` aggregator
- Consider cultural relevance for Korean users when organizing categories

### Data Integrity
- Maintain consistent object structure across all entries
- Verify Unicode values match the actual emoji characters
- Ensure Korean translations are culturally appropriate and commonly used terms

## File Import Dependencies

The central data aggregator (`emojiData.js`) imports from:
```javascript
import { emoji_smileys } from './emoji_smileys.js';
import { emoji_people } from './emoji_people.js';
import { emoji_animals } from './emoji_animals.js';
import { emoji_food } from './emoji_food.js';
import { emoji_travel } from './emoji_travel.js';
import { emoji_symbols } from './emoji_symbols.js';
import { emoji_flags } from './emoji_flags.js';
import { emoji_recent } from './emoji_recent.js';  // Note: file is emoji_recents.js but import is emoji_recent
```

**Important**: There's an import mismatch - the file is `emoji_recents.js` but the import expects `emoji_recent.js`. This needs to be resolved for proper functionality.

## Korean Localization Strategy

This project is specifically designed for Korean users:
- **Names**: All emoji names are in Korean using commonly understood terms
- **Keywords**: Comprehensive Korean keyword coverage for search functionality
- **Cultural Context**: Keywords include culturally relevant terms (e.g., '태극기' for Korean flag)
- **Bilingual Support**: Some entries include both Korean and English keywords for broader accessibility

## Data Usage Patterns

The structured data supports multiple use cases:
- **Search functionality**: Keywords enable Korean-language emoji search
- **Category filtering**: Organized categories support filtered browsing
- **Recent tracking**: `emoji_recent` array supports usage history
- **Unicode operations**: Full Unicode support for technical operations