import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaLeaf, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar glass">
      <div className="container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <FaLeaf color="var(--primary-color)" />
          <span>성덕교회 봄소풍</span>
        </Link>
        
        <div className={`nav-links ${isOpen ? 'open glass' : ''}`}>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
            홈
          </NavLink>
          <NavLink to="/gallery" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
            미션 전시관
          </NavLink>
          <NavLink to="/moments" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
            함께한 순간
          </NavLink>
          <NavLink to="/slideshow" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
            슬라이드쇼
          </NavLink>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
