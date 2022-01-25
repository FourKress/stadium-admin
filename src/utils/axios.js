import axios from 'axios';
import React, { Component } from 'react';
import { message } from 'antd';
import { createLoading, closeLoading } from '../components/loading';

const Axios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 30000,
});

Axios.defaults.headers.post['Content-Type'] = 'application/json';

let requestCount = 0;

const showLoading = () => {
  if (requestCount === 0) {
    createLoading();
  }
  requestCount++;
};

// 隐藏loading
const hideLoading = () => {
  requestCount--;
  if (requestCount === 0) {
    closeLoading();
  }
};

const whitelist = '/auth/adminLogin';

// 请求前拦截
Axios['interceptors'].request.use(
  (config) => {
    const { url, headers } = config;

    if (!whitelist.includes(url)) {
      config.headers.Authorization = localStorage.getItem('token');
    }

    if (headers.isLoading !== false) {
      showLoading();
    }

    return config;
  },
  (err) => {
    if (err.config.headers['isLoading'] !== false) {
      hideLoading();
    }
    return Promise.reject(err);
  }
);

// 返回后拦截
Axios['interceptors'].response.use(
  (res) => {
    const { data, config } = res;

    if (config.headers.isLoading !== false) {
      hideLoading();
    }
    if (data.code === 10000) {
      return data.data;
    } else {
      return Promise.reject(data);
    }
  },
  async (err) => {
    if (err.config.headers['isLoading'] !== false) {
      hideLoading();
    }
    if (err.message === 'Network Error') {
      await message.warning('网络连接异常！');
    }
    if (err.code === 'ECONNABORTED') {
      await message.warning('请求超时，请重试');
    }
    return Promise.reject(err);
  }
);

// 把组件引入，并定义成原型属性方便使用
Component.prototype.$axios = Axios;

export default Axios;
