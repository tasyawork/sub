export const speakerColors = {
  woman: '#17e5e5',
  man: '#e51717',
  other: '#e58017',
  other2: '#ff4d4d',
  guard: '#ebc247',
  sound: '#ffffff',
};

// scale/stretch/accent baked from scripts/analyze-cues.py (RMS vs speaker median).
// Peak shout/super cues keep hand-tuned ceilings from CAPTION_RULES.
export const playerScenes = {
  calm: {
    src: 'video.mp4',
    title: 'ХОЛОД',
    episode: 'Серия 1 сезон 1 · спокойная сцена',
    cues: [
      { start: 1.04, end: 2.92, speaker: 'man', offscreen: true, text: 'Осуждённая, выходите с вещами к двери.', scale: 1.04, stretch: 1.03, pitchY: 1, words: [['Осуждённая,', 1.04, 1.86], ['выходите', 1.98, 2.26, 1.09], ['с', 2.26, 2.34], ['вещами', 2.34, 2.66], ['к двери.', 2.78, 2.92]] },
      { start: 3.72, end: 4.46, speaker: 'woman', text: 'Где адвокат?', scale: 1.03, stretch: 1, pitchY: -1, words: [['Где', 3.72, 3.96], ['адвокат?', 3.96, 4.46]] },
      { start: 6.62, end: 7.92, speaker: 'man', offscreen: true, text: 'Сначала надо надеть наручники.', scale: 1.05, stretch: 1, pitchY: 1, words: [['Сначала', 6.62, 7.04], ['надо', 7.04, 7.28, 1.08], ['надеть', 7.28, 7.46], ['наручники.', 7.46, 7.92]] },
      { start: 9.98, end: 11.30, speaker: 'woman', text: 'Почему? Не имеете права.', scale: 1.05, stretch: 1, pitchY: -1.5, words: [['Почему?', 9.98, 10.34, 1.06], ['Не', 10.58, 10.62], ['имеете', 10.62, 10.88], ['права.', 10.88, 11.30]] },
      { start: 11.58, end: 12.92, speaker: 'man', offscreen: true, text: 'Вы хотите встретиться с адвокатом?', scale: 1.04, stretch: 1.02, pitchY: 1, words: [['Вы', 11.58, 11.72], ['хотите', 11.72, 11.96, 1.07], ['встретиться', 11.96, 12.34], ['с адвокатом?', 12.34, 12.92]] },
      { start: 13.18, end: 15.26, speaker: 'man', text: 'Надо надеть наручники. Вы же буйная.', scale: 1.07, stretch: 1.02, pitchY: 1, words: [['Надо', 13.18, 13.34], ['надеть', 13.34, 13.66, 1.09], ['наручники.', 13.66, 14.16], ['Вы', 14.72, 14.84], ['же', 14.84, 14.94], ['буйная.', 14.94, 15.26]] },
      { start: 15.74, end: 16.52, speaker: 'man', text: 'Вас люди боятся.', scale: 1.03, stretch: 1.03, pitchY: 1.5, words: [['Вас', 15.74, 15.92], ['люди', 15.92, 16.10], ['боятся.', 16.10, 16.52]] },
      { start: 17.25, end: 18.65, type: 'sound', text: '[лязг наручников]', scale: 1.02, stretch: 1, pitchY: 0 },
    ],
  },
  emotion: {
    src: 'video-emotion.mp4',
    title: 'ХОЛОД',
    episode: 'Серия 1 сезон 1 · эмоциональная сцена',
    cues: [
      { start: 0.00, end: 3.10, speaker: 'other', text: 'Зовут за то, что нацистов уважают.', emotion: 'contempt', scale: 1.03, stretch: 1.03, pitchY: 1, words: [['Зовут', 0.00, 0.56], ['за', 0.56, 0.70], ['то,', 0.70, 0.88], ['что', 0.92, 1.10], ['нацистов', 1.10, 1.80], ['уважают.', 1.80, 3.10]] },
      { start: 4.30, end: 6.10, type: 'sound', text: '[гул столовой, лязг посуды]', scale: 1.02, stretch: 1, pitchY: 0 },
      { start: 9.55, end: 10.70, speaker: 'other2', text: 'Ты немка?', emotion: 'contempt', scale: 1.04, stretch: 1.02, pitchY: 1.4, words: [['Ты', 9.55, 9.78], ['немка?', 9.78, 10.70]] },
      { start: 13.60, end: 15.30, speaker: 'other', text: 'А тебя кто спрашивал?', emotion: 'irritation', scale: 1.05, stretch: 1.03, pitchY: 1.4, words: [['А', 13.60, 14.02, 1.07], ['тебя', 14.02, 14.42], ['кто', 14.42, 14.56], ['спрашивал?', 14.56, 15.30]] },
      { start: 18.05, end: 20.30, speaker: 'other', text: 'Ну чего ты уставилась, тварь?!', emotion: 'anger', shout: true, scale: 1.12, stretch: 1.05, pitchY: 2, jolt: 1.5, tremorPx: 1.2, words: [['Ну', 18.05, 18.32], ['чего', 18.32, 18.40, 1.15], ['ты', 18.40, 18.50], ['уставилась,', 18.50, 19.02, 1.08], ['тварь?!', 19.02, 20.30, 1.20, 'rage']] },
      { start: 20.60, end: 22.30, type: 'sound', text: '[грохот скамьи]', soundMotion: 'impact', jolt: 3.5 },
      { start: 22.55, end: 24.60, type: 'sound', text: '[крики вокруг]', emotion: 'panic', soundMotion: 'chaos' },
      { start: 25.05, end: 26.85, type: 'sound', text: '[глухой удар]', soundMotion: 'impact', jolt: 5 },
      { start: 27.20, end: 29.70, type: 'sound', text: '[возня, сдавленный хрип]', emotion: 'fear', soundMotion: 'chaos' },
      { start: 30.00, end: 32.30, speaker: 'other', text: 'Держи её! Дай мне!', emotion: 'rage', super: true, shout: true, scale: 1.14, stretch: 1.06, pitchY: 2.5, jolt: 2.5, words: [['Держи', 30.00, 30.58, 1.12], ['её!', 30.58, 31.32, 1.16], ['Дай', 31.46, 31.72, 1.13], ['мне!', 31.72, 32.30, 1.18]] },
      { start: 32.80, end: 35.40, speaker: 'other', text: 'И чего ты сделаешь, а?', emotion: 'contempt', scale: 1.08, stretch: 1.04, pitchY: 1.6, words: [['И', 32.80, 33.12], ['чего', 33.12, 33.30, 1.1], ['ты', 33.30, 33.58], ['сделаешь,', 33.58, 34.60, 1.08], ['а?', 34.60, 35.40]] },
      { start: 35.70, end: 37.95, type: 'sound', text: '[хрип, борьба]', emotion: 'fear', soundMotion: 'chaos' },
      { start: 38.35, end: 40.30, speaker: 'woman', text: 'Сдохни! Сдохни!', emotion: 'rage', super: true, shout: true, scale: 1.18, stretch: 1.06, pitchY: 0, jolt: 3.5, words: [['Сдохни!', 38.35, 39.16, 1.18, 'rage-smooth'], ['Сдохни!', 39.50, 40.30, 1.20, 'rage-smooth']] },
      { start: 40.40, end: 40.98, type: 'sound', text: '[удар]', soundMotion: 'impact', jolt: 5.5 },
      { start: 41.02, end: 42.65, speaker: 'other', text: 'Ну давай! Давай!', emotion: 'rage', super: true, shout: true, scale: 1.15, stretch: 1.06, pitchY: 2.2, jolt: 2.5, words: [['Ну', 41.02, 41.18], ['давай!', 41.18, 42.02, 1.14], ['Давай!', 42.02, 42.65, 1.17]] },
      { start: 42.80, end: 43.72, type: 'sound', text: '[свисток надзирателя]', scale: 1.02, stretch: 1 },
      { start: 43.78, end: 46.10, speaker: 'guard', text: 'Вы что творите?! Хватит!', emotion: 'command', super: true, tension: true, shout: true, scale: 1.14, stretch: 1.05, pitchY: 2, jolt: 2, words: [['Вы', 43.78, 44.30], ['что', 44.30, 44.58], ['творите?!', 44.58, 45.30, 1.14], ['Хватит!', 45.36, 46.10, 1.18]] },
    ],
  },
};
