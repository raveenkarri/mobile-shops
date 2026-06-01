import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import { useAuthStore } from "./store/authStore";
import { ThemeProvider } from "./theme/ThemeProvider";

const AuthEntry = lazy(() => import("./pages/AuthEntry"));
const Home = lazy(() => import("./pages/Home"));
const ShopDetails = lazy(() => import("./pages/ShopDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const UserChat = lazy(() => import("./pages/UserChat"));

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
  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<AuthEntry />} />
          <Route path="/register" element={<AuthEntry />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop/:slug" element={<ShopDetails />} />
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
