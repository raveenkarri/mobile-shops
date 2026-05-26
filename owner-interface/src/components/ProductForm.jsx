import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ProductForm({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || 'mobiles',
    price: product?.price || '',
    stock: product?.stock || '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const form = new FormData();
    form.append('name', formData.name);
    form.append('category', formData.category);
    form.append('price', formData.price);
    form.append('stock', formData.stock);
    images.forEach(img => form.append('images', img));
    
    try {
      if (product) {
        await axios.put(`http://localhost:5000/api/products/${product._id}`, form);
        toast.success('Product updated');
      } else {
        await axios.post('http://localhost:5000/api/products', form);
        toast.success('Product added');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{product ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="mobiles">Mobiles</option>
            <option value="earphones">Earphones</option>
            <option value="accessories">Accessories</option>
          </select>
          <input
            type="number"
            placeholder="Price"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Stock"
            required
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}