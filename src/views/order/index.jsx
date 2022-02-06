import { Link } from 'react-router-dom';

function Order() {
  return (
    <div className="Order">
      <Link to="/user">跳转User</Link>
    </div>
  );
}

export default Order;
