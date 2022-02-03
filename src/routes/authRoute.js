import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const MyLayout = lazy(() => import('../components/layout'));

const AuthRoute = () => {
  const auth = localStorage.getItem('token');
  return auth ? <MyLayout /> : <Navigate to="/login" />;
};

export default AuthRoute;
