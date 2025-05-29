import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { getUser } from "../pages/actions/userSlice";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(getUser());
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
}
