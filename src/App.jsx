import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', quantity: '', price: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/inventory');
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
      await axios.put('/api/inventory/' + editingId, {
        name: form.name,
        quantity: Number(form.quantity),
        price: Number(form.price),
        description: form.description,
      });
        setEditingId(null);
      } else {
        await axios.post('/api/inventory', {
          name: form.name,
          quantity: Number(form.quantity),
          price: Number(form.price),
          description: form.description,
        });
      }
      setForm({ name: '', quantity: '', price: '', description: '' });
      fetchItems();
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      description: item.description,
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/inventory/' + id);
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Inventory Management System</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ marginRight: 10 }}
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          style={{ marginRight: 10, width: 80 }}
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          style={{ marginRight: 10, width: 100 }}
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={{ marginRight: 10 }}
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ name: '', quantity: '', price: '', description: '' });
              setEditingId(null);
            }}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        )}
      </form>
      {/* <table border="1" cellPadding="8" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No items found.
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.description}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>{' '}
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
}

export default App;
