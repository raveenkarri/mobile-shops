import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ProductForm from "../components/ProductForm";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import PageTransition from "../components/ui/PageTransition";
import Skeleton from "../components/ui/Skeleton";
import apiClient from "../lib/apiClient";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/products/shop/my");
      setProducts(data.products || []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await apiClient.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Unable to delete product");
    }
  };

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Product Catalog</h2>
          <p className="mt-1 text-sm text-slate-600">Manage pricing, inventory and media from one place.</p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          <Plus size={16} />
          New Product
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-72" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Start adding products to appear in your storefront."
          action={
            <Button
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
            >
              Add your first product
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <motion.article
              key={product._id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -4 }}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-48 bg-slate-100">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-slate-500">No preview image</div>
                )}
              </div>
              <div className="space-y-2 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                    {product.category}
                  </span>
                </div>
                <p className="text-3xl font-bold text-cyan-700">${Number(product.price).toFixed(2)}</p>
                <p className="text-sm text-slate-500">Stock: {product.stock}</p>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="subtle"
                    className="flex-1"
                    onClick={() => {
                      setEditingProduct(product);
                      setShowForm(true);
                    }}
                  >
                    <Pencil size={14} /> Edit
                  </Button>
                  <Button variant="danger" className="flex-1" onClick={() => handleDelete(product._id)}>
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {showForm ? (
        <ProductForm
          product={editingProduct}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchProducts();
          }}
        />
      ) : null}
    </PageTransition>
  );
}