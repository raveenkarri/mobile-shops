import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { useAuthStore } from "./store/authStore";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ShopSetup from "./pages/ShopSetup";
import UsersChat from "./pages/UsersChat";
import Chat from "./pages/Chat";
import Banners from "./pages/Banners";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" replace />;
}

function OwnerRoute({ children }) {
  const { user } = useAuthStore();
  return user?.role === "OWNER" ? children : <Navigate to="/" replace />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <OwnerRoute>
                <Layout />
              </OwnerRoute>
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="shop-setup" element={<ShopSetup />} />
          <Route path="products" element={<Products />} />
          <Route path="banners" element={<Banners />} />
          <Route path="chats" element={<UsersChat />} />
          <Route path="chat/:chatId" element={<Chat />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f172a",
            color: "#e2e8f0",
            border: "1px solid #1e293b",
          },
        }}
      />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;