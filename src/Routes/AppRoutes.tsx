import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../Views/Home';
import LoginView from '../Views/LoginView';
import RutasPrivadas from './RutasPrivadas';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirecciona la raíz "/" hacia "/Login" */}
      <Route path="/" element={<Navigate to="/Login" replace />} />

      {/* Página de Login (pública) */}
      <Route path="/Login" element={<LoginView />} />

      {/* Página Home protegida */}
      <Route path="/Home" element={<RutasPrivadas element={<Home />} />} />
    </Routes>
  );
};

export default AppRoutes;
