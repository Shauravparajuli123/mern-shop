import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`/api/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24, display: 'flex', gap: 32 }}>
      <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name}
        style={{ width: 300, height: 300, objectFit: 'cover', borderRadius: 8 }} />
      <div>
        <h2>{product.name}</h2>
        <p style={{ color: '#666' }}>{product.description}</p>
        <p style={{ fontSize: 24, fontWeight: 700, color: '#e94560' }}>${product.price}</p>
        <p>Category: {product.category}</p>
        <p>In Stock: {product.stock}</p>
        <button onClick={() => addToCart(product)}
          style={{ padding: '10px 24px', background: '#1a1a2e',
            color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductPage;