import React from 'react';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <h1>{t('common.welcome')}</h1>
      <p style={{ marginTop: '1rem', color: '#a0a0a0' }}>
        El estándar industrial para guitarristas modernos.
      </p>
      
      <div style={{ marginTop: '2rem' }}>
        <button className="button">
          Comenzar tour
        </button>
      </div>
    </div>
  );
};

export default Home;
