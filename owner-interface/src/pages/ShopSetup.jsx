import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import PageTransition from "../components/ui/PageTransition";
import Skeleton from "../components/ui/Skeleton";
import apiClient from "../lib/apiClient";

export default function ShopSetup() {
  const [shop, setShop] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    const fetchMyShop = async () => {
      try {
        const { data } = await apiClient.get("/shops/my-shop");
        setShop(data);
        setFormData({
          shopName: data.shopName,
          location: data.location,
          description: data.description || "",
        });
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error("Failed to load shop settings");
        }
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
    <PageTransition className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-bold text-slate-900">{shop ? "Edit your shop" : "Create your shop"}</h2>
        <p className="mt-1 text-sm text-slate-600">Use precise location and description details to improve local discovery.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Shop Name</label>
            <input
              type="text"
              required
              value={formData.shopName}
              onChange={(event) => setFormData((prev) => ({ ...prev, shopName: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
              placeholder="Galaxy Mobile Hub"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Location / Area</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
              placeholder="Downtown, Mumbai"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              rows="5"
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
              placeholder="What makes your shop unique?"
            />
          </div>

          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving ? "Saving..." : shop ? "Update Shop" : "Create Shop"}
          </Button>
        </form>
      </div>
    </PageTransition>
  );
}