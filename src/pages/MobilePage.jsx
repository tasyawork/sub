import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/mobile.css';
import { mobileScenes, mobileSpeakerColors } from '../data/mobileScenes.js';
import CaptionOverlay from '../components/CaptionOverlay.jsx';

const sceneKeys = ['calm', 'emotion'];

const neighborPosts = [
  {
    id: 'pirogoova',
    title: 'ИП Пирогова',
    gradient: 'linear-gradient(135deg,#3a2a2f,#1a1218)',
    desc: 'После расставания с мужем домохозяйка Вера открывает свой кондитерский бизнес и обретает счастье',
    badges: [
      { className: 'badge purple', icon: '/icons/blinkingEyes.svg', text: '8,5 • простой сюжет' },
      { className: 'badge white', text: 'комедийный' },
      { className: 'meta-plain', text: '4 сезона' },
    ],
  },
  {
    id: 'room',
    title: 'Комната',
    gradient: 'linear-gradient(145deg,#1c2430,#0d1118)',
    age: '18+',
    desc: 'Юноша, запертый в странной комнате, должен вести онлайн стримы для невидимой публики, чтобы выжить',
    badges: [
      { className: 'badge blue', text: '◉ 12К сейчас смотрят' },
      { className: 'badge white', text: 'комедийный' },
      { className: 'meta-plain', text: '1 ч 14 мин' },
    ],
  },
];

function findCue(cues, time) {
  return cues.find((cue) => time >= cue.start && time <= cue.end) ?? null;
}

