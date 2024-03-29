import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  TeamOutlined,
  WalletOutlined,
  BarChartOutlined,
  FundOutlined,
  RedditOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss';
const { Sider } = Layout;

function MySider() {
  const navigate = useNavigate();
  const location = useLocation();
  let selectedKeys = [location?.pathname.replace('/', '') ?? ''];

  const handleSelect = ({ key }) => {
    navigate(`/${key}`);
  };

  return (
    <Sider collapsible={true} theme="light">
      <div className={'top'}></div>
      <div>
        <Menu
          selectedKeys={selectedKeys}
          mode="inline"
          onSelect={(event) => handleSelect(event)}
        >
          <Menu.Item key="" icon={<WalletOutlined />}>
            今日营收
          </Menu.Item>
          <Menu.Item key="order" icon={<AppstoreOutlined />}>
            订单管理
          </Menu.Item>
          <Menu.Item key="user" icon={<TeamOutlined />}>
            用户管理
          </Menu.Item>
          <Menu.Item key="boss" icon={<WalletOutlined />}>
            场主管理
          </Menu.Item>
          <Menu.Item key="stadium" icon={<FundOutlined />}>
            场馆管理
          </Menu.Item>
          <Menu.Item key="withdraw" icon={<BarChartOutlined />}>
            提现管理
          </Menu.Item>
          <Menu.Item key="bot" icon={<RedditOutlined />}>
            机器人管理
          </Menu.Item>
          <Menu.Item key="suggestions" icon={<ProfileOutlined />}>
            投诉建议
          </Menu.Item>
          <Menu.Item key="balance" icon={<ProfileOutlined />}>
            场主余额汇总
          </Menu.Item>
        </Menu>
      </div>
    </Sider>
  );
}

export default MySider;
