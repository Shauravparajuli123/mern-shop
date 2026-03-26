import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { useCart } from '../context/CartContext';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    API.get('/api/products').then(({ data }) => setProducts(data));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>All Products</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
        {products.map((p) => (
          <div key={p._id} style={{ border: '1px solid #eee', borderRadius: 8,
            padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <img src={p.image || 'https://via.placeholder.com/200'} alt={p.name}
              style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6 }} />
            <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', color: '#1a1a2e' }}>
              <h4 style={{ margin: '10px 0 4px' }}>{p.name}</h4>
            </Link>
            <p style={{ margin: 0, color: '#e94560', fontWeight: 700 }}>${p.price}</p>
            <button onClick={() => addToCart(p)}
              style={{ marginTop: 10, width: '100%', padding: 8, background: '#1a1a2e',
                color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;