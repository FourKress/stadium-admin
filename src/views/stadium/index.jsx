import axios from '../../utils/axios';
import { Table, Tag, Space, Tooltip } from 'antd';
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
      key: 'user',
      dataIndex: 'user',
      render: (user) => (
        <span>
          <img className={'avatarUrl'} src={user?.avatarUrl} />
          <span>{user?.nickName}</span>
        </span>
      ),
    },
    {
      title: '场馆名称',
      key: 'name',
      dataIndex: 'name',
      render: (name) => <span>{name}</span>,
    },
    {
      title: '场馆状态',
      key: 'validFlag',
      dataIndex: 'validFlag',
      render: (validFlag) => (
        <Tag color={validFlag ? 'success' : 'error'}>
          {validFlag ? '已生效' : '未生效'}
        </Tag>
      ),
    },
    {
      title: '场馆电话',
      key: 'phoneNum',
      dataIndex: 'phoneNum',
      render: (phoneNum) => <span>{phoneNum}</span>,
    },
    {
      title: '月卡状态',
      key: 'monthlyCardStatus',
      dataIndex: 'monthlyCardStatus',
      render: (monthlyCardStatus) => (
        <Tag color={monthlyCardStatus ? 'success' : 'error'}>
          {monthlyCardStatus ? '开启' : '关闭'}
        </Tag>
      ),
    },
    {
      title: '月卡价格',
      key: 'monthlyCardPrice',
      dataIndex: 'monthlyCardPrice',
      render: (monthlyCardPrice) => <span>{monthlyCardPrice}</span>,
    },
    {
      title: '关联微信群',
      key: 'wxGroup',
      dataIndex: 'wxGroup',
      render: (wxGroup) => <span>{wxGroup || '--'}</span>,
    },
    {
      title: '场馆地址',
      key: 'address',
      dataIndex: 'address',
      render: (address) => <span>{address}</span>,
    },
    {
      title: '经纬度',
      render: ({ longitude, latitude }) => (
        <span>
          {longitude},{latitude}
        </span>
      ),
    },
    {
      title: '场馆描述',
      key: 'description',
      dataIndex: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
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
    ,
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
