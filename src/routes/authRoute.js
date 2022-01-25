import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = () => {
  const auth = localStorage.getItem('token');
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRoute;
