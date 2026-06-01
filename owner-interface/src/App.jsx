import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import { useAuthStore } from "./store/authStore";
import { ThemeProvider } from "./theme/ThemeProvider";

const AuthEntry = lazy(() => import("./pages/AuthEntry"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const ShopSetup = lazy(() => import("./pages/ShopSetup"));
const UsersChat = lazy(() => import("./pages/UsersChat"));
const Chat = lazy(() => import("./pages/Chat"));
const Banners = lazy(() => import("./pages/Banners"));

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-base text-primary">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-app border-t-accent" />
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();
  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== "OWNER") return <Navigate to="/login" replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<AuthEntry />} />
          <Route path="/register" element={<AuthEntry />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
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
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AnimatedRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
