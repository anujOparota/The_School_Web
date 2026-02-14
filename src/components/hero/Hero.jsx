import './Hero.css';
import hero from '../../assets/hero.png';

export default function Hero() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${hero})` }}
    >
      <button className="cta">Learn more</button>

      <div className="cards">
        <div className="card">
          <span>👨‍🎓</span>
          <p><b>Enroll</b><br />with us</p>
        </div>

        <div className="card">
          <span>👩‍🏫</span>
          <p><b>Teach</b><br />with us</p>
        </div>

        <div className="card">
          <span>🎓</span>
          <p><b>Alumni</b><br />& Beyond</p>
        </div>
      </div>
    </section>
  );
}
