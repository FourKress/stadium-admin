import { Layout } from 'antd';

import MySider from '../sider';
import MyHeader from '../header';
import MyFooter from '../footer';
import { Route, Routes } from 'react-router-dom';
import React, { lazy } from 'react';

const Order = lazy(() => import('../../views/order'));
const User = lazy(() => import('../../views/user'));
const Boss = lazy(() => import('../../views/boss'));

const { Content } = Layout;

function MyLayout() {
  return (
    <Layout>
      <MySider>Sider</MySider>
      <Layout>
        <MyHeader>Header</MyHeader>
        <Content>
          <Routes>
            <Route path="/" element={<Order />} />
            <Route path="/user" element={<User />} />
            <Route path="/boss" element={<Boss />} />
          </Routes>
        </Content>
        <MyFooter>Footer</MyFooter>
      </Layout>
    </Layout>
  );
}

export default MyLayout;
