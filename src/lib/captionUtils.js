export function parseWord(arr, nextStart, cueEnd) {
  const text = arr[0];
  const start = arr[1];
  const nums = arr.filter((x, i) => i >= 2 && typeof x === 'number');
  const motion = arr.find((x, i) => i >= 2 && typeof x === 'string');
  let end;
  let accent;

  if (nums.length >= 2) {
    if (nums[0] > start + 0.03 && (nums[0] > 2 || nums[0] >= start)) {
      end = nums[0];
      accent = nums[1];
    } else {
      accent = nums[0];
    }
  } else if (nums.length === 1) {
    if (nums[0] > start + 0.03 && nums[0] > 1.5) end = nums[0];
    else if (nums[0] >= 1 && nums[0] <= 1.4) accent = nums[0];
    else if (nums[0] > start) end = nums[0];
    else accent = nums[0];
  }

  if (end == null) end = nextStart != null ? nextStart : cueEnd;
  return { text, start, end, accent, motion };
}

export function wordsFor(c) {
  if (c.words) {
    return c.words.map((arr, i, all) => parseWord(arr, all[i + 1]?.[1], c.end));
  }

  const parts = c.text.split(' ');
  const span = c.end - c.start;
  const gap = span / parts.length;
  return parts.map((text, i) => ({
    text,
    start: c.start + i * gap,
    end: c.start + (i + 1) * gap,
  }));
}

export function letterScale(base) {
  // Color wave is default; size is reserved for accents / loud peaks.
  if (base == null || base < 1.06) return 1;
  const scale = 1 + (base - 1) * 0.55;
  return Math.min(1.14, Math.max(1, scale));
}

export function wordScale(base) {
  if (base == null || base < 1.06) return 1;
  return Math.min(1.065, 1 + (base - 1) * 0.34);
}

export function lettersFor(c) {
  const words = wordsFor(c);
  const letters = [];

  words.forEach((word, wordIndex) => {
    const chars = [...word.text];
    const duration = Math.max(0.06, word.end - word.start);
    const averageCharDuration = duration / Math.max(1, chars.length);
    const stretchesSounds =
      word.accent >= 1.08 ||
      c.stretch >= 1.04 ||
      averageCharDuration >= 0.12 ||
      word.motion === 'rage' ||
      word.motion === 'rage-smooth';
    const weights = chars.map((char) => {
      if (!stretchesSounds) return 1;
      if (/[аеёиоуыэюя]/i.test(char)) return 1.7;
      if (/[.,!?;:—-]/.test(char)) return 0.35;
      return 0.85;
    });
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let cursor = word.start;

    chars.forEach((text, charIndex) => {
      const charDuration = duration * (weights[charIndex] / totalWeight);
      letters.push({
        text,
        start: cursor,
        end: cursor + charDuration,
        accent: word.accent,
        motion: word.motion,
        space: false,
        wordIndex,
      });
      cursor += charDuration;
    });
  });

  return letters;
}
