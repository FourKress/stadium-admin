import axios from '../../utils/axios';
import { Space, Row, Col, Button } from 'antd';
import { useState, useEffect } from 'react';

import './index.scss';

function Balance() {
  const [balanceInfo, setBalanceInfo] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios.get('/user/getBalance').then((res) => {
      const balance = res.reduce((sum, current) => sum + current.balanceAmt, 0);
      setBalanceInfo(balance);
    });
  };

  return (
    <div className="balance">
      <Space direction={'vertical'}>
        <Row>
          <Space>
            <Col span={4}>
              <Button type="primary">
                场主余额汇总: {balanceInfo || 23131221}
              </Button>
            </Col>
          </Space>
        </Row>
      </Space>
    </div>
  );
}

export default Balance;
