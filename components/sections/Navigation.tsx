'use client';

import { useState } from 'react';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className="container">
        <div className={styles.navContent}>
          {/* Logo */}
          <a href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#logoGradient)"/>
                <defs>
                  <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8B5CF6"/>
                    <stop offset="1" stopColor="#FBBF24"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className={styles.logoText}>Yantras</span>
          </a>

          {/* Desktop Menu */}
          <ul className={styles.menu}>
            <li><a href="#home">Home</a></li>
            <li 
              className={styles.dropdown}
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <a href="#products">
                Products
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              {isProductsOpen && (
                <div className={styles.dropdownMenu}>
                  <a href="#products">All Products</a>
                  <a href="#products">Accounting</a>
                  <a href="#products">CRM</a>
                  <a href="#products">Point of Sale</a>
                  <a href="#products">Inventory</a>
                  <a href="#products">HR</a>
                </div>
              )}
            </li>
            <li><a href="#solutions">Solutions</a></li>
            <li><a href="#automation">Automation</a></li>
            <li><a href="#company">Company</a></li>
            <li><a href="#resources">Resources</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          {/* CTA Button */}
          <div className={styles.ctaContainer}>
            <a href="#contact" className={styles.contactLink}>Sign In</a>
            <a href="#demo" className="btn btn-primary">
              Contact Us
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.btnArrow}>
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={isMenuOpen ? styles.active : ''}></span>
            <span className={isMenuOpen ? styles.active : ''}></span>
            <span className={isMenuOpen ? styles.active : ''}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#products" onClick={() => setIsMenuOpen(false)}>Products</a>
            <a href="#solutions" onClick={() => setIsMenuOpen(false)}>Solutions</a>
            <a href="#automation" onClick={() => setIsMenuOpen(false)}>Automation</a>
            <a href="#company" onClick={() => setIsMenuOpen(false)}>Company</a>
            <a href="#resources" onClick={() => setIsMenuOpen(false)}>Resources</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
            <a href="#demo" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
              Get Started
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}