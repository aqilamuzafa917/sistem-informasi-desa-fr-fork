import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_CONFIG } from "../../config/api";
import { Spinner } from "@/components/ui/spinner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Shield,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";

interface UserForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function UserCreate() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleInputChange = (field: keyof UserForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (formData.password !== formData.password_confirmation) {
      toast.error("Password dan konfirmasi password tidak cocok");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");

      await axios.post(`${API_CONFIG.baseURL}/api/register`, formData, {
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("User berhasil ditambahkan", {
        duration: 2000,
      });

      navigate("/admin/user");
    } catch (error) {
      toast.error("Gagal menambahkan user", {
        duration: 3000,
      });
      console.error("Error creating user:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" };
    if (password.length < 6)
      return { strength: 25, text: "Lemah", color: "bg-red-500" };
    if (password.length < 8)
      return { strength: 50, text: "Sedang", color: "bg-yellow-500" };
    if (password.length < 12)
      return { strength: 75, text: "Kuat", color: "bg-blue-500" };
    return { strength: 100, text: "Sangat Kuat", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch =
    formData.password_confirmation &&
    formData.password === formData.password_confirmation;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/admin/user")}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Tambah User Baru
                    </h1>
                    <p className="text-sm text-gray-500">
                      Tambahkan user baru ke dalam sistem
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              <div className="min-h-[calc(100vh-8rem)] flex-1 rounded-xl bg-transparent p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information Card */}
                  <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            Informasi Personal
                          </CardTitle>
                          <p className="mt-1 text-sm text-gray-600">
                            Data dasar pengguna
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                          <Label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                          >
                            Nama Lengkap
                          </Label>
                          <div className="relative">
                            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              className="h-12 rounded-xl border-gray-200 pl-10 transition-all focus:border-blue-500 focus:ring-blue-500/20"
                              placeholder="Masukkan nama lengkap"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                          >
                            Alamat Email
                          </Label>
                          <div className="relative">
                            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className="h-12 rounded-xl border-gray-200 pl-10 transition-all focus:border-blue-500 focus:ring-blue-500/20"
                              placeholder="nama@email.com"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security Information Card */}
                  <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                          <Shield className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            Keamanan Akun
                          </CardTitle>
                          <p className="mt-1 text-sm text-gray-600">
                            Atur password untuk akun pengguna
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                          <Label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                          >
                            Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={(e) =>
                                handleInputChange("password", e.target.value)
                              }
                              className="h-12 rounded-xl border-gray-200 pr-12 pl-10 transition-all focus:border-blue-500 focus:ring-blue-500/20"
                              placeholder="Minimal 8 karakter"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          {/* Password Strength Indicator */}
                          {formData.password && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">
                                  Kekuatan Password
                                </span>
                                <span
                                  className={`font-medium ${
                                    passwordStrength.strength < 50
                                      ? "text-red-600"
                                      : passwordStrength.strength < 75
                                        ? "text-yellow-600"
                                        : passwordStrength.strength < 100
                                          ? "text-blue-600"
                                          : "text-green-600"
                                  }`}
                                >
                                  {passwordStrength.text}
                                </span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                  style={{
                                    width: `${passwordStrength.strength}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="password_confirmation"
                            className="text-sm font-medium text-gray-700"
                          >
                            Konfirmasi Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                              id="password_confirmation"
                              type={showConfirmPassword ? "text" : "password"}
                              value={formData.password_confirmation}
                              onChange={(e) =>
                                handleInputChange(
                                  "password_confirmation",
                                  e.target.value,
                                )
                              }
                              className={`h-12 rounded-xl border-gray-200 pr-12 pl-10 transition-all focus:border-blue-500 focus:ring-blue-500/20 ${
                                formData.password_confirmation &&
                                !passwordsMatch
                                  ? "border-red-300 focus:border-red-500"
                                  : ""
                              }`}
                              placeholder="Ketik ulang password"
                              required
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          {/* Password Match Indicator */}
                          {formData.password_confirmation && (
                            <div
                              className={`flex items-center gap-2 text-xs ${
                                passwordsMatch
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  passwordsMatch ? "bg-green-500" : "bg-red-500"
                                }`}
                              />
                              {passwordsMatch ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Password cocok
                                </div>
                              ) : (
                                "Password tidak cocok"
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/admin/user")}
                      className="h-12 flex-1 rounded-xl border-gray-300 transition-colors hover:bg-gray-50"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isSaving ||
                        !passwordsMatch ||
                        formData.password.length < 8
                      }
                      className="h-12 flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Spinner className="mr-2" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Buat User
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
