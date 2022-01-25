import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthRoute from './authRoute';
import { Loading } from '../components/loading';

const Login = lazy(() => import('../views/login'));
const Order = lazy(() => import('../views/order'));
const User = lazy(() => import('../views/user'));

const routes = (
  <Suspense fallback={Loading}>
    <Routes>
      <Route path="/" element={<AuthRoute />}>
        <Route path="/" element={<Order />} />
        <Route path="/user" element={<User />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  </Suspense>
);

export default routes;
