import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PromoCode from '../components/PromoCode';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(0);

  const discountAmount = total * discount / 100;
  const finalTotal     = total - discountAmount;

  const placeOrder = async () => {
    try {
      const { data } = await axios.post('/api/orders',
        {
          items: cartItems,
          shippingAddress: { address: '123 Main St', city: 'NYC', zip: '10001' },
          totalPrice: parseFloat(finalTotal.toFixed(2)),
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      clearCart();
      navigate(`/order/${data._id}`);
    } catch {
      alert('Order failed. Please try again.');
    }
  };

  if (cartItems.length === 0) return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h2 style={{ color: '#1a1a2e', marginBottom: 8 }}>Your cart is empty</h2>
        <p style={{ color: '#888', marginBottom: 28 }}>
          Add some products to get started!
        </p>
        <Link to="/" style={{
          padding: '12px 32px', borderRadius: 24,
          background: 'linear-gradient(135deg, #e94560, #f5a623)',
          color: '#fff', fontWeight: 700, textDecoration: 'none',
          boxShadow: '0 4px 16px rgba(233,69,96,0.4)',
        }}>
          Browse Products
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <h2 style={{ fontSize: 32, fontWeight: 900,
          color: '#1a1a2e', marginBottom: 32 }}>
          Shopping Cart
          <span style={{ fontSize: 16, fontWeight: 500,
            color: '#888', marginLeft: 12 }}>
            ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
          </span>
        </h2>

        <div style={{ display: 'grid',
          gridTemplateColumns: '1fr 360px', gap: 28 }}>

          {/* Left — Cart Items */}
          <div>
            {cartItems.map((item) => (
              <div key={item._id} style={{
                background: '#fff', borderRadius: 16,
                padding: '20px 24px', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 20,
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                border: '1.5px solid rgba(48,43,99,0.07)',
              }}>
                {/* Image */}
                <div style={{
                  width: 90, height: 90, flexShrink: 0,
                  background: 'linear-gradient(135deg, #f8f9ff, #eef0f8)',
                  borderRadius: 12, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  <img
                    src={item.thumbnail || item.image || ''}
onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                    alt={item.name}
                    style={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain' }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 700,
                    color: '#1a1a2e', fontSize: 15 }}>
                    {item.name}
                  </p>
                  <p style={{ margin: '0 0 8px', color: '#888', fontSize: 13 }}>
                    {item.category}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, color: '#555' }}>Qty:</span>
                    <span style={{
                      background: 'linear-gradient(135deg, #302b63, #0f0c29)',
                      color: '#f5a623', fontWeight: 700, fontSize: 13,
                      padding: '2px 10px', borderRadius: 8,
                    }}>
                      {item.quantity}
                    </span>
                  </div>
                </div>

                {/* Price + Remove */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    margin: '0 0 10px', fontSize: 18, fontWeight: 800,
                    background: 'linear-gradient(135deg, #e94560, #f5a623)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button onClick={() => removeFromCart(item._id)} style={{
                    background: 'rgba(233,69,96,0.1)',
                    border: '1px solid rgba(233,69,96,0.3)',
                    color: '#e94560', borderRadius: 8, padding: '4px 12px',
                    cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Order Summary */}
          <div>
            <div style={{
              background: '#fff', borderRadius: 20, padding: 28,
              boxShadow: '0 8px 32px rgba(48,43,99,0.1)',
              border: '1.5px solid rgba(48,43,99,0.08)',
              position: 'sticky', top: 90,
            }}>
              <h3 style={{ margin: '0 0 24px', fontSize: 20,
                fontWeight: 800, color: '#1a1a2e' }}>
                Order Summary
              </h3>

              {/* Subtotal */}
              <div style={{ display: 'flex', justifyContent: 'space-between',
                marginBottom: 12, fontSize: 15, color: '#555' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600 }}>${total.toFixed(2)}</span>
              </div>

              {/* Promo Code */}
              <PromoCode onApply={(d) => setDiscount(d)} />

              {/* Discount */}
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  marginTop: 12, fontSize: 15, color: '#00c853' }}>
                  <span>Discount ({discount}%)</span>
                  <span style={{ fontWeight: 700 }}>
                    -${discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Divider */}
              <div style={{ height: 1, background: '#eee', margin: '20px 0' }} />

              {/* Final Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between',
                marginBottom: 24, alignItems: 'center' }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e' }}>
                  Total
                </span>
                <span style={{
                  fontSize: 26, fontWeight: 900,
                  background: 'linear-gradient(135deg, #e94560, #f5a623)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  ${finalTotal.toFixed(2)}
                </span>
              </div>

              {/* Place Order */}
              <button onClick={placeOrder} style={{
                width: '100%', padding: '16px 0',
                border: 'none', borderRadius: 14, cursor: 'pointer',
                fontWeight: 800, fontSize: 16,
                background: 'linear-gradient(135deg, #e94560, #f5a623)',
                color: '#fff',
                boxShadow: '0 6px 24px rgba(233,69,96,0.4)',
              }}>
                Place Order →
              </button>

              {/* Continue shopping */}
              <Link to="/" style={{
                display: 'block', textAlign: 'center',
                marginTop: 14, color: '#888', fontSize: 13,
                textDecoration: 'none',
              }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;