import axios from '../../utils/axios';
import { Table, Tag, Space } from 'antd';
import { useState, useEffect } from 'react';

import './index.scss';

function Stadium() {
  const [stadiumList, setStadiumList] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    axios.post('/stadium/adminList', {}).then((res) => {
      console.log(res);
      setStadiumList(res);
    });
  };

  const columns = [
    {
      title: '场馆ID',
      key: 'id',
      dataIndex: 'id',
      render: (id) => <span>{id}</span>,
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

  return (
    <div className="Stadium">
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={stadiumList}
        scroll={{ x: 1300 }}
      />
    </div>
  );
}

export default Stadium;
