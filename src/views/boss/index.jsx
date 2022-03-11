import axios from '../../utils/axios';
import { Table, Tag, Space, Modal, Input, message, Form, Button } from 'antd';
import { useState, useEffect, useRef } from 'react';

import './index.scss';

function Boss() {
  const formRef = useRef(null);
  const [bossList, setBossList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [stadiumInfo, setStadiumInfo] = useState({});

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    axios.post('/user/findBossList', {}).then((res) => {
      setBossList(res);
    });
  };

  const columns = [
    {
      title: '场主微信昵称',
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
    // {
    //   title: '状态',
    //   dataIndex: 'bossStatus',
    //   key: 'bossStatus',
    //   render: (flag) => (
    //     <Tag color={flag ? 'success' : 'error'}>{flag ? '启用' : '禁用'}</Tag>
    //   ),
    // },
    {
      title: '操作',
      key: 'action',
      render: ({ id, bossStatus, bossId, bossPhoneNum }) => (
        <Space size="middle">
          {/*<a onClick={() => changeBoss(id, bossStatus)}>*/}
          {/*  {bossStatus ? '禁用场主' : '启用场主'}*/}
          {/*</a>*/}
          <a onClick={() => showAddDialog({ bossId, bossPhoneNum })}>
            添加球场
          </a>
        </Space>
      ),
    },
  ];

  const showAddDialog = (stadiumInfo) => {
    setStadiumInfo(stadiumInfo);
    setVisible(true);
    formRef.current.setFieldsValue({
      phoneNum: stadiumInfo.bossPhoneNum,
    });
  };

  const onFinish = (values) => {
    setConfirmLoading(true);
    const { bossId } = stadiumInfo;
    const { phoneNum, stadiumName } = values;
    axios
      .post('/stadium/add', {
        bossId,
        phoneNum,
        name: stadiumName,
        address: '',
        stadiumUrls: [],
        remarks: '',
        description: '',
        city: '',
        province: '',
        country: '',
        spaces: [],
        district: '',
        longitude: 0,
        latitude: 0,
        wxGroup: '',
        wxGroupId: '',
        welcomeWords: '',
      })
      .then(async () => {
        setConfirmLoading(false);
        onCancel();
        await message.success('球场添加成功!');
        getList();
      })
      .catch((err) => {
        setConfirmLoading(false);
        console.log(err);
      });
  };

  const onCancel = () => {
    setVisible(false);
    setStadiumInfo({});
    formRef.current.resetFields();
  };

  return (
    <div className="Boss">
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={bossList}
      />
      <Modal
        title="添加球场"
        forceRender
        visible={visible}
        wrapClassName="boss-modal"
        footer={null}
        onCancel={() => onCancel()}
      >
        <Form
          name="BossForm"
          ref={formRef}
          colon={false}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="球场名称"
            name="stadiumName"
            rules={[
              {
                required: true,
                message: '请输入球场名称!',
              },
            ]}
          >
            <Input allowClear placeholder="请输入球场名称" />
          </Form.Item>

          <Form.Item
            label="联系电话"
            name="phoneNum"
            rules={[
              {
                required: true,
                message: '请输入联系电话!',
              },
            ]}
          >
            <Input allowClear maxLength={11} placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item>
            <div className="btn-wrap">
              <Space>
                <Button onClick={() => onCancel()}>取消</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={confirmLoading}
                >
                  确定
                </Button>
              </Space>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Boss;
