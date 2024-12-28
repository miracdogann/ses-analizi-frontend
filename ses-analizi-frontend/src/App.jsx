import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import LoginScreen from './Components/LoginScreen';
import RegisterScreen from './Components/RegisterScreen';
import Home from './Components/Home';
import SesKayitGonderme from './Components/SesKayitGonderme';
import SesAnalizi from './Components/SesAnalizi';
import './App.css';
import KonuAnalizi from './Components/KonuAnalizi';
import DuyguAnalizi from './Components/DuyguAnalizi';
import Profile from './Components/Profile';
// import CokluAnaliz from './Components/CokluAnaliz';
import PropTypes from 'prop-types';

PrivateRoute.propTypes = {
  children: PropTypes.node,
};
function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/loginPage" replace />;
  }

  return children;
}

function App() {


  return (
    <Router>
      <AppContent/>
    </Router>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/loginPage" element={<LoginScreen/>} />
      <Route path="/registerPage" element={<RegisterScreen />} />
      <Route
        path="/homePage"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="/homePage/sesKayitGonderme" element={<SesKayitGonderme />} />
      <Route path="/homePage/sesAnalizi" element={<SesAnalizi />} />
      <Route path='/homePage/konuAnalizi' element= {<KonuAnalizi/>}/>
      <Route path='/homePage/duyguAnalizi' element= {<DuyguAnalizi/>}/>
      <Route path='/homePage/profile' element= {<Profile/>}/>
      {/* <Route path='/homePage/cokluAnaliz' element= {<CokluAnaliz/>}/> */}
    </Routes>
  );
}

function WelcomeScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/homePage');
    }
  }, [navigate]);

  return (
    <div className="app container">
      <h2 className=" app title">Ses Analizi Uygulamasına Hoş Geldiniz</h2>
      <p className=" app description">Lütfen giriş yapın veya kayıt olun.</p>

      <div className="app nav-buttons">
        <Link to="/loginPage" className="login">
          Giriş Yap
        </Link>
        <Link to="/registerPage" className="register">
          Kayıt Ol
        </Link>
      </div>

      <div className="img-gif">
        <img className="gif1 mx-2" src="src/styles/images/plays-hum.gif" alt="sound-gif" />
        <img className="gif2" src="src/styles/images/set-diet-sound-bars.gif" alt="" />
      </div>
    </div>
  );
}

export default App;
