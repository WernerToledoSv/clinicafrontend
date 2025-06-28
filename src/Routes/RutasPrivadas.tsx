import React from 'react';
import { Navigate } from 'react-router-dom';

// Definimos el tipo de los props de PrivateRoute
interface RutasPrivadas {
  element: React.ReactNode; // `element` puede ser cualquier cosa que React pueda renderizar
}

const isAuthenticated = () => {
  // Revisamos si el usuario está autenticado
  const session = sessionStorage.getItem('Login');
  if (!session) return false;
  try {
    const user = JSON.parse(session);
    return Boolean(user.userName); // o cualquier validación mínima
  } catch {
    return false;
  }
};

const RutasPrivadas: React.FC<RutasPrivadas> = ({ element }) => {
  if (!isAuthenticated()) {
    // Si no está autenticado, redirige a la página de login
    return <Navigate to="/Login" replace />;
  }

  // Si está autenticado, renderiza el componente solicitado
  return <>{element}</>;
};

export default RutasPrivadas;
