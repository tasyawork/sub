import { useEffect, useRef, useState } from 'react';
import '../styles/player.css';
import { playerScenes, speakerColors } from '../data/playerScenes.js';
import CaptionOverlay from '../components/CaptionOverlay.jsx';

function findCue(cues, time) {
  return cues.find((cue) => time >= cue.start && time <= cue.end) ?? null;
}

function formatTime(value) {
  if (!Number.isFinite(value)) return '0:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function PlayerPage() {
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const uiTimerRef = useRef(null);
  const [sceneName, setSceneName] = useState('calm');
  const [captionMode, setCaptionMode] = useState('intent');
  const [speakerColorsOn, setSpeakerColorsOn] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [showUi, setShowUi] = useState(true);
  const [introOpen, setIntroOpen] = useState(true);
  const [captionFontSize, setCaptionFontSize] = useState(24);

  const scene = playerScenes[sceneName];
  const activeCue = findCue(scene.cues, currentTime);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return undefined;

    const updateFontSize = () => setCaptionFontSize(player.clientHeight * 0.05);
    updateFontSize();
    const observer = new ResizeObserver(updateFontSize);
    observer.observe(player);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    setCurrentTime(0);
    setDuration(0);
    setPaused(true);
  }, [sceneName]);

  useEffect(() => () => window.clearTimeout(uiTimerRef.current), []);

  const revealUi = () => {
    setShowUi(true);
    window.clearTimeout(uiTimerRef.current);
    if (!paused && !introOpen) {
      uiTimerRef.current = window.setTimeout(() => setShowUi(false), 2400);
    }
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const seek = (event) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const { left, width } = event.currentTarget.getBoundingClientRect();
    video.currentTime = Math.max(0, Math.min(duration, ((event.clientX - left) / width) * duration));
  };

  return (
    <div className="player-root">
      <div
        ref={playerRef}
        className={`player ${showUi ? 'show-ui' : ''} ${introOpen ? 'intro-open' : ''} ${
          captionMode === 'classic' ? 'classic' : ''
        } ${speakerColorsOn ? 'speaker-colors' : ''}`}
        onMouseMove={revealUi}
        onClick={revealUi}
        style={{ '--speaker-color': speakerColors[activeCue?.speaker] ?? '#00a5ff' }}
      >
        <video
          ref={videoRef}
          src={`/${scene.src}`}
          playsInline
          preload="metadata"
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onClick={(event) => {
            event.stopPropagation();
            togglePlayback();
          }}
        />
        <div className="shade" />

        <header className="top">
          <div className="brand">
            <div className="title">ХОЛОД</div>
            <div className="watching">УЖЕ СМОТРЯТ 56 000 000</div>
            <div className="episode">{scene.episode}</div>
          </div>
          <div className="rating">
            <img src="/icons/blinkingEyes.svg" alt="" width="36" />
            <span>Рейтинг зрителей<br />8.1</span>
            <span className="age">18+</span>
          </div>
        </header>

        <div className="clip-switch">
          {['calm', 'emotion'].map((key) => (
            <button
              key={key}
              type="button"
              className={sceneName === key ? 'active' : ''}
              onClick={(event) => {
                event.stopPropagation();
                setSceneName(key);
              }}
            >
              {key === 'calm' ? 'Спокойная' : 'Эмоциональная'}
              <small>{key === 'calm' ? 'диалог' : 'конфликт'}</small>
            </button>
          ))}
        </div>

        <div className="compare">
          <button type="button" className={captionMode === 'intent' ? 'active' : ''} onClick={() => setCaptionMode('intent')}>
            Intent
          </button>
          <button type="button" className={captionMode === 'classic' ? 'active' : ''} onClick={() => setCaptionMode('classic')}>
            Classic
          </button>
          <span className="compare-separator" />
          <button
            type="button"
            className={`color-toggle ${speakerColorsOn ? 'color-on' : ''}`}
            onClick={() => setSpeakerColorsOn((value) => !value)}
          >
            <i /> Цвета
          </button>
        </div>

        <div className="caption-area">
          <CaptionOverlay
            cue={activeCue}
            time={currentTime}
            captionMode={captionMode}
            syncColorMode="letter"
            className="caption"
            fontSize={captionFontSize}
          />
        </div>

        <div className="controls">
          <div className="timeline-row">
            <span>{formatTime(currentTime)}</span>
            <div className="timeline" onClick={(event) => { event.stopPropagation(); seek(event); }}>
              <i className="progress" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
              <i className="thumb" style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="actions">
            <div className="group">
              <button className="icon-btn" type="button" onClick={togglePlayback} aria-label={paused ? 'Воспроизвести' : 'Пауза'}>
                {paused ? '▶' : 'Ⅱ'}
              </button>
              <button className="text-btn cc-active" type="button">CC <span>Субтитры</span></button>
            </div>
            <button className="text-btn" type="button" onClick={() => setIntroOpen(true)}>О технологии</button>
          </div>
        </div>

        <div className={`intro ${introOpen ? 'open' : ''}`}>
          <section className="intro-card">
            <p className="intro-kicker"><span>i</span> Caption with Intention</p>
            <h1>Субтитры, которые передают сцену</h1>
            <p className="intro-lead">Прототип показывает, как текст следует за речью и усиливает интонацию, не закрывая действие.</p>
            <div className="pillars">
              <article className="pillar"><div className="pillar-num">01</div><h3>Attribution</h3><p>Цвет помогает различать говорящих.</p></article>
              <article className="pillar"><div className="pillar-num">02</div><h3>Sync</h3><p>Подсветка идёт вслед за произнесённым текстом.</p></article>
              <article className="pillar"><div className="pillar-num">03</div><h3>Intonation</h3><p>Масштаб и движение сохраняют эмоциональный ритм.</p></article>
            </div>
            <div className="intro-actions">
              <span className="hint">Переключайте сцены и сравнивайте режимы.</span>
              <button className="btn-primary" type="button" onClick={() => setIntroOpen(false)}>Смотреть</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
