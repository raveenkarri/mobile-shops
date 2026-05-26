import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProductForm from '../components/ProductForm';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products/shop/my');
      setProducts(data.products || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Delete failed');
    }
  };
  
  if (loading) return <div className="text-center py-10">Loading...</div>;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>
      
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => setShowForm(false)}
          onSuccess={() => { fetchProducts(); setShowForm(false); }}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden">
            {product.images?.[0] && (
              <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">${product.price}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => { setEditingProduct(product); setShowForm(true); }}
                  className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}