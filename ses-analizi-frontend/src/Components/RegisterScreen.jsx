import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "../styles/css/registerPage.css"
import { useEffect } from 'react';
function RegisterScreen() {

    const [name, setName] = useState("");
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate();
    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) {
            console.log('kullanıcı zaten daha önce oturum açmış..')
            navigate('/homePage')
        }
    })

    const handleRegister = async (e) => {
        e.preventDefault();


        // Şifre ve Şifre Tekrarı Kontrolü
        if (password !== confirmPassword) {
            setErrorMessage('Şifreler aynı değil!');
            return;
        }

        try {
            // backend kullanıcı kaydı için istek atalım
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                body: JSON.stringify({ name, surname, email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // eğer istek başarılı ise 

            if (response.ok) {
                const data = await response.json();
                console.log("kayıt başarılı data : ", data)
                setErrorMessage("");
                navigate('/loginPage'); // Kayıt başarılıysa giriş sayfasına yönlendir

            }
            else { // eğer kayıtta bir sorun varsa mail veya parola ile ilgili
                const errorData = await response.json();
                console.log('hata nedeni', errorData)
                if (errorData.error === 'Email already exists') {
                    setErrorMessage('Bu email adresi zaten kayıtlı!');
                } else {
                    setErrorMessage('Kayıt başarısız oldu. Tekrar deneyin.');
                }
            }
        } catch (error) {
            console.error('Hata:', error);
            setErrorMessage('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <h2 className="text-center">Kayıt Ol</h2>

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="name">Ad :</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Adınızı Giriniz"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="surname">Soyad :</label>
                        <input
                            type="text"
                            id="surname"
                            className="form-control"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            placeholder="Soyadınız Giriniz"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email :</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Adresinizi Giriniz"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Şifre :</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Şifre Giriniz"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Şifre Tekrarı :</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Şifre Tekrarını Giriniz"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">Kayıt Ol</button>

                    {errorMessage && <p className="error-message text-center">{errorMessage}</p>}

                    <div className="text-center mt-3">
                        Hesabın var mı? <Link to="/loginPage" className="link">Giriş Yap</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterScreen
