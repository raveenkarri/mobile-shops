import { motion } from "framer-motion";

export default function EmptyState({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center"
    >
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </motion.div>
  );
}