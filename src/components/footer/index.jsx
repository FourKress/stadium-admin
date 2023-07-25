import { Layout } from 'antd';
import React from 'react';

import './index.scss'

const { Footer } = Layout;

function MyFooter() {
  return (
    <Footer>
      <div className="footer"><a href="https://beian.miit.gov.cn/" target="_blank">渝ICP备2022000107号-1</a></div>
    </Footer>
  );
}

export default MyFooter;
