import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab]           = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading]       = useState(false);
  const [form, setForm] = useState({
    name: '', price: '', category: '',
    description: '', stock: '', image: ''
  });

  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => {
    axios.get('/api/products').then(({ data }) => setProducts(data));
    axios.get('/api/orders', { headers }).then(({ data }) => setOrders(data));
  }, []);

  // Handle image file selection — shows preview instantly
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Upload image to Cloudinary via backend
  const handleImageUpload = async () => {
    if (!imageFile) return alert('Please select an image first');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setForm((prev) => ({ ...prev, image: data.url }));
      alert('Image uploaded successfully!');
    } catch {
      alert('Image upload failed. Please try again.');
    }
    setUploading(false);
  };

  const createProduct = async () => {
    if (!form.name || !form.price || !form.category || !form.description) {
      return alert('Please fill in all fields');
    }
    if (!form.image) {
      return alert('Please upload an image first');
    }
    const { data } = await axios.post('/api/products', form, { headers });
    setProducts([...products, data]);
    setForm({ name: '', price: '', category: '', description: '', stock: '', image: '' });
    setImageFile(null);
    setImagePreview('');
    alert('Product created successfully!');
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
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
    color: active ? '#fff' : '#333', fontWeight: active ? 600 : 400,
  });

  const inputStyle = {
    padding: 10, borderRadius: 6,
    border: '1px solid #ddd', fontSize: 14, width: '100%',
  };

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ color: '#1a1a2e', marginBottom: 24 }}>Admin Dashboard</h2>

      {/* Tabs */}
      <div style={{ marginBottom: 28 }}>
        <button style={btnStyle(tab === 'products')} onClick={() => setTab('products')}>
          Products
        </button>
        <button style={btnStyle(tab === 'orders')} onClick={() => setTab('orders')}>
          Orders
        </button>
      </div>

      {/* ── PRODUCTS TAB ── */}
      {tab === 'products' && (
        <>
          {/* Add Product Form */}
          <div style={{ background: '#f9f9f9', borderRadius: 10,
            padding: 24, marginBottom: 36, border: '1px solid #eee' }}>
            <h3 style={{ marginTop: 0, marginBottom: 20, color: '#1a1a2e' }}>
              Add New Product
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>
                  Product Name
                </label>
                <input style={inputStyle} placeholder="e.g. Nike Air Max"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>
                  Price ($)
                </label>
                <input style={inputStyle} placeholder="e.g. 99.99" type="number"
                  value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>
                  Category
                </label>
                <input style={inputStyle} placeholder="e.g. Shoes"
                  value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>
                  Stock
                </label>
                <input style={inputStyle} placeholder="e.g. 50" type="number"
                  value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>
                  Description
                </label>
                <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }}
                  placeholder="Product description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>

            {/* Image Upload Section */}
            <div style={{ border: '2px dashed #ddd', borderRadius: 8,
              padding: 20, marginBottom: 16, background: '#fff' }}>
              <label style={{ fontSize: 13, color: '#555',
                display: 'block', marginBottom: 12, fontWeight: 600 }}>
                Product Image
              </label>

              {/* Image Preview */}
              {imagePreview && (
                <div style={{ marginBottom: 12 }}>
                  <img src={imagePreview} alt="preview"
                    style={{ width: 160, height: 160, objectFit: 'cover',
                      borderRadius: 8, border: '1px solid #ddd' }} />
                </div>
              )}

              {/* If image already uploaded to cloudinary show the URL */}
              {form.image && (
                <p style={{ fontSize: 12, color: 'green', marginBottom: 8 }}>
                  ✅ Image uploaded successfully
                </p>
              )}

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* File picker */}
                <label style={{ padding: '8px 16px', background: '#1a1a2e',
                  color: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                  Choose Image
                  <input type="file" accept="image/*" onChange={handleImageSelect}
                    style={{ display: 'none' }} />
                </label>

                {/* Upload button */}
                {imageFile && !form.image && (
                  <button onClick={handleImageUpload} disabled={uploading}
                    style={{ padding: '8px 16px', background: uploading ? '#aaa' : '#e94560',
                      color: '#fff', border: 'none', borderRadius: 6,
                      cursor: uploading ? 'not-allowed' : 'pointer', fontSize: 13 }}>
                    {uploading ? 'Uploading...' : 'Upload to Cloud'}
                  </button>
                )}

                {imageFile && (
                  <span style={{ fontSize: 12, color: '#888' }}>
                    {imageFile.name}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button onClick={createProduct}
              style={{ padding: '12px 32px', background: '#e94560',
                color: '#fff', border: 'none', borderRadius: 6,
                cursor: 'pointer', fontSize: 15, fontWeight: 600 }}>
              Add Product
            </button>
          </div>

          {/* Products Table */}
          <h3 style={{ color: '#1a1a2e', marginBottom: 14 }}>All Products</h3>
          {products.length === 0 ? (
            <p style={{ color: '#888' }}>No products yet. Add your first product above!</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    {['Image', 'Name', 'Price', 'Category', 'Stock', ''].map((h) => (
                      <th key={h} style={{ padding: '12px 10px',
                        textAlign: 'left', fontSize: 13, color: '#555' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>
                        <img
                          src={p.image || 'https://via.placeholder.com/60'}
                          alt={p.name}
                          style={{ width: 60, height: 60,
                            objectFit: 'cover', borderRadius: 6 }}
                        />
                      </td>
                      <td style={{ padding: '10px', fontWeight: 500 }}>{p.name}</td>
                      <td style={{ padding: '10px' }}>${p.price}</td>
                      <td style={{ padding: '10px' }}>{p.category}</td>
                      <td style={{ padding: '10px' }}>{p.stock}</td>
                      <td style={{ padding: '10px' }}>
                        <button onClick={() => deleteProduct(p._id)}
                          style={{ background: '#e94560', color: '#fff',
                            border: 'none', borderRadius: 4,
                            padding: '6px 12px', cursor: 'pointer' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── ORDERS TAB ── */}
      {tab === 'orders' && (
        <>
          <h3 style={{ color: '#1a1a2e', marginBottom: 14 }}>All Orders</h3>
          {orders.length === 0 ? (
            <p style={{ color: '#888' }}>No orders yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    {['Order ID', 'User', 'Total', 'Paid', 'Delivered', ''].map((h) => (
                      <th key={h} style={{ padding: '12px 10px',
                        textAlign: 'left', fontSize: 13, color: '#555' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px', fontSize: 12, color: '#888' }}>
                        ...{o._id.slice(-8)}
                      </td>
                      <td style={{ padding: '10px' }}>{o.user?.name || '—'}</td>
                      <td style={{ padding: '10px', fontWeight: 600 }}>
                        ${o.totalPrice.toFixed(2)}
                      </td>
                      <td style={{ padding: '10px' }}>{o.isPaid ? '✅' : '❌'}</td>
                      <td style={{ padding: '10px' }}>{o.isDelivered ? '✅' : '❌'}</td>
                      <td style={{ padding: '10px' }}>
                        {!o.isDelivered && (
                          <button onClick={() => markDelivered(o._id)}
                            style={{ background: '#1a1a2e', color: '#fff',
                              border: 'none', borderRadius: 4,
                              padding: '6px 12px', cursor: 'pointer' }}>
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;