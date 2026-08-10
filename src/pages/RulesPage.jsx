import { Link } from 'react-router-dom';
import {
  rulesConstants,
  rulesForbidden,
  rulesMobileLift,
  rulesMotionGroups,
  rulesPrinciples,
  rulesSignals,
  rulesSync,
} from '../data/animationRules.js';
import './rules.css';

export default function RulesPage() {
  return (
    <div className="rules">
      <div className="rules-bg" aria-hidden="true" />
      <header className="rules-header">
        <Link className="rules-back" to="/">
          ← На главную
        </Link>
        <p className="rules-brand">ИВИ · Caption with Intention</p>
        <h1>Правила анимаций</h1>
        <p className="rules-lead">
          Короткая спецификация движения субтитров: что остаётся неизменным,
          как голос превращается в motion и где проходят жёсткие границы.
        </p>
        <div className="rules-principles" aria-label="Главные принципы">
          {rulesPrinciples.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </header>

      <main className="rules-main">
        <section className="rules-section" aria-labelledby="constants-title">
          <div className="rules-section-head">
            <p>01</p>
            <h2 id="constants-title">Константы</h2>
          </div>
          <div className="rules-const-grid">
            {rulesConstants.map((item) => (
              <article key={item.label} className="rules-const-card">
                <h3>{item.label}</h3>
                <p>{item.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rules-section" aria-labelledby="signals-title">
          <div className="rules-section-head">
            <p>02</p>
            <h2 id="signals-title">Сигналы голоса</h2>
          </div>
          <div className="rules-card-grid">
            {rulesSignals.map((item) => (
              <article key={item.title} className="rules-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rules-section" aria-labelledby="groups-title">
          <div className="rules-section-head">
            <p>03</p>
            <h2 id="groups-title">Группы motion</h2>
          </div>
          <p className="rules-note">
            Эмоции не получают отдельную анимацию каждая. Они собираются в
            небольшое число групп с общим принципом движения.
          </p>
          <div className="rules-card-grid">
            {rulesMotionGroups.map((item) => (
              <article key={item.id} className={`rules-card rules-card-${item.id}`}>
                <p className="rules-card-kicker">{item.emotions}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rules-section" aria-labelledby="sync-title">
          <div className="rules-section-head">
            <p>04</p>
            <h2 id="sync-title">Синхронизация</h2>
          </div>
          <ol className="rules-list">
            {rulesSync.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className="rules-section" aria-labelledby="mobile-title">
          <div className="rules-section-head">
            <p>05</p>
            <h2 id="mobile-title">Мобильный подъём букв</h2>
          </div>
          <div className="rules-card-grid rules-card-grid-3">
            {rulesMobileLift.map((item) => (
              <article key={item.title} className="rules-card">
                <p className="rules-card-kicker">{item.value}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rules-section" aria-labelledby="forbidden-title">
          <div className="rules-section-head">
            <p>06</p>
            <h2 id="forbidden-title">Жёсткие запреты</h2>
          </div>
          <ul className="rules-list rules-list-forbidden">
            {rulesForbidden.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
