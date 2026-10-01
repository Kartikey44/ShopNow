import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAuthError,
  registerUser,
  selectAuthError,
  selectAuthStatus,
} from "../features/auth/authSlice";

const roles = [
  {
    value: "user",
    label: "Customer",
    description: "Shop clothing and track orders",
    icon: UserRound,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage the ShopNow store",
    icon: ShieldCheck,
  },
  {
    value: "delivery_partner",
    label: "Delivery partner",
    description: "Coming soon",
    icon: Truck,
    disabled: true,
  },
];

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authError = useSelector(selectAuthError);
  const authStatus = useSelector(selectAuthStatus);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminInviteCode: "",
    acceptedTerms: false,
  });
  const [error, setError] = useState("");
  const isSubmitting = authStatus === "loading";

  const updateField = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    dispatch(clearAuthError());

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.acceptedTerms) {
      setError("Please accept the Terms & Conditions and Privacy Policy.");
      return;
    }

    if (role === "admin" && !form.adminInviteCode.trim()) {
      setError("An admin invitation code is required.");
      return;
    }

    try {
      const registeredUser = await dispatch(registerUser({
        fullname: form.fullname,
        email: form.email,
        password: form.password,
        role,
        ...(role === "admin" && {
          adminInviteCode: form.adminInviteCode,
        }),
      })).unwrap();

      navigate(registeredUser.role === "admin" ? "/admin" : "/");
    } catch (requestError) {
      setError(requestError || "We could not create your account. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#06110d] px-4 py-10 text-white">
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-900/30 blur-3xl" />
      <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-green-800/20 blur-3xl" />

      <div className="relative w-full max-w-lg">
        <div className="rounded-2xl border border-emerald-900/60 bg-[#0b1914]/90 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
              <span className="text-xl font-bold text-emerald-400">S</span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Choose how you will use ShopNow
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-gray-300">
                I am signing up as
              </legend>

              <div className="grid gap-3 sm:grid-cols-3">
                {roles.map(({ value, label, description, icon: Icon, disabled }) => (
                  <label
                    key={value}
                    className={`relative rounded-lg border p-3 transition ${
                      disabled
                        ? "cursor-not-allowed border-emerald-950/70 bg-[#07130f]/50 text-gray-600"
                        : role === value
                          ? "cursor-pointer border-emerald-500 bg-emerald-500/10"
                          : "cursor-pointer border-emerald-900/70 bg-[#07130f] hover:border-emerald-700"
                    }`}
                  >
                    <input
                      checked={role === value}
                      className="sr-only"
                      disabled={disabled}
                      name="role"
                      onChange={() => setRole(value)}
                      type="radio"
                      value={value}
                    />
                    <Icon className="mb-2 h-5 w-5 text-emerald-400" />
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="mt-1 block text-xs leading-4 text-gray-400">
                      {description}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="fullname">
                Full Name
              </label>
              <input
                autoComplete="name"
                className="h-12 w-full rounded-lg border border-emerald-900/70 bg-[#07130f] px-4 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                id="fullname"
                name="fullname"
                onChange={updateField}
                placeholder="Enter your full name"
                required
                type="text"
                value={form.fullname}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="email">
                Email Address
              </label>
              <input
                autoComplete="email"
                className="h-12 w-full rounded-lg border border-emerald-900/70 bg-[#07130f] px-4 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                id="email"
                name="email"
                onChange={updateField}
                placeholder="you@example.com"
                required
                type="email"
                value={form.email}
              />
            </div>

            {role === "admin" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="adminInviteCode">
                  Admin invitation code
                </label>
                <input
                  autoComplete="off"
                  className="h-12 w-full rounded-lg border border-emerald-900/70 bg-[#07130f] px-4 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  id="adminInviteCode"
                  name="adminInviteCode"
                  onChange={updateField}
                  placeholder="Enter the code provided to you"
                  required
                  type="password"
                  value={form.adminInviteCode}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Admin accounts require an invitation from ShopNow.
                </p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  autoComplete="new-password"
                  className="h-12 w-full rounded-lg border border-emerald-900/70 bg-[#07130f] px-4 pr-12 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  id="password"
                  name="password"
                  onChange={updateField}
                  placeholder="Create a password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 transition hover:text-emerald-400"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  autoComplete="new-password"
                  className="h-12 w-full rounded-lg border border-emerald-900/70 bg-[#07130f] px-4 pr-12 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={updateField}
                  placeholder="Confirm your password"
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                />
                <button
                  aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 transition hover:text-emerald-400"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  type="button"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                checked={form.acceptedTerms}
                className="mt-1 accent-emerald-500"
                id="terms"
                name="acceptedTerms"
                onChange={updateField}
                type="checkbox"
              />
              <label className="cursor-pointer text-xs leading-relaxed text-gray-400" htmlFor="terms">
                I agree to the{" "}
                <Link className="text-emerald-400 hover:text-emerald-300" to="/terms">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link className="text-emerald-400 hover:text-emerald-300" to="/privacy">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {(error || authError) && (
              <p aria-live="polite" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error || authError}
              </p>
            )}

            <button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 font-semibold text-[#03100a] transition-all duration-200 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-emerald-900/50" />
            <span className="text-xs text-gray-600">OR</span>
            <div className="h-px flex-1 bg-emerald-900/50" />
          </div>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link className="font-medium text-emerald-400 transition hover:text-emerald-300" to="/login">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          Secure signup · Your information is protected
        </p>
      </div>
    </div>
  );
}

export default Signup;
