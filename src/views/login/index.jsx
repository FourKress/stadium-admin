import { useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

import './index.scss';
import axios from '../../utils/axios';
import React from 'react';

function Login() {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Success:', values);
    axios
      .post('/auth/adminLogin', {
        phoneNum: values.phoneNum,
        adminPassword: values.password,
      })
      .then((res) => {
        const { token, userInfo } = res;
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        navigate('/');
      });
  };

  return (
    <div className="Login">
      <div className="panel">
        <p className={'title'}>球场通</p>
        <Form name="Login" colon={false} onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="账号"
            required={false}
            name="phoneNum"
            rules={[
              {
                required: true,
                message: '请输入手机号码!',
              },
            ]}
          >
            <Input allowClear maxLength={11} placeholder="请输入手机号码" />
          </Form.Item>

          <Form.Item
            label="密码"
            required={false}
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
          >
            <Input.Password allowClear placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 10,
            }}
          >
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="footer"><a href="https://beian.miit.gov.cn/" target="_blank">渝ICP备2022000107号-1</a></div>
    </div>
  );
}

export default Login;
