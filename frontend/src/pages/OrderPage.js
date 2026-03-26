import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(({ data }) => setOrder(data));
  }, [id]);

  if (!order) return <p style={{ padding: 24 }}>Loading order...</p>;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
      <h2>Order Confirmed!</h2>
      <p style={{ color: '#666' }}>Order ID: {order._id}</p>
      <hr />
      {order.items.map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
          <span>{item.name} × {item.quantity}</span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <hr />
      <p><strong>Total: ${order.totalPrice.toFixed(2)}</strong></p>
      <p>Status: {order.isDelivered ? 'Delivered' : 'Processing'}</p>
    </div>
  );
};

export default OrderPage;