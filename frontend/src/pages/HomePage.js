import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import SmartSearch from '../components/SmartSearch';
import NaturalSearch from '../components/NaturalSearch';
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchLabel, setSearchLabel] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('/api/products').then(({ data }) => {
      setProducts(data);
      setAllProducts(data);
    });
  }, []);

  const handleResults = (data, query) => {
    setProducts(data);
    setSearchLabel(query);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h2 style={{ color: '#1a1a2e', marginBottom: 20 }}>
        {searchLabel ? `Results for "${searchLabel}"` : 'All Products'}
      </h2>

      <SmartSearch onResults={handleResults} />
<NaturalSearch
  products={allProducts}
  onResults={handleResults}
/>

      {products.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>
          No products found. Try a different search.
        </p>
      ) : (
        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {products.map((p) => (
            <div key={p._id} style={{ border: '1px solid #eee', borderRadius: 8,
              padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <img src={p.image || 'https://via.placeholder.com/200'} alt={p.name}
                style={{ width: '100%', height: 160,
                  objectFit: 'cover', borderRadius: 6 }} />
              <Link to={`/product/${p._id}`}
                style={{ textDecoration: 'none', color: '#1a1a2e' }}>
                <h4 style={{ margin: '10px 0 4px' }}>{p.name}</h4>
              </Link>
              <p style={{ margin: '0 0 4px', color: '#888', fontSize: 13 }}>
                {p.category}
              </p>
              <p style={{ margin: 0, color: '#e94560', fontWeight: 700 }}>
                ${p.price}
              </p>
              <button onClick={() => addToCart(p)}
                style={{ marginTop: 10, width: '100%', padding: 8,
                  background: '#1a1a2e', color: '#fff',
                  border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;