import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  AtSign,
  Lock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Ban,
} from "lucide-react";
import axios from "axios";
import { API_CONFIG } from "@/config/api";
import { useUser } from "@/contexts/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("admin1@desa.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useUser();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/login`,
        {
          email,
          password,
        },
        {
          headers: API_CONFIG.headers,
        },
      );

      const data = response.data;

      if (!data.token) {
        throw new Error("Login successful, but no token received.");
      }

      setSuccess(true);

      // Simpan token & fetch user data immediately
      localStorage.setItem("authToken", data.token);

      // Fetch user data immediately after login
      try {
        await fetchUser();
        console.log("User data fetched successfully after login");
      } catch (fetchError) {
        console.error("Error fetching user data after login:", fetchError);
        // Don't block the login process if user fetch fails
      }

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Handle specific error cases
        if (err.response?.status === 403) {
          setError("Akun Anda telah di-revoke. Silakan hubungi administrator.");
        } else if (err.response?.status === 401) {
          setError("Email atau password salah.");
        } else if (err.response?.status === 429) {
          setError(
            "Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa menit.",
          );
        } else {
          setError(
            err.response?.data?.message ||
              err.response?.data?.error ||
              err.message,
          );
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#00b4d8]/10 via-white to-[#48cc6c]/10 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-[#48cc6c]/30 opacity-30 mix-blend-multiply blur-xl filter dark:bg-[#48cc6c]/20"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-[#00b4d8]/30 opacity-30 mix-blend-multiply blur-xl filter delay-1000 dark:bg-[#00b4d8]/20"></div>
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-indigo-300/20 opacity-20 mix-blend-multiply blur-xl filter delay-500 dark:bg-indigo-600/20"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to Home Button - Outside the card for better visibility */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200/60 bg-white/80 px-6 py-3 text-gray-600 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-[#00b4d8]/30 hover:bg-white/90 hover:text-[#00b4d8] hover:shadow-xl dark:border-gray-600/50 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:border-[#00b4d8]/50 dark:hover:bg-gray-800/90 dark:hover:text-[#00b4d8]"
          >
            <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <div className="text-center">
              <div className="text-sm font-medium">
                Kembali ke Halaman Utama
              </div>
              {/* <div className="text-xs opacity-75">
                Ini adalah halaman khusus admin
              </div> */}
            </div>
          </button>
        </div>

        {/* Main Card */}
        <div className="transform rounded-2xl border border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] dark:border-gray-700/50 dark:bg-gray-800/90">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#00b4d8] to-[#48cc6c] shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-[#00b4d8] to-[#48cc6c] bg-clip-text text-3xl font-bold text-transparent">
              Admin Login
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Masuk ke Panel Administrasi
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              <Lock className="h-3 w-3" />
              Akses Terbatas - Hanya untuk Admin Desa
            </div>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="animate-in slide-in-from-top-2 mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 duration-300 dark:border-red-800 dark:bg-red-900/20">
              {error.includes("di-revoke") ? (
                <Ban className="h-5 w-5 flex-shrink-0 text-red-500" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {error.includes("di-revoke")
                    ? "Akun Di-revoke!"
                    : "Login Error!"}
                </p>
                <p className="text-sm text-red-600 dark:text-red-300">
                  {error}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 transition-colors hover:text-red-600"
              >
                ×
              </button>
            </div>
          )}

          {success && (
            <div className="animate-in slide-in-from-top-2 mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 duration-300 dark:border-green-800 dark:bg-green-900/20">
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#48cc6c]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#48cc6c] dark:text-[#48cc6c]">
                  Success!
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Mengarahkan ke dashboard admin...
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Admin
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                  <AtSign className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || success}
                  className="focus:ring-opacity-50 w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8] disabled:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:disabled:bg-gray-700"
                  placeholder="Masukkan email admin"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password Admin
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || success}
                  className="focus:ring-opacity-50 w-full rounded-lg border border-gray-300 bg-white py-3 pr-12 pl-10 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8] disabled:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:disabled:bg-gray-700"
                  placeholder="Masukkan password admin"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || success}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 transition-colors hover:text-[#00b4d8] focus:text-[#00b4d8] focus:outline-none disabled:opacity-50 dark:text-gray-400 dark:hover:text-[#00b4d8]"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="flex w-full transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#00b4d8] to-[#48cc6c] px-4 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-[#00a3c4] hover:to-[#3db85d] hover:shadow-xl active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  Masuk ke Admin Panel...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Berhasil!
                </>
              ) : (
                <>
                  Masuk ke Admin Panel
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Dilindungi dengan keamanan tingkat enterprise
          </p>
        </div>
      </div>
    </div>
  );
}
