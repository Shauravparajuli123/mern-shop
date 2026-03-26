import { useEffect, useState } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    image: ''
  });

  // ✅ AUTH HEADER (for Render backend)
  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  useEffect(() => {
    API.get('/api/products').then(({ data }) => setProducts(data));
    API.get('/api/orders', config).then(({ data }) => setOrders(data));
  }, []);

  // ✅ SELECT IMAGE + PREVIEW
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ✅ UPLOAD IMAGE (DEPLOYMENT READY)
  const handleImageUpload = async () => {
    if (!imageFile) return alert('Select image first');

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      setUploading(true);

      const { data } = await API.post('/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setForm((prev) => ({ ...prev, image: data.url }));
      alert('Image uploaded!');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }

    setUploading(false);
  };

  // ✅ CREATE PRODUCT
  const createProduct = async () => {
    if (!form.name || !form.price || !form.category || !form.description) {
      return alert('Fill all fields');
    }

    if (!form.image) {
      return alert('Upload image first');
    }

    const { data } = await API.post('/api/products', form, config);

    setProducts([...products, data]);

    setForm({
      name: '',
      price: '',
      category: '',
      description: '',
      stock: '',
      image: ''
    });

    setImageFile(null);
    setImagePreview('');
  };

  // ✅ DELETE PRODUCT
  const deleteProduct = async (id) => {
    await API.delete(`/api/products/${id}`, config);
    setProducts(products.filter((p) => p._id !== id));
  };

  // ✅ MARK ORDER DELIVERED
  const markDelivered = async (id) => {
    const { data } = await API.put(`/api/orders/${id}/deliver`, {}, config);
    setOrders(orders.map((o) => (o._id === id ? data : o)));
  };

  const btnStyle = (active) => ({
    padding: '8px 20px',
    marginRight: 8,
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    background: active ? '#1a1a2e' : '#eee',
    color: active ? '#fff' : '#333'
  });

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2>Admin Dashboard</h2>

      {/* Tabs */}
      <div style={{ marginBottom: 24 }}>
        <button style={btnStyle(tab === 'products')} onClick={() => setTab('products')}>
          Products
        </button>
        <button style={btnStyle(tab === 'orders')} onClick={() => setTab('orders')}>
          Orders
        </button>
      </div>

      {/* ================= PRODUCTS ================= */}
      {tab === 'products' && (
        <>
          <h3>Add Product</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {['name','price','category','description','stock'].map((f) => (
              <input
                key={f}
                placeholder={f}
                value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              />
            ))}

            {/* FILE INPUT */}
            <input type="file" onChange={handleImageSelect} />

            {/* PREVIEW */}
            {imagePreview && (
              <img src={imagePreview} alt="preview" width="70" />
            )}
          </div>

          {/* UPLOAD BUTTON */}
          {imageFile && !form.image && (
            <button onClick={handleImageUpload}
              style={{ marginBottom: 10 }}>
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          )}

          {/* STATUS */}
          {form.image && <p style={{ color: 'green' }}>✅ Uploaded</p>}

          <button
            onClick={createProduct}
            style={{
              padding: '10px 24px',
              background: '#e94560',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              marginBottom: 28
            }}
          >
            Add Product
          </button>

          <h3>All Products</h3>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                {['Image','Name','Price','Category','Stock',''].map((h) => (
                  <th key={h} style={{ padding: '10px 8px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td>
                    {p.image && <img src={p.image} alt="" width="50" />}
                  </td>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{p.category}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button onClick={() => deleteProduct(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ================= ORDERS ================= */}
      {tab === 'orders' && (
        <>
          <h3>All Orders</h3>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                {['Order ID','User','Total','Paid','Delivered',''].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o._id.slice(-8)}</td>
                  <td>{o.user?.name || '—'}</td>
                  <td>${o.totalPrice}</td>
                  <td>{o.isPaid ? '✅' : '❌'}</td>
                  <td>{o.isDelivered ? '✅' : '❌'}</td>
                  <td>
                    {!o.isDelivered && (
                      <button onClick={() => markDelivered(o._id)}>
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