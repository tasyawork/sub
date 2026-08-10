import { Link } from 'react-router-dom';
import './home.css';

export default function HomePage() {
  return (
    <div className="home">
      <div className="home-bg" />
      <main className="home-main">
        <p className="home-brand">ИВИ · Caption with Intention</p>
        <h1>Эмоциональные субтитры</h1>
        <p className="home-lead">
          React-прототип нового подхода к субтитрам: побуквенная синхронизация,
          эмоции слова и сравнение с классическим режимом.
        </p>
        <div className="home-cards">
          <Link className="home-card" to="/player">
            <span className="home-card-num">01</span>
            <strong>Субтитры в плеере</strong>
            <span>Полноэкранный просмотр сцен «Холод» и переключатели режимов</span>
          </Link>
          <Link className="home-card" to="/mobile">
            <span className="home-card-num">02</span>
            <strong>Субтитры в мобилке</strong>
            <span>Автопревью в ленте ИВИ, постер 2 сек и окрашивание по буквам/слову</span>
          </Link>
          <Link className="home-card" to="/rules">
            <span className="home-card-num">03</span>
            <strong>Правила анимаций</strong>
            <span>Константы, сигналы голоса, группы motion, синхронизация и жёсткие запреты</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
