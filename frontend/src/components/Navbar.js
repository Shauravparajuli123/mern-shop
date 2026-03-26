import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  return (
    <nav style={{ background: '#1a1a2e', padding: '12px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ color: '#e94560', fontWeight: 700, fontSize: 20,
        textDecoration: 'none' }}>ShopMERN</Link>
      <div style={{ display: 'flex', gap: 20 }}>
        <Link to="/cart" style={{ color: '#fff', textDecoration: 'none' }}>
          Cart ({cartItems.reduce((s, i) => s + i.quantity, 0)})
        </Link>
        {user ? (
          <>
            {user.isAdmin && <Link to="/admin" style={{ color: '#e94560', textDecoration: 'none' }}>Admin</Link>}
            <span style={{ color: '#aaa' }}>Hi, {user.name}</span>
            <button onClick={logout} style={{ background: 'none', border: 'none',
              color: '#e94560', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;