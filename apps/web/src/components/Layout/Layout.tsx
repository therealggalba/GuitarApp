import React from 'react';
import { useTranslation } from 'react-i18next';
import './Layout.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="logo">GuitarApp</div>
        <nav className="nav">
          <button onClick={toggleLanguage} className="lang-toggle">
            {i18n.language.toUpperCase()}
          </button>
        </nav>
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        &copy; {new Date().getFullYear()} GuitarApp - Professional Series
      </footer>
    </div>
  );
};

export default Layout;
