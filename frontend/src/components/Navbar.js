import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      padding: '0 32px', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center',
      height: 68, boxShadow: '0 4px 24px rgba(15,12,41,0.5)',
      position: 'sticky', top: 0, zIndex: 1000,
    }}>
      {/* Logo */}
      <Link to="/" style={{
        fontSize: 26, fontWeight: 900, textDecoration: 'none',
        background: 'linear-gradient(90deg, #f5a623, #e94560)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.5px',
      }}>
        ShopMERN
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

        {/* Cart button */}
        <Link to={user ? '/cart' : '/login'} style={{
          position: 'relative', padding: '9px 20px',
          background: 'linear-gradient(135deg, #e94560, #f5a623)',
          borderRadius: 24, color: '#fff', fontWeight: 700,
          fontSize: 14, textDecoration: 'none',
          boxShadow: '0 4px 15px rgba(233,69,96,0.4)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          🛒 Cart
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: -8, right: -8,
              background: '#fff', color: '#e94560',
              borderRadius: '50%', width: 22, height: 22,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11, fontWeight: 900,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <>
            {/* Admin button */}
            {user.isAdmin && (
              <Link to="/admin" style={{
                padding: '7px 16px',
                background: 'rgba(245,166,35,0.15)',
                border: '1.5px solid #f5a623',
                borderRadius: 20, color: '#f5a623',
                fontSize: 13, fontWeight: 700,
                textDecoration: 'none',
              }}>
                ⚙️ Admin
              </Link>
            )}

            {/* User greeting */}
            <span style={{
              color: '#ccc', fontSize: 13,
              background: 'rgba(255,255,255,0.08)',
              padding: '6px 12px', borderRadius: 20,
            }}>
              👤 {user.name.split(' ')[0]}
            </span>

            {/* Logout */}
            <button onClick={handleLogout} style={{
              padding: '7px 16px',
              background: 'rgba(233,69,96,0.15)',
              border: '1.5px solid #e94560',
              borderRadius: 20, color: '#e94560',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              padding: '8px 20px', borderRadius: 24,
              border: '2px solid rgba(255,255,255,0.3)',
              color: '#fff', fontWeight: 600,
              fontSize: 14, textDecoration: 'none',
            }}>
              Login
            </Link>
            <Link to="/register" style={{
              padding: '8px 20px', borderRadius: 24,
              background: 'linear-gradient(135deg, #302b63, #e94560)',
              color: '#fff', fontWeight: 700,
              fontSize: 14, textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(233,69,96,0.3)',
            }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;