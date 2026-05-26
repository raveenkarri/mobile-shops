import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ShopSetup from './pages/ShopSetup';
import UsersChat from './pages/UsersChat';
import Chat from './pages/Chat';

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function OwnerRoute({ children }) {
  const { user } = useAuthStore();
  return user?.role === 'OWNER' ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute>
            <OwnerRoute>
              <Layout />
            </OwnerRoute>
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="shop-setup" element={<ShopSetup />} />
          <Route path="products" element={<Products />} />
          <Route path="chats" element={<UsersChat />} />
          <Route path="chat/:chatId" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;