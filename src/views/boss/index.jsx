import axios from '../../utils/axios';
import { Table, Tag, Space } from 'antd';
import { useState, useEffect } from 'react';

import './index.scss';

function Boss() {
  const [bossList, setBossList] = useState([]);

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
          <a onClick={() => addStadium(bossId, phoneNum)}>添加球场</a>
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

  const addStadium = (bossId, phoneNum) => {
    axios
      .post('/stadium/add', {
        bossId,
        phoneNum,
        name: '我的的球场',
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
        latitude: 0
      })
      .then((res) => {
        getList();
      });
  }

  return (
    <div className="Boss">
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={bossList}
      />
    </div>
  );
}

export default Boss;
