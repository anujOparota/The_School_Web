import { useState } from 'react';
import './Header.css';
import logo from '../../assets/logo.png';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="brand">
          <img src={logo} alt="Institute Logo" />
          <div>
            <span className="small">INSTITUTE</span>
            <span className="big">NAME</span>
          </div>
        </div>

        <nav className={open ? 'nav open' : 'nav'}>
          <a href="#">About ▸</a>
          <a href="#">School ▸</a>
          <a href="#">Enroll ▸</a>
          <a href="#">Program ▸</a>
          <a href="#">News ▸</a>
        </nav>

        <div className="menu" onClick={() => setOpen(!open)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
}
