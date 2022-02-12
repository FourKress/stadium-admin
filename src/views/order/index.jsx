import axios from '../../utils/axios';
import { Table, Tag, Space } from 'antd';
import { useState, useEffect } from 'react';

import './index.scss';

const statusMap = {
  0: '待付款',
  5: '支付中',
  1: '待开始', // 已支付
  7: '进行中',
  4: '退款中',
  3: '已退款',
  2: '已完成',
  6: '已取消',
  8: '支付失败',
  9: '退款失败',
};

function Order() {
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    axios.post('/order/list', {}).then((res) => {
      console.log(res);
      setOrderList(res);
    });
  };

  const columns = [
    {
      title: '下单用户',
      key: 'nickName',
      dataIndex: ['user', 'nickName'],
      render: (nickName) => <span>{nickName}</span>,
    },
    {
      title: '头像',
      dataIndex: ['user', 'avatarUrl'],
      key: 'avatarUrl',
      render: (src) => <img className={'avatarUrl'} src={src} />,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={'success'}>{statusMap[status]}</Tag>,
    },
    // {
    //   title: '操作',
    //   key: 'action',
    //   render: ({ id, bossStatus }) => (
    //     <Space size="middle">
    //       <a onClick={() => changeOrder(id, bossStatus)}>
    //         {bossStatus ? '禁用场主' : '启用场主'}
    //       </a>
    //     </Space>
    //   ),
    // },
  ];

  const changeOrder = (id, bossStatus) => {
    // axios
    //   .post('/user/changeBossStatus', {
    //     id,
    //     bossStatus: !bossStatus,
    //   })
    //   .then((res) => {
    //     getList();
    //   });
  };

  return (
    <div className="Order">
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={orderList}
      />
    </div>
  );
}

export default Order;
