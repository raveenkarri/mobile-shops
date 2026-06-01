import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { useAuthStore } from "./store/authStore";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShopDetails from "./pages/ShopDetails";
import Cart from "./pages/Cart";
import UserChat from "./pages/UserChat";

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 text-white">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" replace />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop/:id" element={<ShopDetails />} />
          <Route
            path="cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="chat/:chatId"
            element={
              <PrivateRoute>
                <UserChat />
              </PrivateRoute>
            }
          />
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