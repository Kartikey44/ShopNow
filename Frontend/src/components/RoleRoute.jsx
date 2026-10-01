import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectAuthStatus,
  selectCurrentUser,
} from "../features/auth/authSlice";

function RoleRoute({ allowedRoles }) {
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const authStatus = useSelector(selectAuthStatus);

  if (authStatus === "checking" || authStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#06110d] text-emerald-400">
        Loading your account...
      </div>
    );
  }

  if (!user) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate replace to={user.role === "admin" ? "/admin" : "/"} />;
  }

  return <Outlet />;
}

export default RoleRoute;
