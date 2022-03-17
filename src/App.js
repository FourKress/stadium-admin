import zhCN from "antd/lib/locale/zh_CN";
import { ConfigProvider } from "antd";
import routes from "./routes";

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">{routes}</div>;
    </ConfigProvider>
  );
}

export default App;
