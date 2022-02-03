import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthRoute from './authRoute';
import { Loading } from '../components/loading';

const Login = lazy(() => import('../views/login'));

const routes = (
  <Suspense fallback={Loading}>
    <Routes>
      <Route path="*" element={<AuthRoute />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </Suspense>
);

export default routes;
