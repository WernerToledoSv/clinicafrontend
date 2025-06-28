import './Styles/LoginStyle.css';
import { useEffect, useState } from 'react';
import { LoginComponent } from '../Components/Login/LoginComponent';
import CambioContraComponent from '../Components/Login/CambioContraComponent';

const LoginView = () => {
  const [showCambioContra, setShowCambioContra] = useState(false);

  const handleChangeView = () => {
    setShowCambioContra(true); // Mostrar componente de cambio de contraseña
  };

  const handleBackToLogin = () => {
    setShowCambioContra(false); // Volver al login
  };

  useEffect(() => {
    sessionStorage.removeItem('Login');
  }, []);

  return (
    <div className='login-bg'>
      {showCambioContra ? (
        <CambioContraComponent onBackToLogin={handleBackToLogin} />
      ) : (
        <LoginComponent onChangeView={handleChangeView} />
      )}
    </div>
  );
};

export default LoginView;
