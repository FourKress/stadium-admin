import routes from './routes';
import { Layout } from 'antd';

import MyHeader from './components/header';
import MyFooter from './components/footer';
import MySider from './components/sider';

const { Content } = Layout;

function App() {
  return (
    <div className="App">
      <Layout>
        <MySider>Sider</MySider>
        <Layout>
          <MyHeader>Header</MyHeader>
          <Content>{routes}</Content>
          <MyFooter>Footer</MyFooter>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
