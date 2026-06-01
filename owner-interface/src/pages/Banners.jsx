import { useEffect, useState } from "react";
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
  link: "",
  isActive: true,
};

export default function Banners() {
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banners, setBanners] = useState([]);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/banners/my");
      setBanners(data);
    } catch {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const createBanner = async (event) => {
    event.preventDefault();
    if (!image) {
      toast.error("Please choose an image");
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("link", form.link.trim());
    payload.append("isActive", form.isActive);
    payload.append("image", image);

    setSaving(true);
    try {
      await apiClient.post("/banners", payload);
      toast.success("Banner added");
      setForm(initialForm);
      setImage(null);
      fetchBanners();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create banner");
    } finally {
      setSaving(false);
    }
  };

  const toggleBanner = async (banner) => {
    try {
      const payload = {
        title: banner.title,
        link: banner.link || "",
        isActive: !banner.isActive,
      };
      await apiClient.put(`/banners/${banner._id}`, payload);
      fetchBanners();
    } catch {
      toast.error("Unable to update banner status");
    }
  };

  const removeBanner = async (id) => {
    if (!window.confirm("Delete this banner?")) return;

    try {
      await apiClient.delete(`/banners/${id}`);
      toast.success("Banner deleted");
      fetchBanners();
    } catch {
      toast.error("Unable to delete banner");
    }
  };

  return (
    <PageTransition className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr,1.4fr]">
        <form onSubmit={createBanner} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Create Banner</h2>
          <p className="mt-1 text-sm text-slate-600">Promote seasonal offers and key announcements.</p>

          <div className="mt-5 space-y-4">
            <input
              type="text"
              required
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Campaign title (e.g., 50% Discount)"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
            />

            <input
              type="url"
              value={form.link}
              onChange={(event) => setForm((prev) => ({ ...prev, link: event.target.value }))}
              placeholder="Optional link"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
            />

            <input
              type="file"
              accept="image/*"
              required
              onChange={(event) => setImage(event.target.files?.[0] || null)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold"
            />

            <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-cyan-600"
              />
              Enable this banner immediately
            </label>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Saving..." : "Add Banner"}
            </Button>
          </div>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900">Your Banners</h3>
          <p className="mt-1 text-sm text-slate-600">Activate, pause, or remove campaigns anytime.</p>

          <div className="mt-5 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-28" />)
            ) : banners.length === 0 ? (
              <EmptyState title="No banners yet" description="Add your first campaign to start featuring offers." />
            ) : (
              banners.map((banner, index) => (
                <motion.div
                  key={banner._id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center"
                >
                  <img src={banner.image} alt={banner.title} className="h-20 w-full rounded-xl object-cover sm:w-40" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{banner.title}</p>
                    <p className="truncate text-xs text-slate-500">{banner.link || "No link"}</p>
                    <p className="mt-1 text-xs font-medium text-slate-600">
                      Status: {banner.isActive ? "Active" : "Inactive"}
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
    </PageTransition>
  );
}