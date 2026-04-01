import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab]           = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders]     = useState([]);

  // Form state
  const [form, setForm] = useState({
    name: '', price: '', category: '',
    description: '', stock: '', image: ''
  });

  // Image upload state
  const [imageFile, setImageFile]         = useState(null);
  const [imagePreview, setImagePreview]   = useState('');
  const [uploading, setUploading]         = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => {
    axios.get('/api/products')
      .then(({ data }) => setProducts(data));
    axios.get('/api/orders', { headers })
      .then(({ data }) => setOrders(data));
  }, []);

  // Step 1 — User picks a file → show preview instantly
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadSuccess(false);
    setForm((prev) => ({ ...prev, image: '' }));
  };

  // Step 2 — Upload to Cloudinary via backend
  const handleImageUpload = async () => {
    if (!imageFile) return;
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
      setUploadSuccess(true);
    } catch (err) {
      alert('Image upload failed. Make sure Cloudinary is configured in your .env file.');
    }
    setUploading(false);
  };

  // Create product
  const createProduct = async () => {
    if (!form.name || !form.price || !form.category || !form.description) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!form.image) {
      alert('Please upload a product image first.');
      return;
    }
    try {
      const { data } = await axios.post('/api/products', form, { headers });
      setProducts([...products, data]);
      // Reset form
      setForm({ name: '', price: '', category: '', description: '', stock: '', image: '' });
      setImageFile(null);
      setImagePreview('');
      setUploadSuccess(false);
      alert('✅ Product created successfully!');
    } catch {
      alert('Failed to create product.');
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await axios.delete(`/api/products/${id}`, { headers });
    setProducts(products.filter((p) => p._id !== id));
  };

  // Mark order delivered
  const markDelivered = async (id) => {
    const { data } = await axios.put(`/api/orders/${id}/deliver`, {}, { headers });
    setOrders(orders.map((o) => o._id === id ? data : o));
  };

  // Styles
  const tabBtn = (active) => ({
    padding: '10px 28px', border: 'none', cursor: 'pointer',
    fontWeight: 700, fontSize: 14, borderRadius: 10,
    transition: 'all 0.2s',
    background: active
      ? 'linear-gradient(135deg, #e94560, #f5a623)'
      : '#f0f0f5',
    color: active ? '#fff' : '#555',
    boxShadow: active ? '0 4px 16px rgba(233,69,96,0.35)' : 'none',
  });

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid #e0e0e0', fontSize: 14,
    outline: 'none', boxSizing: 'border-box',
    background: '#fafafa', transition: 'border 0.2s',
  };

  const labelStyle = {
    fontSize: 12, fontWeight: 700, color: '#555',
    display: 'block', marginBottom: 5, textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f0c29, #302b63)',
          borderRadius: 20, padding: '28px 32px', marginBottom: 32,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: 26, fontWeight: 900 }}>
              Admin Dashboard
            </h2>
            <p style={{ color: '#aaa', margin: '4px 0 0', fontSize: 14 }}>
              Manage your store
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#f5a623', margin: 0, fontWeight: 700 }}>
              {products.length} Products
            </p>
            <p style={{ color: '#aaa', margin: '4px 0 0', fontSize: 13 }}>
              {orders.length} Orders
            </p>
          </div>
        </div>

        {/* Tab buttons */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
          <button style={tabBtn(tab === 'products')}
            onClick={() => setTab('products')}>
            📦 Products
          </button>
          <button style={tabBtn(tab === 'orders')}
            onClick={() => setTab('orders')}>
            🧾 Orders
          </button>
        </div>

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && (
          <>
            {/* Add Product Form */}
            <div style={{
              background: '#fff', borderRadius: 20, padding: 32,
              marginBottom: 32,
              boxShadow: '0 4px 24px rgba(48,43,99,0.08)',
              border: '1.5px solid rgba(48,43,99,0.08)',
            }}>
              <h3 style={{ margin: '0 0 24px', color: '#1a1a2e',
                fontSize: 20, fontWeight: 800 }}>
                ➕ Add New Product
              </h3>

              {/* Form fields */}
              <div style={{ display: 'grid',
                gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Product Name *</label>
                  <input style={inputStyle} placeholder="e.g. Nike Air Max"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={(e) => e.target.style.border = '1.5px solid #302b63'}
                    onBlur={(e) => e.target.style.border = '1.5px solid #e0e0e0'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Price ($) *</label>
                  <input style={inputStyle} placeholder="e.g. 99.99"
                    type="number" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    onFocus={(e) => e.target.style.border = '1.5px solid #302b63'}
                    onBlur={(e) => e.target.style.border = '1.5px solid #e0e0e0'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <input style={inputStyle} placeholder="e.g. Electronics"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    onFocus={(e) => e.target.style.border = '1.5px solid #302b63'}
                    onBlur={(e) => e.target.style.border = '1.5px solid #e0e0e0'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Stock</label>
                  <input style={inputStyle} placeholder="e.g. 50"
                    type="number" value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    onFocus={(e) => e.target.style.border = '1.5px solid #302b63'}
                    onBlur={(e) => e.target.style.border = '1.5px solid #e0e0e0'}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Description *</label>
                  <textarea style={{ ...inputStyle, height: 90, resize: 'vertical' }}
                    placeholder="Describe the product..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    onFocus={(e) => e.target.style.border = '1.5px solid #302b63'}
                    onBlur={(e) => e.target.style.border = '1.5px solid #e0e0e0'}
                  />
                </div>
              </div>

              {/* ── IMAGE UPLOAD SECTION ── */}
              <div style={{
                border: '2px dashed #302b63', borderRadius: 14,
                padding: 24, marginBottom: 24,
                background: 'linear-gradient(135deg, #f8f9ff, #eef0f8)',
              }}>
                <label style={{ ...labelStyle, fontSize: 14,
                  marginBottom: 16, color: '#302b63' }}>
                  📸 Product Image *
                </label>

                <div style={{ display: 'flex', gap: 24,
                  alignItems: 'flex-start', flexWrap: 'wrap' }}>

                  {/* Image preview box */}
                  <div style={{
                    width: 140, height: 140, borderRadius: 12,
                    border: '2px solid #e0e0e0', overflow: 'hidden',
                    background: '#fff', flexShrink: 0,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview"
                        style={{ width: '100%', height: '100%',
                          objectFit: 'cover' }} />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#bbb' }}>
                        <div style={{ fontSize: 36 }}>🖼️</div>
                        <p style={{ fontSize: 11, margin: '4px 0 0' }}>
                          No image
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Upload controls */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: '#555',
                      marginBottom: 14, lineHeight: 1.6 }}>
                      <strong>Step 1:</strong> Click "Choose Image" to pick a photo
                      from your computer<br />
                      <strong>Step 2:</strong> Click "Upload to Cloud" to save it<br />
                      <strong>Step 3:</strong> Fill other fields and click "Add Product"
                    </p>

                    {/* Step 1 — File picker */}
                    <label style={{
                      display: 'inline-block', padding: '10px 20px',
                      background: 'linear-gradient(135deg, #302b63, #0f0c29)',
                      color: '#fff', borderRadius: 10, cursor: 'pointer',
                      fontWeight: 700, fontSize: 13, marginBottom: 10,
                    }}>
                      📁 Choose Image
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {/* File name display */}
                    {imageFile && (
                      <p style={{ fontSize: 12, color: '#888',
                        margin: '0 0 10px' }}>
                        Selected: <strong>{imageFile.name}</strong>
                      </p>
                    )}

                    {/* Step 2 — Upload button */}
                    {imageFile && !uploadSuccess && (
                      <div>
                        <button
                          onClick={handleImageUpload}
                          disabled={uploading}
                          style={{
                            padding: '10px 24px', border: 'none',
                            borderRadius: 10, cursor: uploading
                              ? 'not-allowed' : 'pointer',
                            fontWeight: 700, fontSize: 13,
                            background: uploading
                              ? '#ccc'
                              : 'linear-gradient(135deg, #e94560, #f5a623)',
                            color: '#fff',
                            boxShadow: uploading
                              ? 'none'
                              : '0 4px 16px rgba(233,69,96,0.4)',
                          }}>
                          {uploading ? '⏳ Uploading...' : '☁️ Upload to Cloud'}
                        </button>
                        {uploading && (
                          <p style={{ fontSize: 12, color: '#888',
                            marginTop: 8 }}>
                            Uploading to Cloudinary...
                          </p>
                        )}
                      </div>
                    )}

                    {/* Success message */}
                    {uploadSuccess && (
                      <div style={{
                        padding: '10px 16px', borderRadius: 10,
                        background: '#e8fff0',
                        border: '1px solid #00c853',
                        color: '#00c853', fontWeight: 700, fontSize: 13,
                      }}>
                        ✅ Image uploaded successfully! Ready to add product.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button onClick={createProduct} style={{
                padding: '14px 40px', border: 'none', borderRadius: 12,
                cursor: 'pointer', fontWeight: 800, fontSize: 15,
                background: 'linear-gradient(135deg, #e94560, #f5a623)',
                color: '#fff',
                boxShadow: '0 6px 20px rgba(233,69,96,0.4)',
              }}>
                ➕ Add Product
              </button>
            </div>

            {/* Products Table */}
            <div style={{
              background: '#fff', borderRadius: 20, overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(48,43,99,0.08)',
              border: '1.5px solid rgba(48,43,99,0.08)',
            }}>
              <div style={{
                padding: '20px 28px', borderBottom: '1px solid #f0f0f5',
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <h3 style={{ margin: 0, fontSize: 18,
                  fontWeight: 800, color: '#1a1a2e' }}>
                  All Products ({products.length})
                </h3>
              </div>

              {products.length === 0 ? (
                <p style={{ padding: 32, color: '#888',
                  textAlign: 'center' }}>
                  No products yet. Add your first product above!
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8f9ff' }}>
                        {['Image', 'Name', 'Price', 'Category', 'Stock', 'Action'].map((h) => (
                          <th key={h} style={{
                            padding: '14px 16px', textAlign: 'left',
                            fontSize: 12, fontWeight: 700, color: '#888',
                            textTransform: 'uppercase', letterSpacing: '0.5px',
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id}
                          style={{ borderTop: '1px solid #f0f0f5' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <img
                              src={p.image || p.thumbnail
                                || 'https://via.placeholder.com/60'}
                              alt={p.name}
                              style={{ width: 56, height: 56,
                                objectFit: 'cover', borderRadius: 8,
                                border: '1px solid #eee',
                              }}
                            />
                          </td>
                          <td style={{ padding: '12px 16px',
                            fontWeight: 600, color: '#1a1a2e',
                            fontSize: 13, maxWidth: 200 }}>
                            {p.name}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              fontWeight: 800, fontSize: 15,
                              background: 'linear-gradient(135deg, #e94560, #f5a623)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}>
                              ${p.price}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '3px 10px', borderRadius: 20,
                              background: 'linear-gradient(135deg, #302b63, #0f0c29)',
                              color: '#f5a623', fontSize: 11, fontWeight: 700,
                            }}>
                              {p.category}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px',
                            color: p.stock < 10 ? '#e94560' : '#00c853',
                            fontWeight: 700 }}>
                            {p.stock}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <button onClick={() => deleteProduct(p._id)}
                              style={{
                                padding: '6px 14px', border: 'none',
                                borderRadius: 8, cursor: 'pointer',
                                fontWeight: 700, fontSize: 12,
                                background: 'rgba(233,69,96,0.1)',
                                color: '#e94560',
                                border: '1px solid rgba(233,69,96,0.3)',
                              }}>
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div style={{
            background: '#fff', borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(48,43,99,0.08)',
            border: '1.5px solid rgba(48,43,99,0.08)',
          }}>
            <div style={{ padding: '20px 28px',
              borderBottom: '1px solid #f0f0f5' }}>
              <h3 style={{ margin: 0, fontSize: 18,
                fontWeight: 800, color: '#1a1a2e' }}>
                All Orders ({orders.length})
              </h3>
            </div>

            {orders.length === 0 ? (
              <p style={{ padding: 32, color: '#888', textAlign: 'center' }}>
                No orders yet.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9ff' }}>
                      {['Order ID', 'Customer', 'Total', 'Paid', 'Delivered', 'Action'].map((h) => (
                        <th key={h} style={{
                          padding: '14px 16px', textAlign: 'left',
                          fontSize: 12, fontWeight: 700, color: '#888',
                          textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id}
                        style={{ borderTop: '1px solid #f0f0f5' }}>
                        <td style={{ padding: '14px 16px',
                          fontFamily: 'monospace', fontSize: 12, color: '#888' }}>
                          #{o._id.slice(-8).toUpperCase()}
                        </td>
                        <td style={{ padding: '14px 16px',
                          fontWeight: 600, color: '#1a1a2e' }}>
                          {o.user?.name || '—'}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            fontWeight: 800, fontSize: 15,
                            background: 'linear-gradient(135deg, #e94560, #f5a623)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}>
                            ${o.totalPrice?.toFixed(2)}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: 20,
                            fontSize: 12, fontWeight: 700,
                            background: o.isPaid
                              ? 'rgba(0,200,83,0.1)' : 'rgba(233,69,96,0.1)',
                            color: o.isPaid ? '#00c853' : '#e94560',
                            border: `1px solid ${o.isPaid ? '#00c853' : '#e94560'}`,
                          }}>
                            {o.isPaid ? '✓ Paid' : '✗ Unpaid'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: 20,
                            fontSize: 12, fontWeight: 700,
                            background: o.isDelivered
                              ? 'rgba(0,200,83,0.1)' : 'rgba(245,166,35,0.1)',
                            color: o.isDelivered ? '#00c853' : '#f5a623',
                            border: `1px solid ${o.isDelivered ? '#00c853' : '#f5a623'}`,
                          }}>
                            {o.isDelivered ? '✓ Delivered' : '⏳ Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {!o.isDelivered && (
                            <button onClick={() => markDelivered(o._id)}
                              style={{
                                padding: '7px 14px', border: 'none',
                                borderRadius: 8, cursor: 'pointer',
                                fontWeight: 700, fontSize: 12,
                                background: 'linear-gradient(135deg, #302b63, #0f0c29)',
                                color: '#f5a623',
                              }}>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
