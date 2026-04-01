import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SmartSearch from '../components/SmartSearch';
import NaturalSearch from '../components/NaturalSearch';

const HomePage = () => {
  const [products, setProducts]         = useState([]);
  const [allProducts, setAllProducts]   = useState([]);
  const [searchLabel, setSearchLabel]   = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/products').then(({ data }) => {
      setProducts(data);
      setAllProducts(data);
    });
  }, []);

  // Block non-logged-in users from adding to cart
  const handleAddToCart = (product) => {
    if (!user) { navigate('/login'); return; }
    addToCart(product);
  };

  const handleResults = (data, query) => {
    setProducts(data);
    setSearchLabel(query);
    setActiveCategory('all');
  };

  const categories = ['all', ...new Set(allProducts.map((p) => p.category))];
  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh', paddingBottom: 60 }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 60%, #24243e 100%)',
        padding: '64px 24px 48px', textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: 46, fontWeight: 900, margin: '0 0 12px',
          background: 'linear-gradient(90deg, #f5a623, #e94560, #f5a623)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-1px',
        }}>
          Shop The Best Products
        </h1>
        <p style={{ color: '#aaa', fontSize: 17, margin: '0 0 36px' }}>
          Smart search powered by DFA & NFA — find exactly what you need
        </p>

        {/* Smart Search inside hero */}
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <SmartSearch onResults={handleResults} />
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px' }}>

        {/* Natural Language Search */}
        <NaturalSearch products={allProducts} onResults={handleResults} />

        {/* Section heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', marginBottom: 8 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800,
              color: '#1a1a2e', margin: '0 0 4px' }}>
              {searchLabel ? `Results for "${searchLabel}"` : 'All Products'}
            </h2>
            <p style={{ color: '#888', fontSize: 14, margin: 0 }}>
              {filtered.length} product{filtered.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        {/* Category filter pills */}
        <div style={{ display: 'flex', gap: 10,
          flexWrap: 'wrap', margin: '20px 0 32px' }}>
          {categories.map((cat) => (
            <button key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 22px', borderRadius: 24, border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: 13,
                transition: 'all 0.2s',
                background: activeCategory === cat
                  ? 'linear-gradient(135deg, #e94560, #f5a623)'
                  : '#fff',
                color: activeCategory === cat ? '#fff' : '#555',
                boxShadow: activeCategory === cat
                  ? '0 4px 16px rgba(233,69,96,0.4)'
                  : '0 2px 8px rgba(0,0,0,0.07)',
                transform: activeCategory === cat ? 'translateY(-2px)' : 'none',
              }}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 20, fontWeight: 600 }}>No products found</p>
            <p style={{ fontSize: 14 }}>Try a different search or category</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 28,
          }}>
            {filtered.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                user={user}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Separate ProductCard component for clean hover effects ──
const ProductCard = ({ product: p, user, onAddToCart }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 20,
        overflow: 'hidden', transition: 'all 0.3s ease',
        boxShadow: hovered
          ? '0 20px 60px rgba(48,43,99,0.2)'
          : '0 4px 20px rgba(0,0,0,0.07)',
        border: hovered
          ? '1.5px solid rgba(233,69,96,0.3)'
          : '1.5px solid rgba(48,43,99,0.07)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
      }}>

      {/* Image area */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f9ff, #eef0f8)',
        padding: 24, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        height: 210, position: 'relative', overflow: 'hidden',
      }}>
        <img
          src={p.thumbnail || p.image || 'https://via.placeholder.com/200'}
          alt={p.name}
          style={{
            maxHeight: 170, maxWidth: '100%',
            objectFit: 'contain', transition: 'transform 0.3s',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />

        {/* Stock badge */}
        {p.stock < 15 && (
          <span style={{
            position: 'absolute', top: 12, right: 12,
            background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
            color: '#fff', fontSize: 10, fontWeight: 700,
            padding: '3px 8px', borderRadius: 10,
          }}>
            Low Stock
          </span>
        )}

        {/* Rating badge */}
        {p.rating >= 4.5 && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            background: 'linear-gradient(135deg, #f5a623, #ff6b35)',
            color: '#fff', fontSize: 10, fontWeight: 700,
            padding: '3px 8px', borderRadius: 10,
          }}>
            ⭐ Top Rated
          </span>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 20px 20px' }}>

        {/* Category tag */}
        <span style={{
          display: 'inline-block', fontSize: 10, fontWeight: 800,
          padding: '3px 10px', borderRadius: 12, marginBottom: 10,
          background: 'linear-gradient(135deg, #302b63, #0f0c29)',
          color: '#f5a623', textTransform: 'uppercase', letterSpacing: '0.8px',
        }}>
          {p.category}
        </span>

        {/* Product name */}
        <p style={{
          fontSize: 14, fontWeight: 600, color: '#1a1a2e',
          margin: '0 0 6px', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
          minHeight: 42,
        }}>
          {p.name}
        </p>

        {/* Rating stars */}
        <div style={{ display: 'flex', alignItems: 'center',
          gap: 4, marginBottom: 10 }}>
          <span style={{ color: '#f5a623', fontSize: 13 }}>
            {'★'.repeat(Math.round(p.rating || 4))}
            {'☆'.repeat(5 - Math.round(p.rating || 4))}
          </span>
          <span style={{ color: '#aaa', fontSize: 12 }}>
            ({p.numReviews || 0})
          </span>
        </div>

        {/* Price */}
        <p style={{
          fontSize: 24, fontWeight: 900, margin: '0 0 16px',
          background: 'linear-gradient(135deg, #e94560, #f5a623)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          ${p.price}
        </p>

        {/* Add to Cart button */}
        <button
          onClick={() => onAddToCart(p)}
          style={{
            width: '100%', padding: '12px 0',
            border: 'none', borderRadius: 12,
            cursor: 'pointer', fontWeight: 700,
            fontSize: 14, marginBottom: 10,
            background: user
              ? 'linear-gradient(135deg, #e94560, #f5a623)'
              : 'linear-gradient(135deg, #302b63, #0f0c29)',
            color: '#fff',
            boxShadow: user
              ? '0 4px 16px rgba(233,69,96,0.35)'
              : '0 4px 16px rgba(48,43,99,0.35)',
            transition: 'all 0.2s',
          }}>
          {user ? '🛒 Add to Cart' : '🔒 Login to Buy'}
        </button>

        {/* View Details link */}
        <Link to={`/product/${p._id}`} style={{
          display: 'block', textAlign: 'center',
          padding: '10px 0',
          border: '2px solid #302b63',
          borderRadius: 12, color: '#302b63',
          fontWeight: 600, fontSize: 13,
          textDecoration: 'none', transition: 'all 0.2s',
          background: hovered ? '#302b63' : 'transparent',
          color: hovered ? '#fff' : '#302b63',
        }}>
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default HomePage;