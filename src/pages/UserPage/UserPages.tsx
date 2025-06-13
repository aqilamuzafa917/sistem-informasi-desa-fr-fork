import React, { useState, useEffect, useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../config/api";
import { Calendar, User, Mail, AlertCircle, Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

interface UserResponse {
  users: User[];
  pagination: PaginationData;
}

export default function UserPages() {
  const navigate = useNavigate();
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 1,
  });

  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.");
          setLoading(false);
          return;
        }

        const params = new URLSearchParams({
          page: pagination.current_page.toString(),
          per_page: pagination.per_page.toString(),
        });

        const response = await axios.get<UserResponse>(
          `${API_CONFIG.baseURL}/api/user-list?${params.toString()}`,
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setUserList(response.data.users);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Error fetching user data:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setError("Sesi Anda telah berakhir. Silakan login kembali.");
        } else {
          setError("Gagal mengambil data user.");
        }
        setUserList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, pagination.current_page]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div> 
                <h1 className="text-2xl font-bold text-gray-900">
                  Kelola User
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Kelola data user sistem
                </p>
              </div>
              <Button
                onClick={() => navigate("/admin/user/tambah")}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Tambah User
              </Button>
            </div>
          </div>

          <div className="p-6">
            {/* Users Table */}
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <Spinner size="lg" text="Memuat data..." />
                </div>
              ) : error ? (
                <div className="py-12 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Error
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{error}</p>
                </div>
              ) : userList.length === 0 ? (
                <div className="py-12 text-center">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Tidak ada user
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Belum ada user yang terdaftar. Mulai dengan menambahkan user
                    pertama.
                  </p>
                  <Button
                    onClick={() => navigate("/admin/user/tambah")}
                    className="mx-auto mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5" />
                    Tambah User
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          ID
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Nama
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Terdaftar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {userList.map((user) => (
                        <tr
                          key={user.id}
                          className="transition-colors hover:bg-gray-50"
                        >
                          <td className="px-3 py-2 text-xs font-medium whitespace-nowrap text-gray-900">
                            {user.id}
                          </td>
                          <td className="px-3 py-2 text-xs whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                                <User className="h-3 w-3 text-gray-600" />
                              </div>
                              <span className="text-gray-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-xs whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600">
                                {user.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(user.created_at)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        current_page: Math.max(1, prev.current_page - 1),
                      }))
                    }
                    disabled={pagination.current_page === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        current_page: Math.min(
                          pagination.last_page,
                          prev.current_page + 1,
                        ),
                      }))
                    }
                    disabled={pagination.current_page === pagination.last_page}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Menampilkan{" "}
                      <span className="font-medium">{pagination.from}</span>{" "}
                      sampai{" "}
                      <span className="font-medium">{pagination.to}</span> dari{" "}
                      <span className="font-medium">{pagination.total}</span>{" "}
                      user
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                      <button
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            current_page: Math.max(1, prev.current_page - 1),
                          }))
                        }
                        disabled={pagination.current_page === 1}
                        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {[...Array(pagination.last_page)].map((_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() =>
                              setPagination((prev) => ({
                                ...prev,
                                current_page: page,
                              }))
                            }
                            className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                              page === pagination.current_page
                                ? "z-10 border-blue-500 bg-blue-50 text-blue-600"
                                : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            current_page: Math.min(
                              pagination.last_page,
                              prev.current_page + 1,
                            ),
                          }))
                        }
                        disabled={
                          pagination.current_page === pagination.last_page
                        }
                        className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
