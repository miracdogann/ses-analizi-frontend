import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/css/loginPage.css";
import { useEffect } from 'react';

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  useEffect(()=>{
   const  user = localStorage.getItem('user')
    if(user){
      console.log('kullanıcı zaten daha önce oturum açmış..')
      navigate('/homePage')
    }
  })
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          console.error("User bilgisi mevcut değil");
        }
        setErrorMessage('');
        navigate('/homePage');
      } else {
        setErrorMessage("Email veya Parola Hatalı");
      }
    } catch (error) {
      console.error("Sunucu hatası:", error);
      setErrorMessage("Sunucu Hatası. Lütfen Daha Sonra Tekrar Deneyin.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Giriş Yap</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email adresinizi giriniz"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi giriniz"
              required
            />
          </div>
          <button type="submit">Giriş Yap</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="mt-3 text-center">
            <p>Hesabınız yok mu? <Link className="link" to="/registerPage">Kayıt Ol</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;
