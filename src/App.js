import { Button } from 'antd';
import { Route, Routes } from 'react-router-dom';
import Login from './views/login';
import Order from './views/order';

function App() {
  return (
    <div className="App">
      <Button type="primary">Button</Button>
      <Routes>
        <Route path="/" element={<Order />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
