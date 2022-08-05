import axios from '../../utils/axios';
import {
  Tag,
  Space,
  Modal,
  Input,
  message,
  Form,
  Button,
  Row,
  Col,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import './index.scss';

function Bot() {
  const formRef = useRef(null);
  const [botStatus, setBotStatus] = useState(false);
  const [expiredTime, setExpiredTime] = useState('');
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    updateStatus();
  }, []);

  const showDialog = () => {
    setVisible(true);
  };

  const onFinish = (values) => {
    setConfirmLoading(true);
    const { token } = values;
    axios
      .post('/botApi/bot/start', {
        token,
      })
      .then(async () => {
        setConfirmLoading(false);
        onCancel();
        await message.success('Token更换成功!');
      })
      .catch((err) => {
        setConfirmLoading(false);
        console.log(err);
      });
  };

  const onCancel = () => {
    setVisible(false);
    formRef.current.resetFields();
  };

  const updateStatus = () => {
    axios.get('/botApi/bot/status').then((res) => {
      setBotStatus(res?.status);
      setExpiredTime(res?.expiredTime || '暂无');
    });
  };

  const getQrCode = async () => {
    axios.get('/botApi/bot/qrcodeLink').then((res) => {
      if (!res?.qrcodeLink) {
        // message.success(res.qrcodeLink);
        setTimeout(() => {
          const canvas = document.querySelector('#canvas');
          QRCode.toCanvas(
            canvas,
            res.qrcodeLink,
            { width: 256, height: 256 },
            (error) => {
              if (error) {
                console.log('error', error);
                return;
              }
            },
          );
        }, 100);

        Modal.success({
          title: '登录二维码',
          icon: '',
          centered: true,
          content: (
            <div className={'canvas-content'}>
              <canvas id="canvas"></canvas>
            </div>
          ),
        });
      } else {
        message.warning('暂无登录二维码链接!');
      }
    });
  };

  const restart = async () => {
    Modal.confirm({
      title: '确定重启机器人吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        axios.get('/botApi/bot/restart').then(() => {
          updateStatus();
          message.warning('机器人重启成功!');
        });
      },
    });
  };

  return (
    <div className="bot">
      <Space direction={'vertical'}>
        <Row>
          <div className={'tips'}>
            <div>机器人登录状态：</div>
            <Tag color={botStatus ? 'success' : 'error'}>
              {botStatus ? '已登录' : '未登录'}
            </Tag>
          </div>
          <Col span={4}>
            <Button type="primary" onClick={() => updateStatus()}>
              更新机器人登录状态
            </Button>
          </Col>
        </Row>
        <Row>
          <div className={'tips'}>
            <span>Token到期时间：</span>
            <Tag color="error">{expiredTime}</Tag>
          </div>
          <Col span={4}>
            <Button type="primary" onClick={() => showDialog()}>
              更换Token
            </Button>
          </Col>
        </Row>
        <Row>
          <Space>
            <Col span={4}>
              <Button type="primary" onClick={() => restart()}>
                重启机器人
              </Button>
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={() => getQrCode()}>
                获取登录二维码
              </Button>
            </Col>
          </Space>
        </Row>
      </Space>
      <Modal
        title="更换Token"
        forceRender
        visible={visible}
        wrapClassName="bot-modal"
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
            label="Token"
            name="token"
            rules={[
              {
                required: true,
                message: '请输入Token!',
              },
            ]}
          >
            <Input allowClear placeholder="请输入Token" />
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

export default Bot;
