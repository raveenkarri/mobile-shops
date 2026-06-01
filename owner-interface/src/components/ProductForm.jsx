import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../lib/apiClient";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import ImageUploader from "./ui/ImageUploader";

export default function ProductForm({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "mobiles",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => (product ? "Edit product" : "Create product"), [product]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("category", formData.category);
    payload.append("description", formData.description.trim());
    payload.append("price", formData.price);
    payload.append("stock", formData.stock);
    images.forEach((image) => payload.append("images", image));

    try {
      if (product) {
        await apiClient.put(`/products/${product._id}`, payload);
        toast.success("Product updated");
      } else {
        await apiClient.post("/products", payload);
        toast.success("Product created");
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} width="max-w-3xl">
      <h2 className="text-2xl font-bold text-primary">{title}</h2>
      <p className="mt-1 text-sm text-muted">Upload crisp images and keep metadata clean for search relevance.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          required
          placeholder="Product name"
          value={formData.name}
          onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
          className="input"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <select
            value={formData.category}
            onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
            className="input capitalize"
          >
            <option value="mobiles">Mobiles</option>
            <option value="earphones">Earphones</option>
            <option value="accessories">Accessories</option>
          </select>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="Price"
            value={formData.price}
            onChange={(event) => setFormData((prev) => ({ ...prev, price: event.target.value }))}
            className="input"
          />
        </div>

        <textarea
          rows="3"
          placeholder="Description"
          value={formData.description}
          onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
          className="input"
        />

        <input
          type="number"
          min="0"
          required
          placeholder="Stock"
          value={formData.stock}
          onChange={(event) => setFormData((prev) => ({ ...prev, stock: event.target.value }))}
          className="input"
        />

        <ImageUploader files={images} setFiles={setImages} maxFiles={5} />

        <div className="flex flex-col-reverse justify-end gap-3 pt-1 sm:flex-row">
          <Button variant="subtle" onClick={onClose} type="button" className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
