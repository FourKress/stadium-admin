import axios from '../../utils/axios';
import {Table, Tag, Space, Modal, Input, message} from 'antd';
import { useState, useEffect } from 'react';

import './index.scss';

function Boss() {
  const [bossList, setBossList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [stadiumInfo, setStadiumInfo] = useState({});
  const [stadiumName, setStadiumName] = useState('');

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    axios.post('/user/findBossList', {}).then((res) => {
      console.log(res);
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
      render: ({ id, bossStatus, bossId, phoneNum }) => (
        <Space size="middle">
          {/*<a onClick={() => changeBoss(id, bossStatus)}>*/}
          {/*  {bossStatus ? '禁用场主' : '启用场主'}*/}
          {/*</a>*/}
          <a onClick={() => showAddDialog({ bossId, phoneNum })}>添加球场</a>
        </Space>
      ),
    },
  ];

  // const changeBoss = (id, bossStatus) => {
  //   axios
  //     .post('/user/changeBossStatus', {
  //       id,
  //       bossStatus: !bossStatus,
  //     })
  //     .then((res) => {
  //       getList();
  //     });
  // };

  const showAddDialog = (stadiumInfo) => {
    setStadiumInfo(stadiumInfo);
    setVisible(true);
  };

  const handleStadiumName = (event) => {
    const value = event.target.value;
    setStadiumName(value);
  };

  const addStadium = async () => {
    if (!stadiumName) {
      await message.warning('请输入球场名称');
      return
    }
    setConfirmLoading(true);
    const { bossId, phoneNum } = stadiumInfo;
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
      .then((res) => {
        setConfirmLoading(false);
        setVisible(false);
        setStadiumInfo({});
        setStadiumName('');
        getList();
      })
      .catch((err) => {
        setConfirmLoading(false);
        console.log(err);
      });
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
        visible={visible}
        okText="确定"
        cancelText="取消"
        onOk={() => addStadium()}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
      >
        <Input
          maxLength={12}
          value={stadiumName}
          placeholder="请输入球场名称"
          onChange={(event) => handleStadiumName(event)}
        />
      </Modal>
    </div>
  );
}

export default Boss;
