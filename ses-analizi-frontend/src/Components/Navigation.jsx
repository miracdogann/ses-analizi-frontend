import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/css/navigation.css';

function Navigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user'); // Kullanıcı bilgisini sil
    navigate('/'); // Ana sayfaya yönlendir
  };

  return (
    <nav className="navigation-bar">
      <div className="nav-logo">
        <Link to="/homePage">Ses Analizi</Link>
      </div>
      <div className="nav-links">
        <div className="nav-links-left">
          <Link to="/homePage">Ana Sayfa</Link>
          <Link to="/homePage/sesKayitGonderme">Ses Kayıt Etme</Link>
          {/* <Link to="/homePage/cokluAnaliz">Çoklu Analiz</Link> */}
          <Link to="/homePage/sesAnalizi">Ses Analizi  (Tek)</Link>
          <Link to="/homePage/konuAnalizi">Konu Analizi</Link>
          <Link to={"/homePage/duyguAnalizi"}>Duygu Analizi</Link>
          <Link to="/homePage/profile">Profil</Link>
        </div>
        <div className="nav-links-right">
          <button onClick={handleLogout} className="logout-button">
            Çıkış Yap
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
