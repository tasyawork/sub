import { letterScale, wordScale } from './captionUtils.js';

export const BLUE = '#00A5FF';

/** Letter/word size motion only for loud accents, shouts, or peak cues. */
export function letterShouldScale(cue, letter) {
  if (!cue || cue.type === 'sound') return false;
  if (cue.super || cue.shout) return true;
  if (letter?.accent != null && letter.accent >= 1.08) return true;
  return (cue.scale || 1) >= 1.08;
}

export function getActiveLetterIndex(letters, time) {
  let current = -1;
  letters.forEach((letter, i) => {
    if (!letter.space && time >= letter.start) current = i;
  });
  return current;
}

export function buildWordMeta(letters, cue) {
  const wordCount = letters.length ? Math.max(...letters.map((l) => l.wordIndex)) + 1 : 0;
  return Array.from({ length: wordCount }, (_, wi) => {
    const wordLetters = letters
      .map((l, i) => ({ ...l, index: i }))
      .filter((l) => l.wordIndex === wi);
    const base = wordLetters[0]?.accent || cue.scale || 1.04;
    const wy = wordScale(base);
    const wx = 1 + (wy - 1) * (0.72 + ((cue.stretch || 1) - 1) * 4);
    const py = Math.min(1.16, wy + 0.06);
    const px = Math.min(1.13, wx + 0.04);
    const text = wordLetters.map((l) => l.text).join('');
    return {
      wi,
      wordLetters,
      text,
      wx,
      wy,
      px: Math.min(1.18, px + 0.04),
      py: Math.min(1.22, py + 0.04),
      tremor: Math.min(cue.tremorPx || 0.7, 1.2),
      hasExclaim: text.includes('!'),
      isImpact: /^(сдохни|хватит)/i.test(text),
    };
  });
}

export function classNames(map) {
  return Object.entries(map)
    .filter(([, on]) => on)
    .map(([name]) => name)
    .join(' ');
}

/** Whole-word scale only for peaks or a shouted exclamation. */
export function wordShouldScale(cue, motion, isImpact, hasExclaim = false) {
  return Boolean(
    cue?.super ||
      isImpact ||
      (cue?.shout && hasExclaim) ||
      motion === 'rage' ||
      motion === 'rage-smooth',
  );
}

export function computeWordClassName({ isActive, motion, cue, hasExclaim, isImpact, tremor }) {
  const allowWordScale = wordShouldScale(cue, motion, isImpact, hasExclaim);
  return classNames({
    'word-unit': true,
    'active-word': isActive,
    'word-scale': isActive && allowWordScale,
    'word-emotional': isActive && allowWordScale && !hasExclaim && !isImpact && Boolean(cue.super),
    'word-exclaim': isActive && allowWordScale && hasExclaim,
    'word-impact': isActive && isImpact,
    'word-rage': isActive && motion === 'rage',
    'word-rage-smooth': isActive && motion === 'rage-smooth',
    'word-tension':
      isActive &&
      !allowWordScale &&
      motion !== 'rage' &&
      motion !== 'rage-smooth' &&
      Boolean(cue.tension),
    'word-super':
      isActive &&
      allowWordScale &&
      motion !== 'rage' &&
      motion !== 'rage-smooth' &&
      !cue.tension &&
      Boolean(cue.super),
    'word-tremor':
      isActive &&
      !allowWordScale &&
      motion !== 'rage' &&
      motion !== 'rage-smooth' &&
      !cue.tension &&
      !cue.super &&
      tremor,
  });
}

export function letterColor({ syncColorMode, i, current, currentWord, wordIndex }) {
  if (syncColorMode === 'word') {
    const wordSpoken = currentWord != null && wordIndex != null && wordIndex <= currentWord;
    return wordSpoken ? BLUE : '#fff';
  }
  if (i <= current && current >= 0) return BLUE;
  return '#fff';
}

export { letterScale };
