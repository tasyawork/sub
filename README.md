# ИВИ — эмоциональные субтитры (React)

Прототип Caption with Intention: плеер и мобильная лента.

## Локально

```bash
npm install
npm run dev
```

- `/` — выбор раздела  
- `/player` — субтитры в плеере (полноэкранный просмотр)  
- `/mobile` — субтитры в мобильной ленте  
- `/rules` — правила анимаций

```bash
npm run build
npm run preview
```

## Анализ громкости (offline)

Чтобы пересчитать `scale` / `stretch` / акценты по аудио из `public/*.mp4`:

```bash
python3 scripts/analyze-cues.py
```

Результат: `scripts/cue-loudness.json`. Значения вручную вшиваются в
`src/data/playerScenes.js` и `src/data/mobileScenes.js` (спокойные реплики
смягчаются, shout/super-пики остаются ручными).

## Деплой

Сборка: `npm run build` → папка `dist`.

### Vercel

```bash
npx vercel
```

Или: импорт репозитория на [vercel.com](https://vercel.com) (Root Directory = `react-app`, если репо — родительская папка).

Уже есть `vercel.json` для SPA-роутинга.

### Netlify

```bash
npx netlify deploy --prod --dir=dist
```

Или drag-and-drop `dist` на [app.netlify.com/drop](https://app.netlify.com/drop). Есть `netlify.toml`.

### Важно про видео

В `public/` лежат ~56 MB mp4. На бесплатных тарифах лимиты по размеру деплоя/файла могут мешать. Если деплой упадёт — вынесите видео на CDN/S3 и поменяйте пути в `src/data/*.js`.

## Стек

Vite + React 19 + React Router.
