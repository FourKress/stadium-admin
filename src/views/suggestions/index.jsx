import axios from '../../utils/axios';
import { Table, Image } from 'antd';
import { useState, useEffect } from 'react';

import './index.scss';
import dayjs from 'dayjs';

function Boss() {
  const [suggestionsList, setSuggestionsList] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    axios.post('/suggestions/list', {}).then((res) => {
      setSuggestionsList(res);
    });
  };

  const columns = [
    {
      title: '用户',
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
      title: '内容',
      dataIndex: 'remark',
      key: 'remark',
      render: (remark) => <span>{remark}</span>,
    },
    {
      title: '图片',
      dataIndex: 'imageUrls',
      key: 'imageUrls',
      render: (imageUrls) => (
        <Image.PreviewGroup>
          {imageUrls.map((d) => {
            return (
              <Image
                key={d.path}
                width={200}
                src={`${process.env.REACT_APP_BASE_URL}/serverStatic${d.path}`}
              />
            );
          })}
        </Image.PreviewGroup>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => (
        <span>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
  ];

  return (
    <div className="suggestions">
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={suggestionsList}
      />
    </div>
  );
}

export default Boss;
