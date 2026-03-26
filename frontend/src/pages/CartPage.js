import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const placeOrder = async () => {
    try {
      const { data } = await axios.post('/api/orders',
        { items: cartItems, shippingAddress: { address: '123 Main St', city: 'NYC', zip: '10001' }, totalPrice: total },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      clearCart();
      navigate(`/order/${data._id}`);
    } catch {
      alert('Order failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? <p>Your cart is empty.</p> : (
        <>
          {cartItems.map((item) => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee' }}>
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => removeFromCart(item._id)}
                style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
          ))}
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <strong>Total: ${total.toFixed(2)}</strong><br /><br />
            <button onClick={placeOrder}
              style={{ padding: '10px 28px', background: '#e94560',
                color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;