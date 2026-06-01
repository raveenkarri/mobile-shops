import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import PageTransition from "../components/ui/PageTransition";
import Skeleton from "../components/ui/Skeleton";
import apiClient from "../lib/apiClient";

const defaultForm = {
  shopName: "",
  location: "",
  description: "",
  category: "mobile_store",
  keywords: "",
};

export default function ShopSetup() {
  const [shop, setShop] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    const fetchMyShop = async () => {
      try {
        const { data } = await apiClient.get("/shops/my-shop");
        setShop(data);
        setFormData({
          shopName: data.shopName || "",
          location: data.location || "",
          description: data.description || "",
          category: data.category || "mobile_store",
          keywords: (data.keywords || []).join(", "),
        });
      } catch (error) {
        if (error.response?.status !== 404) toast.error("Failed to load shop settings");
      } finally {
        setLoadingPage(false);
      }
    };

    fetchMyShop();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (shop) {
        const { data } = await apiClient.put("/shops/my-shop", formData);
        setShop(data);
        toast.success("Shop updated");
      } else {
        const { data } = await apiClient.post("/shops", formData);
        setShop(data);
        toast.success("Shop created");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save shop");
    } finally {
      setSaving(false);
    }
  };

  if (loadingPage) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <PageTransition className="mx-auto max-w-4xl">
      <div className="surface p-6 md:p-8">
        <h2 className="text-2xl font-bold text-primary">{shop ? "Edit your shop" : "Create your shop"}</h2>
        <p className="mt-1 text-sm text-muted">Set up public details for discovery and SEO-friendly slug routes.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-primary">Shop Name</label>
              <input
                type="text"
                required
                value={formData.shopName}
                onChange={(event) => setFormData((prev) => ({ ...prev, shopName: event.target.value }))}
                className="input"
                placeholder="Galaxy Mobile Hub"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-primary">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
                className="input"
                placeholder="Downtown, Mumbai"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-primary">Category</label>
              <select
                value={formData.category}
                onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                className="input"
              >
                <option value="mobile_store">Mobile Store</option>
                <option value="repair_center">Repair Center</option>
                <option value="multi_brand">Multi Brand</option>
                <option value="accessories_specialist">Accessories Specialist</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-primary">Keywords (comma separated)</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(event) => setFormData((prev) => ({ ...prev, keywords: event.target.value }))}
                className="input"
                placeholder="iphone, samsung, accessories"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-primary">Description</label>
            <textarea
              rows="5"
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              className="input"
              placeholder="What makes your shop unique?"
            />
          </div>

          {shop?.slug ? (
            <div className="rounded-xl border border-app bg-base px-4 py-3 text-sm text-muted">
              Public URL: <span className="font-semibold text-accent">/shop/{shop.slug}</span>
            </div>
          ) : null}

          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving ? "Saving..." : shop ? "Update Shop" : "Create Shop"}
          </Button>
        </form>
      </div>
    </PageTransition>
  );
}
