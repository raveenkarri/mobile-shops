import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import PageTransition from "../components/ui/PageTransition";
import Skeleton from "../components/ui/Skeleton";
import apiClient from "../lib/apiClient";

const initialForm = {
  title: "",
  description: "",
  type: "discount",
  discountType: "percentage",
  discountValue: 10,
  freeProduct: "",
  minPurchaseAmount: 0,
  category: "",
  applicableProducts: [],
  startDate: "",
  endDate: "",
  link: "",
  isActive: true,
};

export default function Banners() {
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bannerRes, productRes] = await Promise.all([
        apiClient.get("/banners/my"),
        apiClient.get("/products/shop/my?limit=200"),
      ]);
      setBanners(bannerRes.data);
      setProducts(productRes.data.products || []);
    } catch {
      toast.error("Failed to load banner data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const badgePreview = useMemo(() => {
    if (form.type === "bogo") return "Buy 1 Get 1";
    if (form.type === "combo_offer" && form.freeProduct.trim()) return `Free ${form.freeProduct.trim()}`;
    if (form.discountType === "fixed") return `Save ₹${form.discountValue || 0}`;
    return `${form.discountValue || 0}% OFF`;
  }, [form]);

  const buildPayload = () => {
    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append("type", form.type);
    payload.append("discountType", form.type === "bogo" ? "" : form.discountType);
    payload.append("discountValue", String(form.type === "bogo" ? 0 : Number(form.discountValue || 0)));
    payload.append("freeProduct", form.freeProduct.trim());
    payload.append("startDate", form.startDate);
    payload.append("endDate", form.endDate);
    payload.append("link", form.link.trim());
    payload.append("isActive", String(form.isActive));
    payload.append(
      "conditions",
      JSON.stringify({
        minPurchaseAmount: Number(form.minPurchaseAmount || 0),
        applicableProducts: form.applicableProducts,
        category: form.category || "",
      }),
    );
    if (image) payload.append("image", image);
    return payload;
  };

  const createBanner = async (event) => {
    event.preventDefault();
    if (!image) {
      toast.error("Banner image is required");
      return;
    }
    setSaving(true);
    try {
      await apiClient.post("/banners", buildPayload());
      toast.success("Offer banner created");
      setForm(initialForm);
      setImage(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create banner");
    } finally {
      setSaving(false);
    }
  };

  const toggleProduct = (productId) => {
    setForm((prev) => {
      const selected = prev.applicableProducts.includes(productId);
      return {
        ...prev,
        applicableProducts: selected
          ? prev.applicableProducts.filter((id) => id !== productId)
          : [...prev.applicableProducts, productId],
      };
    });
  };

  const toggleBanner = async (banner) => {
    try {
      await apiClient.put(`/banners/${banner._id}`, {
        title: banner.title,
        description: banner.description || "",
        type: banner.type,
        discountType: banner.discountType || "",
        discountValue: Number(banner.discountValue || 0),
        freeProduct: banner.freeProduct || "",
        startDate: banner.startDate,
        endDate: banner.endDate,
        link: banner.link || "",
        isActive: !banner.isActive,
        conditions: banner.conditions || {},
      });
      fetchData();
    } catch {
      toast.error("Unable to update banner status");
    }
  };

  const removeBanner = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await apiClient.delete(`/banners/${id}`);
      toast.success("Banner deleted");
      fetchData();
    } catch {
      toast.error("Unable to delete banner");
    }
  };

  return (
    <PageTransition className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.25fr,1fr]">
        <form onSubmit={createBanner} className="surface p-6">
          <h2 className="text-2xl font-bold text-primary">Create Offer Banner</h2>
          <p className="mt-1 text-sm text-muted">Configure discount, BOGO, combo, and conditional campaigns.</p>

          <div className="mt-5 grid gap-4">
            <input
              type="text"
              required
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Campaign title"
              className="input"
            />
            <textarea
              rows="2"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Description"
              className="input"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))} className="input">
                <option value="discount">Discount</option>
                <option value="bogo">BOGO</option>
                <option value="combo_offer">Combo Offer</option>
              </select>
              <select
                value={form.discountType}
                onChange={(event) => setForm((prev) => ({ ...prev, discountType: event.target.value }))}
                className="input"
                disabled={form.type === "bogo"}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="number"
                min="0"
                value={form.discountValue}
                onChange={(event) => setForm((prev) => ({ ...prev, discountValue: Number(event.target.value) }))}
                className="input"
                placeholder="Discount value"
                disabled={form.type === "bogo"}
              />
              <input
                type="text"
                value={form.freeProduct}
                onChange={(event) => setForm((prev) => ({ ...prev, freeProduct: event.target.value }))}
                className="input"
                placeholder="Free product (optional)"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="number"
                min="0"
                value={form.minPurchaseAmount}
                onChange={(event) => setForm((prev) => ({ ...prev, minPurchaseAmount: Number(event.target.value) }))}
                className="input"
                placeholder="Minimum purchase amount"
              />
              <select value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} className="input">
                <option value="">All categories</option>
                <option value="mobiles">Mobiles</option>
                <option value="earphones">Earphones</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div className="rounded-2xl border border-app p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Applicable products</p>
              <div className="mt-3 grid max-h-40 gap-2 overflow-y-auto sm:grid-cols-2">
                {products.map((product) => (
                  <label key={product._id} className="flex items-center gap-2 rounded-xl border border-app px-3 py-2 text-sm text-primary">
                    <input
                      type="checkbox"
                      checked={form.applicableProducts.includes(product._id)}
                      onChange={() => toggleProduct(product._id)}
                    />
                    <span className="truncate">{product.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="datetime-local"
                required
                value={form.startDate}
                onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
                className="input"
              />
              <input
                type="datetime-local"
                required
                value={form.endDate}
                onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
                className="input"
              />
            </div>

            <input
              type="url"
              value={form.link}
              onChange={(event) => setForm((prev) => ({ ...prev, link: event.target.value }))}
              placeholder="Optional CTA link"
              className="input"
            />

            <input
              type="file"
              accept="image/*"
              required
              onChange={(event) => setImage(event.target.files?.[0] || null)}
              className="input"
            />

            <label className="flex items-center gap-2 rounded-xl border border-app px-4 py-3 text-sm text-primary">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
              />
              Activate immediately
            </label>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Saving..." : "Create Campaign"}
            </Button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="surface p-6">
            <h3 className="text-lg font-semibold text-primary">Preview</h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-app bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 p-4">
              <p className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">{badgePreview}</p>
              <h4 className="mt-3 text-xl font-bold text-primary">{form.title || "Campaign title"}</h4>
              <p className="mt-1 text-sm text-muted">{form.description || "Offer description appears here."}</p>
              {form.minPurchaseAmount > 0 ? (
                <p className="mt-2 text-xs font-medium text-muted">Min purchase: ₹{form.minPurchaseAmount}</p>
              ) : null}
            </div>
          </div>

          <div className="surface p-6">
            <h3 className="text-xl font-bold text-primary">Live Campaigns</h3>
            <p className="mt-1 text-sm text-muted">Toggle and manage active offers.</p>

            <div className="mt-4 space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-28" />)
              ) : banners.length === 0 ? (
                <EmptyState title="No banners yet" description="Create your first promotional campaign." />
              ) : (
                banners.map((banner, index) => (
                  <motion.div
                    key={banner._id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="flex flex-col gap-3 rounded-2xl border border-app bg-base p-3"
                  >
                    <img src={banner.image} alt={banner.title} className="h-24 w-full rounded-xl object-cover" />
                    <div>
                      <p className="font-semibold text-primary">{banner.title}</p>
                      <p className="text-xs text-muted">{banner.type.replace("_", " ")}</p>
                      <p className="mt-1 text-xs text-muted">
                        {new Date(banner.startDate).toLocaleDateString()} - {new Date(banner.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="subtle" onClick={() => toggleBanner(banner)}>
                        {banner.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                        {banner.isActive ? "Disable" : "Enable"}
                      </Button>
                      <Button variant="danger" onClick={() => removeBanner(banner._id)}>
                        <Trash2 size={14} /> Delete
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
