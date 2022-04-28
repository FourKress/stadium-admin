import { Table, Tag, Form, Select, Button, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import dayjs from 'dayjs';
import './index.scss';

const { Option } = Select;

const statusList = [
  { label: '成功', value: true },
  { label: '失败', value: false },
];

function Withdraw() {
  const [withdrawList, setWithdrawList] = useState([]);
  const [bossList, setBossList] = useState([]);

  useEffect(() => {
    getList();
    getBossList();
  }, []);

  const getList = (params = {}) => {
    axios.post('/withdraw/adminRecords', params).then((res) => {
      console.log(res);
      setWithdrawList(res);
    });
  };

  const getBossList = () => {
    axios.post('/user/findBossList', {}).then((res) => {
      setBossList(res);
    });
  };

  const onFinish = (values) => {
    console.log(values);
    getList(values);
  };

  const columns = [
    {
      title: '提现ID',
      key: 'id',
      dataIndex: 'id',
      render: (id) => <span>{id}</span>,
    },
    {
      title: '场主',
      key: 'user',
      dataIndex: 'userId',
      render: (userId) => (
        <span>
          <img className={'avatarUrl'} src={userId?.avatarUrl} />
          <span>{userId?.nickName}</span>
        </span>
      ),
    },
    {
      title: '提现状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status ? 'success' : 'error'}>
          {status ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '提现金额',
      dataIndex: 'withdrawAmt',
      key: 'withdrawAmt',
      render: (withdrawAmt) => <span>{withdrawAmt}</span>,
    },
    {
      title: '提现时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => (
        <span>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: '失败CODE',
      dataIndex: 'err_code',
      key: 'err_code',
      render: (err_code) => <span>{err_code}</span>,
    },
    {
      title: '失败原因',
      dataIndex: 'err_code_des',
      key: 'err_code_des',
      render: (err_code_des) => <span>{err_code_des}</span>,
    },
  ];

  return (
    <div className="Withdraw">
      <Form
        name="WithdrawSearch"
        colon={false}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row>
          <Col span={8}>
            <Form.Item label="场主" name="bossId">
              <Select
                listItemHeight={10}
                listHeight={210}
                allowClear
                placeholder="选择场主"
              >
                {bossList.map((boss) => {
                  return (
                    <Option key={boss.bossId} value={boss.bossId}>
                      {boss.nickName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="提现状态" name="status">
              <Select allowClear placeholder="Select a person">
                {statusList.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>

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
        dataSource={withdrawList}
      />
    </div>
  );
}

export default Withdraw;
