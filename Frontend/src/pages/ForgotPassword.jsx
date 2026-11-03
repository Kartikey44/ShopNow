import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requestReset = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      const { data } = await axiosInstance.post("/auth/password/forgot", { email });
      setMessage(data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to send a password reset email.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06110d] px-4 text-white">
      <section className="w-full max-w-md rounded-2xl border border-emerald-900/60 bg-[#0b1914] p-8 sm:p-10">
        <h1 className="text-3xl font-semibold">Reset your password</h1>
        <p className="mt-2 text-sm text-gray-400">Enter your account email and we’ll send a reset link.</p>
        <form className="mt-6 space-y-4" onSubmit={requestReset}>
          <label className="block text-sm text-gray-300">
            Email address
            <input autoComplete="email" className="mt-2 h-12 w-full rounded-lg border border-emerald-900/70 bg-[#07130f] px-4 text-white outline-none focus:border-emerald-500" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
          </label>
          {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200" role="alert">{error}</p>}
          {message && <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200" role="status">{message}</p>}
          <button className="h-12 w-full rounded-lg bg-emerald-500 font-semibold text-[#03100a] disabled:opacity-50" disabled={submitting} type="submit">{submitting ? "Sending…" : "Send reset link"}</button>
        </form>
        <Link className="mt-6 inline-block text-sm text-emerald-400 hover:text-emerald-300" to="/login">Back to sign in</Link>
      </section>
    </main>
  );
}

export default ForgotPassword;
