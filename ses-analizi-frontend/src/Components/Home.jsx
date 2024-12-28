import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import "../styles/css/homePage.css";


export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      // Kullanıcı oturum açmamışsa anasayfaya yönlendir
      navigate('/');
    }
  }, [navigate]); // navigate yalnızca component mount olduğunda çalışacak

  return (
    <>
      <Navigation />
      <div className="homePage container">
        <div className="ana row">
          <div className="col-md-6 col-sm-12 text-center">
            <img className="voice-img" src="src/styles/images/voiceover.png" alt="Voice Analysis" />
          </div>
          <div className="col-md-6 col-sm-12 text-center my-5">
            <div className="row">
              <h2 className="HomePageTitle">Ses Analizi Sonucunda</h2>
            </div>
            <div className="row">Kişi Tanıma</div>
            <div className="row">Duygu Tahmini</div>
            <div className="row">Konu Analizi</div>
            <div className="row">
              Gibi Sonuçlara Erişebileceksiniz...
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
