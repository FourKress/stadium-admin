import { useNavigate } from 'react-router-dom';
import { Layout, Avatar, Space, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './index.scss';
const { Header } = Layout;

function MyHeader() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') ?? '{}');

  const logOut = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => logOut()}>退出登录</Menu.Item>
    </Menu>
  );

  return (
    <Header>
      <div className={'wrap'}>
        <div className={'left'}></div>
        <div className={'right'}>
          <Dropdown overlay={menu} placement="bottomLeft" arrow>
            <Space>
              <Avatar src={userInfo.avatarUrl} />
              <span>{userInfo.nickName}</span>
              <DownOutlined />
            </Space>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
}

export default MyHeader;
