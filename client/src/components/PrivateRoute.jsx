import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }
  if (currentUser.isAdmin) {
    return <Navigate to="/admin" />;
  }
  return <Outlet />;
}