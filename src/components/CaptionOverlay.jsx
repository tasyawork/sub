import { useMemo } from 'react';
import { lettersFor, letterScale } from '../lib/captionUtils.js';
import {
  getActiveLetterIndex,
  buildWordMeta,
  computeWordClassName,
  letterColor,
  classNames,
  wordShouldScale,
  letterShouldScale,
} from '../lib/applyCaptionState.js';

export default function CaptionOverlay({
  cue,
  time,
  captionMode = 'intent',
  syncColorMode = 'letter',
  letterMotionMode = 'color',
  className = 'captions',
  fontSize,
}) {
  const classic = captionMode === 'classic';
  const emo = !classic;
  const useLetterLift = emo && letterMotionMode === 'lift';

  const letters = useMemo(() => {
    if (!cue || cue.type === 'sound') return [];
    return lettersFor(cue);
  }, [cue]);

  const words = useMemo(() => (cue && cue.type !== 'sound' ? buildWordMeta(letters, cue) : []), [cue, letters]);
  const medianLetterDuration = useMemo(() => {
    const durations = letters
      .map((letter) => Math.max(0.03, letter.end - letter.start))
      .sort((a, b) => a - b);
    return durations[Math.floor(durations.length / 2)] || 0.1;
  }, [letters]);

  if (!cue) return null;

  if (cue.type === 'sound') {
    const soundClass = emo && cue.soundMotion ? ` sound-${cue.soundMotion}` : '';
    return (
      <div
        className={`${className}${soundClass}${emo && cue.shout ? ' shout' : ''}`}
        style={fontSize ? { fontSize } : undefined}
      >
        <span className="sound-line">{cue.text}</span>
      </div>
    );
  }

  const current = classic ? -1 : getActiveLetterIndex(letters, time);
  const motion = letters[current]?.motion;
  const tremor = motion === 'rage' || Number(cue.tremor || 0) > 0.3;
  const currentWord = letters[current]?.wordIndex;
  const activeMeta = words[currentWord];
  const impactWord = activeMeta?.isImpact;
  const allowWordScale =
    !classic &&
    (!useLetterLift || (cue.shout && activeMeta?.hasExclaim)) &&
    wordShouldScale(cue, motion, impactWord, activeMeta?.hasExclaim);
  const allowLetterScale =
    !classic &&
    !useLetterLift &&
    !allowWordScale &&
    letterShouldScale(cue, letters[current]);
  // Color wave by default. Letter size only for accents / loud / shout (never with word scale).
  const letterScaleValue = allowLetterScale
    ? (letters[current]?.accent
        ? letterScale(letters[current].accent)
        : letterScale(cue.scale || 1)) *
      (1 + ((cue.stretch || 1) - 1) * 0.4)
    : 1;
  const activeWordScale = allowWordScale
    ? impactWord
      ? activeMeta?.px || 1
      : activeMeta?.px || activeMeta?.wx || 1
    : 1;
  const letterPush =
    current >= 0 && allowLetterScale && letterScaleValue > 1.01
      ? Math.max(1, Math.ceil((14 * (letterScaleValue - 1)) / 2 + (tremor ? 0.2 : 0)))
      : 0;
  const wordPush =
    activeMeta && allowWordScale
      ? Math.ceil(
          (activeMeta.text.length * 7 * (activeWordScale - 1)) / 2 +
            (motion === 'rage' || cue.tension ? 0.7 : 0),
        )
      : 0;

  const rootClass = [
    className,
    cue.offscreen ? 'offscreen' : '',
    useLetterLift ? 'letter-lift-motion' : '',
    emo && cue.shout ? 'shout' : '',
    emo && cue.super ? 'super-emotion' : '',
    emo && cue.tension ? 'tension-line' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={rootClass}
      style={{
        ...(fontSize ? { fontSize } : {}),
        '--active-scale': allowLetterScale ? letterScale(cue.scale || 1) : 1,
        '--active-stretch': allowLetterScale ? 1 + ((cue.stretch || 1) - 1) * 0.4 : 1,
        '--tremor': `${Math.min(cue.tremorPx || 0.28, 0.45)}px`,
        '--jolt': `${emo ? cue.jolt || 0 : 0}px`,
      }}
    >
      <span className="caption-box">
        {words.map((word) => {
          const isActive = word.wi === currentWord && !classic;
          const allowLiftWordScale = useLetterLift && cue.shout && word.hasExclaim;
          const thisWordScales =
            isActive &&
            (!useLetterLift || allowLiftWordScale) &&
            wordShouldScale(cue, motion, word.isImpact, word.hasExclaim);
          return (
            <span key={word.wi}>
              <span
                className={computeWordClassName({
                  isActive: isActive && (!useLetterLift || allowLiftWordScale),
                  motion,
                  cue,
                  hasExclaim: word.hasExclaim,
                  isImpact: word.isImpact,
                  tremor,
                })}
                style={{
                  '--word-scale-x': thisWordScales ? word.wx : 1,
                  '--word-scale-y': thisWordScales ? word.wy : 1,
                  '--word-pulse-x': thisWordScales ? word.px : 1,
                  '--word-pulse-y': thisWordScales ? word.py : 1,
                  '--word-impact-x': thisWordScales ? Math.min(1.18, word.px + 0.04) : 1,
                  '--word-impact-y': thisWordScales ? Math.min(1.22, word.py + 0.04) : 1,
                  '--word-tremor': `${word.tremor}px`,
                  '--word-shift': `${
                    word.wi < currentWord ? -wordPush : word.wi > currentWord ? wordPush : 0
                  }px`,
                }}
              >
                {word.wordLetters.map((l) => {
                  const isCurrent = l.index === current && !classic;
                  const letterDuration = Math.max(0.055, l.end - l.start);
                  const durationRatio = letterDuration / medianLetterDuration;
                  const voiceAccent = l.accent || cue.scale || 1;
                  const expressive =
                    voiceAccent >= 1.08 ||
                    (cue.stretch || 1) >= 1.035 ||
                    cue.shout ||
                    cue.super ||
                    Boolean(l.motion);
                  const liftHeight = expressive
                    ? Math.min(
                        1.25,
                        Math.max(
                          0.9,
                          0.94 +
                            (durationRatio - 0.8) * 0.2 +
                            ((cue.stretch || 1) - 1) * 3 +
                            (voiceAccent - 1.08) * 1.3,
                        ),
                      )
                    : Math.min(
                        0.8,
                        Math.max(0.55, 0.58 + (durationRatio - 0.8) * 0.11),
                      );
                  const liftProgress = Math.min(
                    1,
                    Math.max(0, (time - l.start) / letterDuration),
                  );
                  const activeLift =
                    isCurrent && time >= l.start && time <= l.end
                      ? Math.sin(Math.PI * liftProgress) ** 0.45
                      : 0;
                  const liveLift =
                    useLetterLift ? -liftHeight * activeLift : 0;
                  const spoken =
                    syncColorMode === 'word'
                      ? currentWord != null && l.wordIndex <= currentWord
                      : l.index <= current;
                  const letterGetsScale =
                    isCurrent && allowLetterScale && letterShouldScale(cue, l);
                  return (
                    <span
                      key={l.index}
                      className={classNames({
                        letter: true,
                        spoken: !classic && spoken,
                        current: isCurrent,
                      })}
                      style={{
                        '--push-x': `${
                          l.index < current ? -letterPush : l.index > current ? letterPush : 0
                        }px`,
                        '--letter-live-lift': `${liveLift.toFixed(2)}px`,
                        '--letter-lift-transition': expressive ? '150ms' : '90ms',
                        color: classic
                          ? '#fff'
                          : letterColor({
                              syncColorMode,
                              i: l.index,
                              current,
                              currentWord,
                              wordIndex: l.wordIndex,
                            }),
                        ...(thisWordScales || !letterGetsScale
                          ? { '--active-scale': 1, '--active-stretch': 1 }
                          : emo && l.accent
                            ? { '--active-scale': letterScale(l.accent) }
                            : null),
                      }}
                    >
                      {l.text}
                    </span>
                  );
                })}
              </span>
              {word.wi < words.length - 1 ? <span className="word-gap">&nbsp;</span> : null}
            </span>
          );
        })}
      </span>
    </div>
  );
}
