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
      title: '订单ID',
      key: 'id',
      dataIndex: 'id',
      render: (id) => <span>{id}</span>,
    },
    {
      title: '下单用户',
      key: 'nickName',
      dataIndex: 'user',
      render: (user) => <span>
        <img className={'avatarUrl'} src={user.avatarUrl} />
        <span>{user.nickName}</span>
      </span>,
    },
    {
      title: '场主',
      key: 'bossInfo',
      dataIndex: 'bossInfo',
      render: (bossInfo) => <span>
        <img className={'avatarUrl'} src={bossInfo?.avatarUrl} />
        <span>{bossInfo?.nickName}</span>
      </span>,
    },
    {
      title: '球场',
      key: 'stadiumId',
      dataIndex: 'stadiumId',
      render: (stadiumId) => <span>{stadiumId.name}</span>,
    },
    {
      title: '场地',
      key: 'spaceId',
      dataIndex: 'spaceId',
      render: (spaceId) => <span>{spaceId.name}</span>,
    },
    {
      title: '场次',
      key: 'matchId',
      dataIndex: 'matchId',
      render: (matchId) => <span>{matchId.runDate}-{matchId.startAt}-{matchId.endAt}</span>,
    },
    {
      title: '是否新购月卡',
      key: 'newMonthlyCard',
      dataIndex: 'newMonthlyCard',
      render: (newMonthlyCard) => <span>{newMonthlyCard ? '是' : '否'}</span>,
    },
    {
      title: '是否月卡支付',
      key: 'isMonthlyCard',
      dataIndex: 'isMonthlyCard',
      render: (isMonthlyCard) => <span>{isMonthlyCard ? '是' : '否'}</span>,
    },
    {
      title: '支付金额',
      key: 'payAmount',
      dataIndex: 'payAmount',
      render: (payAmount) => <span>{payAmount.toFixed(2)}</span>,
    },
    {
      title: '报名人数',
      key: 'personCount',
      dataIndex: 'personCount',
      render: (personCount) => <span>{personCount}</span>,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <span>{statusMap[status]}</span>,
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
        scroll={{ x: 1300 }}
      />
    </div>
  );
}

export default Order;
