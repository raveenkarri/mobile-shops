import { useLocation } from "react-router-dom";
import AuthModal from "../components/auth/AuthModal";

export default function AuthEntry() {
  const location = useLocation();
  const mode = location.pathname.includes("register") ? "register" : "login";
  return <AuthModal mode={mode} />;
}