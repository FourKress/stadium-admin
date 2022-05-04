import axios from '../../utils/axios';
import {
  Table,
  Tag,
  Space,
  Tooltip,
  Form,
  Row,
  Col,
  Drawer,
  Divider,
  Button,
  Select,
  DatePicker,
  Collapse,
  Modal,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import moment from 'moment';

import './index.scss';

const { Panel } = Collapse;
const { Option } = Select;

const appleStatusList = [
  { label: '是', value: true },
  { label: '否', value: false },
];

function Stadium() {
  const [stadiumList, setStadiumList] = useState([]);
  const [bossList, setBossList] = useState([]);
  const [revenueInfo, setRevenueInfo] = useState({ visible: false });
  const [runDate, setRunDate] = useState('');
  const [matchCoverOrderList, setMatchCoverOrderList] = useState([]);
  const [payInfo, setPayInfo] = useState({ success: [], isSuccess: false });

  useEffect(() => {
    getList();
    getBossList();
  }, []);

  const getList = (params = {}) => {
    axios.post('/stadium/adminList', params).then((res) => {
      setStadiumList(res);
    });
  };

  const getBossList = () => {
    axios.post('/user/findBossList', {}).then((res) => {
      setBossList(res);
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
      title: '机器人状态',
      key: 'botStatus',
      render: ({ botStatus, applyBot, wxGroupId }) =>
        botStatus ? (
          <Tag color={wxGroupId ? 'success' : 'error'}>
            {wxGroupId ? '已使用' : '未使用'}
          </Tag>
        ) : (
          <Tag color={applyBot ? 'success' : 'error'}>
            {applyBot ? '已申请' : '未申请'}
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
    {
      title: '操作',
      key: 'action',
      width: 340,
      render: ({ id, applyBot, botStatus, bossId }) => (
        <Space size="middle">
          {/*<a onClick={() => changeOrder(id, bossStatus)}>*/}
          {/*  {bossStatus ? '禁用场主' : '启用场主'}*/}
          {/*</a>*/}
          <a onClick={() => getRevenueInfo(id)}>查看营收</a>
          {applyBot && !botStatus && (
            <a onClick={() => changeBotStatus(id, true)}>开启机器人</a>
          )}
          {applyBot && !botStatus && (
            <a onClick={() => changeBotStatus(id, false)}>驳回申请</a>
          )}
          <a onClick={() => handleStadiumRemove(id, bossId)}>删除场馆</a>
        </Space>
      ),
    },
  ];

  const changeBotStatus = (stadiumId, status) => {
    axios
      .post('/stadium/changeBotStatus', {
        botStatus: status,
        stadiumId,
      })
      .then(() => {
        getList();
      });
  };

  const onFinish = (values) => {
    console.log(values);
    getList(values);
  };

  const getRevenueInfo = (id, runDate = moment().format('YYYY-MM-DD')) => {
    setRunDate(runDate);
    axios
      .post('/order/revenueInfo', {
        runDate,
        stadiumId: id,
      })
      .then((res) => {
        setRevenueInfo({
          stadiumName: res.stadiumName,
          stadiumSumAmount: res.stadiumSumAmount,
          stadiumId: id,
          visible: true,
        });
        setMatchCoverOrderList(res.matchCoverOrderList);
      });
  };

  const handleStadiumRemove = (stadiumId, bossId) => {
    Modal.confirm({
      title: '确定删除给场馆吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        axios
          .post('/stadium/remove', {
            stadiumId,
            bossId,
          })
          .then(() => {
            getList();
          });
      },
    });
  };

  const runDateChange = (date, dateString) => {
    getRevenueInfo(revenueInfo.stadiumId, dateString);
  };

  const handleDrawerClose = () => {
    setRevenueInfo({ visible: false });
  };

  const handleCollapseChange = (key) => {
    console.log(key);
    if (!key?.length) return;
    const matchId = key[0];
    const match = matchCoverOrderList.find((d) => d.id === matchId);
    axios
      .get('/order/findOrderByMatchId', {
        params: {
          matchId,
        },
      })
      .then((res) => {
        console.log(res);
        const isSuccess =
          res?.success?.reduce((sum, curr) => sum + curr.personCount, 0) >=
          match.minPeople;
        setPayInfo({
          ...res,
          isSuccess,
        });
      });
  };

  const panelHeader = (name, time, amt, monthlyCardCount, refundAmt) => {
    return (
      <Space size={'middle'}>
        <span>场次: {name}</span>
        <span>时间: {time}</span>
        <span>总收入: {amt}</span>
        <span>月卡支付: {monthlyCardCount}人</span>
        <span>水费: {refundAmt}</span>
      </Space>
    );
  };

  return (
    <div className="Stadium">
      <Form
        name="StadiumSearch"
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
            <Form.Item label="机器人申请" name="applyBot">
              <Select allowClear placeholder="Select a person">
                {appleStatusList.map((item) => {
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
        dataSource={stadiumList}
        scroll={{ x: 1300 }}
      />

      <Drawer
        width={840}
        className={'stadium-drawer'}
        placement="right"
        onClose={() => handleDrawerClose()}
        visible={revenueInfo.visible}
        keyboard={false}
        maskClosable={false}
      >
        <p
          className="site-description-item-profile-p"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{revenueInfo.stadiumName}的营收详情</span>
          <DatePicker
            value={moment(runDate, 'YYYY-MM-DD')}
            onChange={runDateChange}
          />
        </p>
        <Divider />
        <Row>
          <Col span={12}>今日总收入：{revenueInfo.stadiumSumAmount}</Col>
        </Row>
        <Divider />

        {matchCoverOrderList.length > 0 ? (
          <Collapse onChange={handleCollapseChange}>
            {matchCoverOrderList.map((item) => {
              return (
                <Panel
                  header={panelHeader(
                    item?.space?.name,
                    `${item.startAt}-${item.endAt}`,
                    item.sumPayAmount,
                    item.monthlyCardCount,
                    item.refundAmt,
                  )}
                  key={item.id}
                >
                  <Row>
                    <Col span={8}>
                      组队
                      {payInfo.isSuccess ? '成功' : '失败'}
                    </Col>
                    <Col span={8}>
                      本场收入：
                      {payInfo.isSuccess ? payInfo.totalAmount : '0'}
                    </Col>
                    <Col span={8}>
                      {payInfo.isSuccess
                        ? `付款：${payInfo?.success?.reduce(
                            (sum, curr) => sum + curr.personCount,
                            0,
                          )}人`
                        : `差：${
                            item.minPeople -
                            payInfo?.systemRefund?.reduce(
                              (sum, curr) => sum + curr.personCount,
                              0,
                            )
                          }人`}
                    </Col>
                  </Row>
                  <Divider />
                  <Row>
                    {(payInfo.isSuccess
                      ? payInfo?.success
                      : payInfo?.systemRefund
                    )?.length > 0 && (
                      <Col span={24}>
                        {
                          <span>
                            <span>已{payInfo.isSuccess ? '付' : '退'}款</span>
                            {!payInfo.isSuccess && <span>系统自动退款</span>}
                          </span>
                        }
                      </Col>
                    )}

                    {payInfo?.cancel?.length > 0 && (
                      <Col span={24}>
                        <p>{<span>未付款</span>}</p>
                        {/*<div className={'user-wrap'}>*/}
                        {/*  {payInfo?.cancel?.map((cancel, index) => {*/}
                        {/*    return (*/}
                        {/*      <div className="item">*/}
                        {/*        <span className="user">*/}
                        {/*          <img src={cancel.user?.avatarUrl} />*/}
                        {/*          <span className="name">*/}
                        {/*            {cancel.user?.nickName}*/}
                        {/*          </span>*/}
                        {/*        </span>*/}
                        {/*        <span className="info">*/}
                        {/*          <span className="count">*/}
                        {/*            报名时间：*/}
                        {/*            {moment(cancel.createAt).format(*/}
                        {/*              'MM-DD HH:MM'*/}
                        {/*            )}*/}
                        {/*          </span>*/}
                        {/*        </span>*/}
                        {/*      </div>*/}
                        {/*    );*/}
                        {/*  })}*/}
                        {/*</div>*/}
                      </Col>
                    )}

                    {payInfo?.selfRefund?.length > 0 && (
                      <Col span={24}>
                        <span>本人退款</span>
                      </Col>
                    )}
                  </Row>
                </Panel>
              );
            })}
          </Collapse>
        ) : (
          <p>暂无场次结束, 没有收益</p>
        )}
      </Drawer>
    </div>
  );
}

export default Stadium;
