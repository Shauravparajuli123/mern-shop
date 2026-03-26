import { useEffect, useState } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: '', description: '', stock: '', image: '' });

  useEffect(() => {
    const headers = { Authorization: `Bearer ${user.token}` };
    API.get('/api/products').then(({ data }) => setProducts(data));
    API.get('/api/orders', { headers }).then(({ data }) => setOrders(data));
  }, [user.token]);

  useEffect(() => {
    axios.get('/api/products').then(({ data }) => setProducts(data));
    axios.get('/api/orders', { headers }).then(({ data }) => setOrders(data));
  }, []);

  const createProduct = async () => {
    const { data } = await axios.post('/api/products', form, { headers });
    setProducts([...products, data]);
    setForm({ name: '', price: '', category: '', description: '', stock: '', image: '' });
  };

  const deleteProduct = async (id) => {
    await axios.delete(`/api/products/${id}`, { headers });
    setProducts(products.filter((p) => p._id !== id));
  };

  const markDelivered = async (id) => {
    const { data } = await axios.put(`/api/orders/${id}/deliver`, {}, { headers });
    setOrders(orders.map((o) => (o._id === id ? data : o)));
  };

  const btnStyle = (active) => ({
    padding: '8px 20px', marginRight: 8, borderRadius: 6, border: 'none',
    cursor: 'pointer', background: active ? '#1a1a2e' : '#eee',
    color: active ? '#fff' : '#333'
  });

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2>Admin Dashboard</h2>
      <div style={{ marginBottom: 24 }}>
        <button style={btnStyle(tab === 'products')} onClick={() => setTab('products')}>Products</button>
        <button style={btnStyle(tab === 'orders')}   onClick={() => setTab('orders')}>Orders</button>
      </div>

      {tab === 'products' && (
        <>
          <h3>Add Product</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {['name','price','category','description','stock','image'].map((f) => (
              <input key={f} placeholder={f} value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            ))}
          </div>
          <button onClick={createProduct}
            style={{ padding: '10px 24px', background: '#e94560',
              color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', marginBottom: 28 }}>
            Add Product
          </button>

          <h3>All Products</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                {['Name','Price','Category','Stock',''].map((h) => (
                  <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontSize: 13 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 8px' }}>{p.name}</td>
                  <td style={{ padding: '10px 8px' }}>${p.price}</td>
                  <td style={{ padding: '10px 8px' }}>{p.category}</td>
                  <td style={{ padding: '10px 8px' }}>{p.stock}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <button onClick={() => deleteProduct(p._id)}
                      style={{ background: '#e94560', color: '#fff',
                        border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'orders' && (
        <>
          <h3>All Orders</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                {['Order ID','User','Total','Paid','Delivered',''].map((h) => (
                  <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontSize: 13 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 8px', fontSize: 12 }}>{o._id.slice(-8)}</td>
                  <td style={{ padding: '10px 8px' }}>{o.user?.name || '—'}</td>
                  <td style={{ padding: '10px 8px' }}>${o.totalPrice}</td>
                  <td style={{ padding: '10px 8px' }}>{o.isPaid ? '✅' : '❌'}</td>
                  <td style={{ padding: '10px 8px' }}>{o.isDelivered ? '✅' : '❌'}</td>
                  <td style={{ padding: '10px 8px' }}>
                    {!o.isDelivered && (
                      <button onClick={() => markDelivered(o._id)}
                        style={{ background: '#1a1a2e', color: '#fff',
                          border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;