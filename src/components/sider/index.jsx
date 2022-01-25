import { Layout } from 'antd';
import './index.scss';
const { Sider } = Layout;

function MySider() {
  return (
    <Sider collapsible={true} theme="light">
      <div className={'top'}></div>
      <div>sider</div>
    </Sider>
  );
}

export default MySider;