function StaticPost({ post }) {
  return (
    <article className="post">
      <div className="thumb static-thumb" style={{ background: post.gradient }}>
        <div className="thumb-title">{post.title}</div>
        {post.age ? <span className="age">{post.age}</span> : null}
      </div>
      <div className="content">
        <div className="row">
          <p className="desc">{post.desc}</p>
          <button className="fav" type="button" aria-label="Добавить в избранное">
            <img src="/icons/lottie_container_wrapper.svg" alt="" />
          </button>
        </div>
        <div className="badges">
          {post.badges.map((badge) => (
            <span key={badge.text} className={badge.className}>
              {badge.icon ? <img src={badge.icon} alt="" /> : null}
              {badge.text}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function MobilePage() {
  const videoRef = useRef(null);
  const previewRef = useRef(null);
  const posterTimerRef = useRef(null);
  const syncFrameRef = useRef(null);
  const [sceneName, setSceneName] = useState('calm');
  const [captionMode, setCaptionMode] = useState('intent');
  const [speakerColorsOn, setSpeakerColorsOn] = useState(false);
  const [syncColorMode, setSyncColorMode] = useState('letter');
  const [letterMotionMode, setLetterMotionMode] = useState('lift');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPoster, setShowPoster] = useState(true);

  const scene = mobileScenes[sceneName];
  const activeCue = findCue(scene.cues, currentTime);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let lastFrame = 0;
    const syncToVideo = (timestamp) => {
      if (timestamp - lastFrame >= 16) {
        setCurrentTime(video.currentTime);
        lastFrame = timestamp;
      }
      if (!video.paused && !video.ended) {
        syncFrameRef.current = window.requestAnimationFrame(syncToVideo);
      }
    };
    const startSync = () => {
      window.cancelAnimationFrame(syncFrameRef.current);
      syncFrameRef.current = window.requestAnimationFrame(syncToVideo);
    };
    const stopSync = () => {
      window.cancelAnimationFrame(syncFrameRef.current);
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('playing', startSync);
    video.addEventListener('pause', stopSync);
    video.addEventListener('ended', stopSync);
    return () => {
      window.cancelAnimationFrame(syncFrameRef.current);
      video.removeEventListener('playing', startSync);
      video.removeEventListener('pause', stopSync);
      video.removeEventListener('ended', stopSync);
    };
  }, []);

  useEffect(() => {
    const preview = previewRef.current;
    const video = videoRef.current;
    if (!preview || !video) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          window.clearTimeout(posterTimerRef.current);
          video.pause();
          setShowPoster(true);
          return;
        }

        setShowPoster(true);
        window.clearTimeout(posterTimerRef.current);
        posterTimerRef.current = window.setTimeout(() => {
          setShowPoster(false);
          video.play().catch(() => {});
        }, 2000);
      },
      { threshold: 0.55 },
    );

    observer.observe(preview);
    return () => {
      observer.disconnect();
      window.clearTimeout(posterTimerRef.current);
    };
  }, [sceneName]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    setCurrentTime(0);
    setDuration(0);
  }, [sceneName]);

  const selectScene = (nextScene) => {
    if (nextScene === sceneName) return;
    setSceneName(nextScene);
  };

  return (
    <div className="mobile-root">
      <aside className="studio">
        <Link to="/">← На главную</Link>
        <h1>Эмоциональные субтитры</h1>
        <p>Управляйте синхронизацией и подачей текста в превью мобильной ленты.</p>
        <section className="panel">
          <label>Сцена</label>
          <div className="seg">
            {sceneKeys.map((key) => (
              <button
                key={key}
                type="button"
                className={sceneName === key ? 'active' : ''}
                onClick={() => selectScene(key)}
              >
                {key === 'calm' ? 'Спокойная' : 'Эмоциональная'}
                <small>{key === 'calm' ? 'диалог' : 'конфликт'}</small>
              </button>
            ))}
          </div>

          <label>Режим субтитров</label>
          <div className="seg modes">
            <button
              type="button"
              className={captionMode === 'intent' ? 'active' : ''}
              onClick={() => setCaptionMode('intent')}
            >
              Intent
            </button>
            <button
              type="button"
              className={captionMode === 'classic' ? 'active' : ''}
              onClick={() => setCaptionMode('classic')}
            >
              Classic
            </button>
          </div>

          <label>Цвета спикеров</label>
          <div className="seg modes">
            <button
              type="button"
              className={speakerColorsOn ? 'active' : ''}
              onClick={() => setSpeakerColorsOn(true)}
            >
              Вкл.
            </button>
            <button
              type="button"
              className={!speakerColorsOn ? 'active' : ''}
              onClick={() => setSpeakerColorsOn(false)}
            >
              Выкл.
            </button>
          </div>

          <label>Синхронизация цвета</label>
          <div className="seg modes">
            <button
              type="button"
              className={syncColorMode === 'letter' ? 'active' : ''}
              onClick={() => setSyncColorMode('letter')}
            >
              По буквам
            </button>
            <button
              type="button"
              className={syncColorMode === 'word' ? 'active' : ''}
              onClick={() => setSyncColorMode('word')}
            >
              По словам
            </button>
          </div>

          <label>Движение букв</label>
          <div className="seg modes">
            <button
              type="button"
              className={letterMotionMode === 'lift' ? 'active' : ''}
              onClick={() => setLetterMotionMode('lift')}
            >
              Подъём
            </button>
            <button
              type="button"
              className={letterMotionMode === 'color' ? 'active' : ''}
              onClick={() => setLetterMotionMode('color')}
            >
              Только цвет
            </button>
          </div>
          <p className="hint">Цвет активного спикера: {activeCue?.speaker ? mobileSpeakerColors[activeCue.speaker] : '—'}</p>
        </section>
      </aside>

      <main className="phone">
        <img className="status-bar" src="/icons/ios-status-bar.svg" alt="" aria-hidden="true" />
        <div className="scroll">
          <div className="filters">
            <button className="filter active" type="button">Всё</button>
            <button className="filter" type="button">Сериалы</button>
            <button className="filter" type="button">Фильмы</button>
            <button className="filter" type="button">Комедии</button>
            <button className="filter" type="button">Мелодрамы</button>
          </div>
          <div className="feed">
            <StaticPost post={neighborPosts[0]} />

            <article className="post">
              <div
                ref={previewRef}
                className={`thumb preview ${captionMode === 'classic' ? 'classic' : ''} ${
                  speakerColorsOn ? 'speaker-colors' : ''
                }`}
                style={{ '--speaker-color': mobileSpeakerColors[activeCue?.speaker] ?? '#00a5ff' }}
              >
                <video
                  ref={videoRef}
                  src={`/${scene.src}`}
                  muted
                  playsInline
                  preload="metadata"
                  onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                  onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                />
                <CaptionOverlay
                  cue={activeCue}
                  time={currentTime}
                  captionMode={captionMode}
                  syncColorMode={syncColorMode}
                  letterMotionMode={letterMotionMode}
                />
                <div className={`poster-cover ${showPoster ? '' : 'hidden'}`} aria-hidden={!showPoster}>
                  <img src="/figma-holod-poster.png" alt="" />
                </div>
                <div className="progress"><i style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} /></div>
                <span className="age">18+</span>
              </div>
              <div className="content">
                <div className="row">
                  <p className="desc">{scene.text}</p>
                  <button className="fav" type="button" aria-label="Добавить в избранное">
                    <img src="/icons/lottie_container_wrapper.svg" alt="" />
                  </button>
                </div>
                <div className="badges">
                  <span className="badge ivi"><img src="/icons/subscription_reposition_ivi.svg" alt="" />сериал Иви</span>
                  <span className="badge white">драма</span>
                  <span className="meta-plain">{sceneName === 'calm' ? '1 сезон' : 'эмоциональная сцена'}</span>
                </div>
              </div>
            </article>

            <StaticPost post={neighborPosts[1]} />
          </div>
        </div>
        <nav className="nav" aria-label="Основная навигация">
          {['Лента', 'Поиск', 'Мини-дорамы', 'Моё', 'Войти'].map((label, index) => (
            <span key={label} className={`nav-item ${index === 0 ? 'active' : ''}`}>
              <i><img src={`/icons/${index + 1}.svg`} alt="" /></i>{label}
            </span>
          ))}
        </nav>
        <div className="home-bar" />
      </main>
    </div>
  );
}
