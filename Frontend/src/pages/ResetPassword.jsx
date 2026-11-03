import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axios";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetPassword = async (event) => {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.put(`/auth/reset-password/${encodeURIComponent(token)}`, {
        password,
        confirmPassword,
      });
      navigate("/login", { replace: true, state: { message: "Password reset. Sign in with your new password." } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to reset your password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06110d] px-4 text-white">
      <section className="w-full max-w-md rounded-2xl border border-emerald-900/60 bg-[#0b1914] p-8 sm:p-10">
        <h1 className="text-3xl font-semibold">Choose a new password</h1>
        <p className="mt-2 text-sm text-gray-400">Use at least eight characters with upper- and lowercase letters, a number, and a symbol.</p>
        <form className="mt-6 space-y-4" onSubmit={resetPassword}>
          <label className="block text-sm text-gray-300">
            New password
            <input autoComplete="new-password" className="mt-2 h-12 w-full rounded-lg border border-emerald-900/70 bg-[#07130f] px-4 text-white outline-none focus:border-emerald-500" minLength={8} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
          </label>
          <label className="block text-sm text-gray-300">
            Confirm password
            <input autoComplete="new-password" className="mt-2 h-12 w-full rounded-lg border border-emerald-900/70 bg-[#07130f] px-4 text-white outline-none focus:border-emerald-500" minLength={8} onChange={(event) => setConfirmPassword(event.target.value)} required type="password" value={confirmPassword} />
          </label>
          {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200" role="alert">{error}</p>}
          <button className="h-12 w-full rounded-lg bg-emerald-500 font-semibold text-[#03100a] disabled:opacity-50" disabled={submitting} type="submit">{submitting ? "Updating…" : "Reset password"}</button>
        </form>
        <Link className="mt-6 inline-block text-sm text-emerald-400 hover:text-emerald-300" to="/login">Back to sign in</Link>
      </section>
    </main>
  );
}

export default ResetPassword;
