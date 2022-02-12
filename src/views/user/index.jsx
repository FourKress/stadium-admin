import { Table, Tag, Space } from 'antd';
import { useState, useEffect } from 'react';
import axios from '../../utils/axios';

import './index.scss';

function User() {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    axios.post('/user/findUserList', {}).then((res) => {
      console.log(res);
      setUserList(res);
    });
  };

  const columns = [
    {
      title: '用户微信昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      render: (nickName) => <span>{nickName}</span>,
    },
    {
      title: '头像',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      render: (src) => <img className={'avatarUrl'} src={src} />,
    },
    {
      title: '操作',
      key: 'action',
      render: ({ id }) => (
        <Space size="middle">
          <a onClick={() => setBoss(id)}>设为场主</a>
        </Space>
      ),
    },
  ];

  const setBoss = (id) => {
    axios
      .post('/user/setBoss', {
        id,
      })
      .then((res) => {
        getList();
      });
  };

  return (
    <div className="User">
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={userList}
      />
    </div>
  );
}

export default User;
