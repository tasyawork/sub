export const mobileSpeakerColors = {
  woman: '#17e5e5',
  man: '#e51717',
  other: '#e58017',
  other2: '#ff4d4d',
  guard: '#ebc247',
};

// scale/stretch/accent aligned with playerScenes (from scripts/analyze-cues.py).
export const mobileScenes = {
  calm: {
    src: 'video.mp4',
    poster: 'video.mp4.png',
    text: 'Её лишили семьи и свободы. Как пережить потерю и найти в себе силы бороться за справедливость?',
    tagsHtml: '<span class="badge ivi"><img src="Иконки/subscription_reposition_ivi.svg" alt="">сериал Иви</span><span class="badge white">драма</span><span class="meta-plain">1 сезон</span>',
    cues: [
      { start: 1.04, end: 2.92, speaker: 'man', offscreen: true, scale: 1.04, stretch: 1.03, pitchY: 1, words: [['Осуждённая,', 1.04], ['выходите', 1.98, 1.09], ['с', 2.26], ['вещами', 2.34], ['к двери.', 2.78]] },
      { start: 3.72, end: 4.46, speaker: 'woman', scale: 1.03, stretch: 1, pitchY: -1, words: [['Где', 3.72], ['адвокат?', 3.96]] },
      { start: 6.62, end: 7.92, speaker: 'man', offscreen: true, scale: 1.05, stretch: 1, pitchY: 1, words: [['Сначала', 6.62], ['надо', 7.04, 1.08], ['надеть', 7.28], ['наручники.', 7.46]] },
      { start: 9.98, end: 11.30, speaker: 'woman', scale: 1.05, stretch: 1, pitchY: -1.5, words: [['Почему?', 9.98, 1.06], ['Не', 10.58], ['имеете', 10.62], ['права.', 10.88]] },
      { start: 11.58, end: 12.92, speaker: 'man', offscreen: true, scale: 1.04, stretch: 1.02, pitchY: 1, words: [['Вы', 11.58], ['хотите', 11.72, 1.07], ['встретиться', 11.96], ['с адвокатом?', 12.34]] },
      { start: 13.18, end: 15.26, speaker: 'man', scale: 1.07, stretch: 1.02, pitchY: 1, words: [['Надо', 13.18], ['надеть', 13.34, 1.09], ['наручники.', 13.66], ['Вы', 14.72], ['же', 14.84], ['буйная.', 14.94]] },
      { start: 15.74, end: 16.52, speaker: 'man', scale: 1.03, stretch: 1.03, pitchY: 1.5, words: [['Вас', 15.74], ['люди', 15.92], ['боятся.', 16.10]] },
    ],
  },
  emotion: {
    src: 'video-emotion.mp4',
    poster: 'video-emotion.mp4.png',
    text: 'В столовой вспыхивает жёсткий конфликт: слова бьют сильнее ударов, и героине приходится отвечать сквозь страх.',
    tagsHtml: '<span class="badge ivi"><img src="Иконки/subscription_reposition_ivi.svg" alt="">сериал Иви</span><span class="badge white">драма</span><span class="meta-plain">эмоциональная сцена</span>',
    cues: [
      { start: 0.00, end: 3.10, speaker: 'other', scale: 1.03, stretch: 1.03, pitchY: 1, words: [['Зовут', 0.00], ['за', 0.56], ['то,', 0.70], ['что', 0.92], ['нацистов', 1.10], ['уважают.', 1.80]] },
      { start: 4.30, end: 6.10, type: 'sound', text: '[гул столовой]', words: [['[гул', 4.30], ['столовой]', 4.90]] },
      { start: 9.55, end: 10.70, speaker: 'other2', scale: 1.04, stretch: 1.02, pitchY: 1.4, words: [['Ты', 9.55], ['немка?', 9.78]] },
      { start: 13.60, end: 15.30, speaker: 'other', scale: 1.05, stretch: 1.03, pitchY: 1.4, words: [['А', 13.60, 1.07], ['тебя', 14.02], ['кто', 14.42], ['спрашивал?', 14.56]] },
      { start: 18.05, end: 20.30, speaker: 'other', shout: true, scale: 1.12, stretch: 1.05, pitchY: 2, jolt: 1.5, tremorPx: 1.2, words: [['Ну', 18.05], ['чего', 18.32, 1.15], ['ты', 18.40], ['уставилась,', 18.50, 1.08], ['тварь?!', 19.02, 1.20, 'rage']] },
      { start: 20.60, end: 22.30, type: 'sound', text: '[грохот скамьи]', soundMotion: 'impact', jolt: 3, words: [['[грохот', 20.60], ['скамьи]', 21.30]] },
      { start: 22.55, end: 24.60, type: 'sound', text: '[крики вокруг]', soundMotion: 'chaos', words: [['[крики', 22.55], ['вокруг]', 23.40]] },
      { start: 25.05, end: 26.85, type: 'sound', text: '[глухой удар]', soundMotion: 'impact', jolt: 4.5, words: [['[глухой', 25.05], ['удар]', 25.90]] },
      { start: 27.20, end: 29.70, type: 'sound', text: '[возня, сдавленный хрип]', soundMotion: 'chaos', words: [['[возня,', 27.20], ['сдавленный', 28.10], ['хрип]', 28.90]] },
      { start: 30.00, end: 32.30, speaker: 'other', super: true, shout: true, scale: 1.14, stretch: 1.06, pitchY: 2.5, jolt: 2.5, words: [['Держи', 30.00, 1.12], ['её!', 30.58, 1.16], ['Дай', 31.46, 1.13], ['мне!', 31.72, 1.18]] },
      { start: 32.80, end: 35.40, speaker: 'other', scale: 1.08, stretch: 1.04, pitchY: 1.6, words: [['И', 32.80], ['чего', 33.12, 1.1], ['ты', 33.30], ['сделаешь,', 33.58, 1.08], ['а?', 34.60]] },
      { start: 35.70, end: 37.95, type: 'sound', text: '[хрип, борьба]', soundMotion: 'chaos', words: [['[хрип,', 35.70], ['борьба]', 36.60]] },
      { start: 38.35, end: 40.30, speaker: 'woman', super: true, shout: true, scale: 1.18, stretch: 1.06, pitchY: 0, jolt: 3.5, words: [['Сдохни!', 38.35, 1.18, 'rage-smooth'], ['Сдохни!', 39.50, 1.20, 'rage-smooth']] },
      { start: 40.40, end: 40.98, type: 'sound', text: '[удар]', soundMotion: 'impact', jolt: 5, words: [['[удар]', 40.40]] },
      { start: 41.02, end: 42.65, speaker: 'other', super: true, shout: true, scale: 1.15, stretch: 1.06, pitchY: 2.2, jolt: 2.5, words: [['Ну', 41.02], ['давай!', 41.18, 1.14], ['Давай!', 42.02, 1.17]] },
      { start: 42.80, end: 43.72, type: 'sound', text: '[свисток надзирателя]', words: [['[свисток', 42.80], ['надзирателя]', 43.20]] },
      { start: 43.78, end: 46.10, speaker: 'guard', super: true, tension: true, shout: true, scale: 1.14, stretch: 1.05, pitchY: 2, jolt: 2, words: [['Вы', 43.78], ['что', 44.30], ['творите?!', 44.58, 1.14], ['Хватит!', 45.36, 1.18]] },
    ],
  },
};
