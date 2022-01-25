import { Spin } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';

const Loading = (
  <div className="loading">
    <Spin tip="拼命加载中..." size="large" />
  </div>
);

function createLoading() {
  const dom = document.createElement('div');
  dom.setAttribute('class', 'loading');
  document.body.appendChild(dom);
  return ReactDOM.render(<Spin tip="拼命加载中..." size="large" />, dom);
}

function closeLoading() {
  document.body.removeChild(document.querySelector('.loading'));
}

export { createLoading, closeLoading, Loading };
