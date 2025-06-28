import React, { useEffect, useState } from 'react';
import NavbarAdmin from './NavbarAdminComponent';
import NavbarUserComponent from './NavbarUserComponent';
import NavbarEnfermero from './NavbarEnfermero';
import NavbarDoctor from './NavbarDoctor';

const App: React.FC = () => {
  const [userType, setUserType] = useState<string>('');

  useEffect(() => {
    const storedLogin = sessionStorage.getItem('Login');

    if (storedLogin) {
      const loginData = JSON.parse(storedLogin);
      const idRol = loginData?.idRol;

      if (idRol === 1) setUserType('admin');
      else if (idRol === 2) setUserType('user');
      else if (idRol === 3) setUserType('enfermero');
      else if(idRol === 4) setUserType('Doctor');
      else setUserType('user'); // por defecto
    } else {
      setUserType('user'); // si no hay login
    }
  }, []);

  if (userType === null) return <div>Cargando...</div>;

  return (
    <div style={{ height: '100vh' }}>
      {
        userType === 'admin' ? <NavbarAdmin /> :
        userType === 'user' ? <NavbarUserComponent />:
        userType === 'enfermero' ? <NavbarEnfermero /> :
        userType === 'Doctor' ? <NavbarDoctor />:
        <NavbarUserComponent />

      }
    </div>
  );
};

export default App;
