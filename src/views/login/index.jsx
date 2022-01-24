import { Form, Input, Button } from 'antd';
import './index.scss'

function Login() {
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="Login">
      <div className="panel">
        <Form
          name="Login"
          colon={false}
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="账号"
            required={false}
            name="phoneNum"
            allowClear={true}
            maxLength={11}
            rules={[
              {
                required: true,
                message: '请输入手机号码!',
              },
            ]}
          >
            <Input placeholder='请输入手机号码' />
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
            <Input.Password placeholder='请输入密码' />
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
    </div>
  );
}

export default Login;
