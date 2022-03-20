import { Table, Tag, Space, Form, Select, Button } from 'antd';
import { useState, useEffect } from 'react';
import axios from '../../utils/axios';

import './index.scss';

const { Option } = Select;

const appleStatusList = [
  { label: '是', value: true },
  { label: '否', value: false },
];

function User() {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = (params = {}) => {
    axios.post('/user/findUserList', params).then((res) => {
      console.log(res);
      setUserList(res);
    });
  };

  const onFinish = (values) => {
    console.log(values);
    getList(values);
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
      title: '是否申请',
      dataIndex: 'isApplyForBoss',
      key: 'isApplyForBoss',
      render: (isApplyForBoss) => (
        <Tag color={isApplyForBoss ? 'success' : 'error'}>
          {isApplyForBoss ? '已申请' : '未申请'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: ({ id }) => (
        <Space size="middle">
          <a onClick={() => setBoss(id)}>设为场主</a>
          <a onClick={() => rejectApply(id)}>驳回申请</a>
        </Space>
      ),
    },
  ];

  const rejectApply = (id) => {
    axios
      .post('/user/changeApplyForBoss', {
        id,
        isApplyForBoss: false,
      })
      .then((res) => {
        getList();
      });
  };

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
      <Form
        name="UserSearch"
        colon={false}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item label="是否申请" name="isApplyForBoss">
          <Select
            allowClear
            placeholder="Select a person"
            optionFilterProp="children"
          >
            {appleStatusList.map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 10,
          }}
        >
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={userList}
      />
    </div>
  );
}

export default User;
