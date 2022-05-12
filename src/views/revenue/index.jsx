import axios from '../../utils/axios';
import {
  Table,
  Space,
  Row,
  Col,
  Drawer,
  Divider,
  DatePicker,
  Collapse,
  Form,
  Button,
} from 'antd';
import { useState, useEffect } from 'react';
import moment from 'moment';

import './index.scss';

const { Panel } = Collapse;

function Revenue() {
  const [stadiumList, setStadiumList] = useState([]);
  const [revenueInfo, setRevenueInfo] = useState({ visible: false });
  const [runDate, setRunDate] = useState(moment().format('YYYY-MM-DD'));
  const [matchCoverOrderList, setMatchCoverOrderList] = useState([]);
  const [payInfo, setPayInfo] = useState({ success: [], isSuccess: false });

  useEffect(() => {
    getList();
  }, []);

  const getList = (params = {}) => {
    const { runDate } = params;
    const runDateStr = moment(runDate).format('YYYY-MM-DD');
    setRunDate(runDateStr);
    axios
      .get('/match/getToDayRevenue', {
        params: {
          ...params,
          runDate: runDateStr,
        },
      })
      .then((res) => {
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
      title: '场馆名称',
      key: 'name',
      dataIndex: 'name',
      render: (name) => <span>{name}</span>,
    },
    {
      title: '场馆电话',
      key: 'phoneNum',
      dataIndex: 'phoneNum',
      render: (phoneNum) => <span>{phoneNum}</span>,
    },

    {
      title: '操作',
      key: 'action',
      render: ({ id }) => (
        <Space size="middle">
          <a onClick={() => getRevenueInfo(id)}>查看营收</a>
        </Space>
      ),
    },
  ];

  const getRevenueInfo = (id) => {
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

  const onFinish = (values) => {
    getList(values);
  };

  return (
    <div className="Revenue">
      <Form
        name="RevenueSearch"
        initialValues={{
          runDate: moment(),
        }}
        colon={false}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row>
          <Col span={8}>
            <Form.Item label="场主" name="runDate">
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={stadiumList}
        scroll={{ x: 1300 }}
      />

      <Drawer
        width={840}
        className={'revenue-drawer'}
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

export default Revenue;
