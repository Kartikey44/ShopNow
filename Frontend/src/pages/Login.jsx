import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAuthError,
  loginUser,
  selectAuthError,
  selectAuthStatus,
} from "../features/auth/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authError = useSelector(selectAuthError);
  const authStatus = useSelector(selectAuthStatus);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    dispatch(clearAuthError());

    try {
      const user = await dispatch(loginUser(form)).unwrap();
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (requestError) {
      setError(requestError || "We could not sign you in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#06110d] text-white flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-900/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-800/20 rounded-full blur-3xl" />

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-[#0b1914]/90 border border-emerald-900/60 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/40 backdrop-blur-xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 text-xl font-bold">
                S
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome Back
            </h1>

            <p className="text-sm text-gray-400 mt-2">
              Sign in to continue to your account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full h-12 px-4 rounded-lg bg-[#07130f] border border-emerald-900/70 text-white placeholder:text-gray-600 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="w-full h-12 px-4 pr-12 rounded-lg bg-[#07130f] border border-emerald-900/70 text-white placeholder:text-gray-600 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-400 transition"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="accent-emerald-500"
              />

              <label
                htmlFor="remember"
                className="text-sm text-gray-400 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            {(error || authError) && (
              <p
                aria-live="polite"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
              >
                {error || authError}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={authStatus === "loading"}
              className="w-full h-12 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#03100a] font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              {authStatus === "loading" ? "Signing in..." : "Sign In"}
              {authStatus !== "loading" && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="h-px flex-1 bg-emerald-900/50" />
            <span className="text-xs text-gray-600">
              OR
            </span>
            <div className="h-px flex-1 bg-emerald-900/50" />
          </div>

          {/* Register */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Secure login · Your information is protected
        </p>
      </div>
    </div>
  );
}

export default Login;
