import axios from "../../utils/axios";
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
} from "antd";
import { useState, useEffect } from "react";
import moment from "moment";

import "./index.scss";

const { Option } = Select;

function Stadium() {
  const [stadiumList, setStadiumList] = useState([]);
  const [bossList, setBossList] = useState([]);
  const [revenueInfo, setRevenueInfo] = useState({ visible: false });
  const [runDate, setRunDate] = useState(moment().format("YYYY-MM-DD"));
  const [matchCoverOrderList, setMatchCoverOrderList] = useState([]);

  useEffect(() => {
    getList();
    getBossList();
  }, []);

  const getList = (params = {}) => {
    axios.post("/stadium/adminList", params).then((res) => {
      setStadiumList(res);
    });
  };

  const getBossList = () => {
    axios.post("/user/findBossList", {}).then((res) => {
      setBossList(res);
    });
  };

  const columns = [
    {
      title: "场馆ID",
      key: "id",
      dataIndex: "id",
      render: (id) => <span>{id}</span>,
    },
    {
      title: "场主",
      key: "user",
      dataIndex: "user",
      render: (user) => (
        <span>
          <img className={"avatarUrl"} src={user?.avatarUrl} />
          <span>{user?.nickName}</span>
        </span>
      ),
    },
    {
      title: "场馆名称",
      key: "name",
      dataIndex: "name",
      render: (name) => <span>{name}</span>,
    },
    {
      title: "场馆状态",
      key: "validFlag",
      dataIndex: "validFlag",
      render: (validFlag) => (
        <Tag color={validFlag ? "success" : "error"}>
          {validFlag ? "已生效" : "未生效"}
        </Tag>
      ),
    },
    {
      title: "场馆电话",
      key: "phoneNum",
      dataIndex: "phoneNum",
      render: (phoneNum) => <span>{phoneNum}</span>,
    },
    {
      title: "月卡状态",
      key: "monthlyCardStatus",
      dataIndex: "monthlyCardStatus",
      render: (monthlyCardStatus) => (
        <Tag color={monthlyCardStatus ? "success" : "error"}>
          {monthlyCardStatus ? "开启" : "关闭"}
        </Tag>
      ),
    },
    {
      title: "月卡价格",
      key: "monthlyCardPrice",
      dataIndex: "monthlyCardPrice",
      render: (monthlyCardPrice) => <span>{monthlyCardPrice}</span>,
    },
    {
      title: "关联微信群",
      key: "wxGroup",
      dataIndex: "wxGroup",
      render: (wxGroup) => <span>{wxGroup || "--"}</span>,
    },
    {
      title: "场馆地址",
      key: "address",
      dataIndex: "address",
      render: (address) => <span>{address}</span>,
    },
    {
      title: "经纬度",
      render: ({ longitude, latitude }) => (
        <span>
          {longitude},{latitude}
        </span>
      ),
    },
    {
      title: "场馆描述",
      key: "description",
      dataIndex: "description",
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
      title: "操作",
      key: "action",
      render: ({ id, bossStatus, bossId }) => (
        <Space size="middle">
          {/*<a onClick={() => changeOrder(id, bossStatus)}>*/}
          {/*  {bossStatus ? '禁用场主' : '启用场主'}*/}
          {/*</a>*/}
          <a onClick={() => getRevenueInfo(id, runDate)}>查看营收</a>
        </Space>
      ),
    },
  ];

  const onFinish = (values) => {
    console.log(values);
    getList(values);
  };

  const getRevenueInfo = (id, runDate) => {
    axios
      .post("/order/revenueInfo", {
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

  const runDateChange = (date, dateString) => {
    getRevenueInfo(revenueInfo.stadiumId, dateString);
  };

  return (
    <div className="Stadium">
      <Form
        name="StadiumSearch"
        colon={false}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item label="场主" name="bossId">
          <Select allowClear placeholder="选择场主" optionFilterProp="children">
            {bossList.map((boss) => {
              return (
                <Option key={boss.bossId} value={boss.bossId}>
                  {boss.nickName}
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
        dataSource={stadiumList}
        scroll={{ x: 1300 }}
      />

      <Drawer
        width={640}
        placement="right"
        onClose={() => setRevenueInfo({ visible: false })}
        visible={revenueInfo.visible}
      >
        <p
          className="site-description-item-profile-p"
          style={{
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{revenueInfo.stadiumName}的营收详情</span>
          <DatePicker
            defaultValue={moment(runDate, "YYYY-MM-DD")}
            onChange={runDateChange}
          />
        </p>
        <Divider />

        {matchCoverOrderList.length > 0 &&
          matchCoverOrderList.map((item) => {
            return (
              <div key={item.id}>
                <Row>
                  <Col span={12}>
                    <Row>
                      <Col span={24}>
                        {item.startAt}-{item.endAt}
                      </Col>
                      <Col span={24}>{item?.space?.name}</Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row>
                      {item.selectPeople < item.minPeople ? (
                        <Col span={24}>
                          <span className="fail">组队失败</span>
                          <span className="tips">
                            差{item.minPeople - item.selectPeople}人
                          </span>
                        </Col>
                      ) : (
                        <Col span={24}>
                          <span>
                            <span>
                              <span style="font-size: 18px;">+</span>
                              <span style="font-size: 14px;">￥</span>
                            </span>
                            <span className="money">{item.sumPayAmount}</span>
                          </span>
                          <span className="tips">
                            {item.ordinaryCount > 0 && (
                              <span>
                                ￥{item.rebatePrice}X{item.ordinaryCount}
                              </span>
                            )}
                            {item.monthlyCardCount > 0 && (
                              <span> + {item.monthlyCardCount}月卡</span>
                            )}
                            {item.refundAmt > 0 && (
                              <span> - 退{item.refundAmt}</span>
                            )}
                          </span>
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              </div>
            );
          })}
        <Divider />

        <Row>
          <Col span={12}>今日总收入：{revenueInfo.stadiumSumAmount}</Col>
          <Col span={12}></Col>
        </Row>
      </Drawer>
    </div>
  );
}

export default Stadium;
