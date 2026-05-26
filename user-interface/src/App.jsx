import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ShopDetails from './pages/ShopDetails';
import Cart from './pages/Cart';
import UserChat from './pages/UserChat';

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop/:id" element={<ShopDetails />} />
          <Route path="cart" element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          } />
          <Route path="chat/:chatId" element={
            <PrivateRoute>
              <UserChat />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;