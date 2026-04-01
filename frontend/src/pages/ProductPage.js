import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) { navigate('/login'); return; }
    for (let i = 0; i < quantity; i++) addToCart(product);
    navigate('/cart');
  };

  if (!product) return (
    <div style={{ display: 'flex', justifyContent: 'center',
      alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <p style={{ color: '#888', fontSize: 18 }}>Loading product...</p>
      </div>
    </div>
  );

  const stars = Math.round(product.rating || 4);

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Back button */}
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#302b63', fontWeight: 600, fontSize: 14,
          marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6,
          padding: 0,
        }}>
          ← Back to Products
        </button>

        {/* Product card */}
        <div style={{
          background: '#fff', borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(48,43,99,0.12)',
          border: '1.5px solid rgba(48,43,99,0.08)',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
        }}>

          {/* Left — Image */}
          <div style={{
            background: 'linear-gradient(135deg, #f8f9ff, #eef0f8)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: 48, minHeight: 400,
          }}>
            <img
              src={product.thumbnail || product.image}
              alt={product.name}
              style={{ maxWidth: '100%', maxHeight: 320, objectFit: 'contain' }}
            />
          </div>

          {/* Right — Details */}
          <div style={{ padding: 40, display: 'flex',
            flexDirection: 'column', justifyContent: 'center' }}>

            {/* Category badge */}
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 800,
              padding: '4px 12px', borderRadius: 12, marginBottom: 16,
              background: 'linear-gradient(135deg, #302b63, #0f0c29)',
              color: '#f5a623', textTransform: 'uppercase',
              letterSpacing: '1px', alignSelf: 'flex-start',
            }}>
              {product.category}
            </span>

            {/* Name */}
            <h1 style={{ fontSize: 26, fontWeight: 800,
              color: '#1a1a2e', margin: '0 0 16px', lineHeight: 1.3 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center',
              gap: 8, marginBottom: 16 }}>
              <span style={{ color: '#f5a623', fontSize: 18 }}>
                {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
              </span>
              <span style={{ color: '#888', fontSize: 14 }}>
                {product.rating} ({product.numReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 20 }}>
              <span style={{
                fontSize: 36, fontWeight: 900,
                background: 'linear-gradient(135deg, #e94560, #f5a623)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                ${product.price}
              </span>
            </div>

            {/* Description */}
            <p style={{ color: '#666', lineHeight: 1.7,
              fontSize: 14, marginBottom: 24 }}>
              {product.description}
            </p>

            {/* Stock info */}
            <div style={{ display: 'flex', alignItems: 'center',
              gap: 8, marginBottom: 24 }}>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: product.stock > 0 ? '#00c853' : '#e94560',
                display: 'inline-block',
              }} />
              <span style={{ fontSize: 14, color: '#555', fontWeight: 600 }}>
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : 'Out of stock'}
              </span>
            </div>

            {/* Quantity selector */}
            <div style={{ display: 'flex', alignItems: 'center',
              gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#555' }}>
                Qty:
              </span>
              <div style={{ display: 'flex', alignItems: 'center',
                border: '2px solid #302b63', borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ width: 40, height: 40, border: 'none',
                    background: '#f8f9ff', cursor: 'pointer',
                    fontSize: 18, fontWeight: 700, color: '#302b63' }}>
                  −
                </button>
                <span style={{ width: 44, textAlign: 'center',
                  fontWeight: 700, color: '#1a1a2e', fontSize: 16 }}>
                  {quantity}
                </span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  style={{ width: 40, height: 40, border: 'none',
                    background: '#f8f9ff', cursor: 'pointer',
                    fontSize: 18, fontWeight: 700, color: '#302b63' }}>
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart button */}
            <button onClick={handleAddToCart} style={{
              padding: '16px 0', border: 'none', borderRadius: 14,
              cursor: 'pointer', fontWeight: 800, fontSize: 16,
              background: user
                ? 'linear-gradient(135deg, #e94560, #f5a623)'
                : 'linear-gradient(135deg, #302b63, #0f0c29)',
              color: '#fff',
              boxShadow: user
                ? '0 6px 24px rgba(233,69,96,0.4)'
                : '0 6px 24px rgba(48,43,99,0.4)',
            }}>
              {user ? '🛒 Add to Cart' : '🔒 Login to Buy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;