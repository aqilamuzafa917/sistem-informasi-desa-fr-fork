import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../config/api";
import {
  Plus,
  Search,
  Wheat,
  Factory,
  Mountain,
  Eye,
  Trash2,
} from "lucide-react";
import { PiFarm } from "react-icons/pi";
import { Spinner } from "@/components/ui/spinner";

// Potensi categories config
const categoryConfig = [
  {
    key: "pertanian",
    label: "Pertanian",
    icon: Wheat,
    color: "bg-green-100 text-green-800",
    activeButtonColor: "bg-green-600",
  },
  {
    key: "peternakan",
    label: "Peternakan",
    icon: PiFarm,
    color: "bg-blue-100 text-blue-800",
    activeButtonColor: "bg-blue-600",
  },
  {
    key: "industri",
    label: "Industri",
    icon: Factory,
    color: "bg-red-100 text-red-800",
    activeButtonColor: "bg-red-600",
  },
  {
    key: "wisata",
    label: "Wisata",
    icon: Mountain,
    color: "bg-orange-100 text-orange-800",
    activeButtonColor: "bg-orange-600",
  },
];

interface PotensiRow {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  artikel_id?: string | null;
  status_artikel?: string | null;
  created_at: string;
  updated_at: string;
}

const FilterButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}> = ({ active, onClick, children, count }) => {
  const label = React.Children.toArray(children)[1] as string;
  let buttonBgClass = "bg-gray-700";
  let countBgClass = "bg-gray-800";
  if (label !== "Semua") {
    const option = categoryConfig.find((opt) => opt.label === label);
    if (option) {
      buttonBgClass = option.activeButtonColor;
      countBgClass = option.activeButtonColor;
    }
  }
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
        active
          ? `scale-105 ${buttonBgClass} text-white shadow-lg`
          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {children}
      {count !== undefined && (
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            active ? `${countBgClass} text-white` : "bg-gray-100 text-gray-600"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default function PetaPotensiPages() {
  const navigate = useNavigate();
  const [potensiList, setPotensiList] = useState<PotensiRow[]>([]);
  const [filteredPotensiList, setFilteredPotensiList] = useState<PotensiRow[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPotensiCount, setTotalPotensiCount] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPotensiData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_CONFIG.baseURL}/api/publik/map/poi/all`,
          { headers: API_CONFIG.headers },
        );
        const data = response.data;
        const features: PotensiRow[] = [];
        // Hanya proses kategori potensi
        ["pertanian", "peternakan", "industri", "wisata"].forEach(
          (kategori) => {
            if (!data[kategori]?.features) return;
            data[kategori].features.forEach(
              (feature: {
                geometry: { type: string; coordinates: [number, number] };
                properties: {
                  name: string;
                  alamat?: string;
                  artikel_id?: string | number | null;
                  status_artikel?: string | null;
                  [key: string]: unknown;
                };
              }) => {
                if (
                  feature &&
                  typeof feature === "object" &&
                  feature.geometry &&
                  feature.geometry.type === "Point" &&
                  Array.isArray(feature.geometry.coordinates) &&
                  feature.properties?.name
                ) {
                  const coords = feature.geometry.coordinates.map(Number) as [
                    number,
                    number,
                  ];
                  features.push({
                    id: `${coords[0]}-${coords[1]}-${feature.properties.name}`.replace(
                      /[^a-zA-Z0-9-]/g,
                      "-",
                    ),
                    name: feature.properties.name,
                    category: kategori,
                    latitude: coords[1],
                    longitude: coords[0],
                    address:
                      typeof feature.properties.alamat === "string"
                        ? feature.properties.alamat
                        : "",
                    artikel_id:
                      feature.properties.artikel_id !== undefined &&
                      feature.properties.artikel_id !== null
                        ? String(feature.properties.artikel_id)
                        : null,
                    status_artikel: feature.properties.status_artikel ?? null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  });
                }
              },
            );
          },
        );
        // Hapus filter artikel_id/status_artikel, tampilkan semua data
        setPotensiList(
          features.map((item) => ({
            ...item,
            category: item.category,
          })),
        );
        setFilteredPotensiList(
          features.map((item) => ({
            ...item,
            category: item.category,
          })),
        );
        setTotalPotensiCount(features.length);
      } catch {
        setError("Gagal mengambil data potensi.");
        setPotensiList([]);
        setFilteredPotensiList([]);
        setTotalPotensiCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchPotensiData();
  }, []);

  useEffect(() => {
    let filtered = [...potensiList];
    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.address.toLowerCase().includes(searchLower),
      );
    }
    setFilteredPotensiList(filtered);
    setTotalPotensiCount(filtered.length);
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, potensiList]);

  const totalPages = Math.ceil(totalPotensiCount / itemsPerPage);
  const totalByCategory = (key: string) =>
    potensiList.filter((p) => p.category === key).length;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus potensi ini?"))
      return;
    setDeleteLoading(id);
    try {
      await axios.delete(`${API_CONFIG.baseURL}/api/map/potensi/${id}`, {
        headers: API_CONFIG.headers,
      });
      setPotensiList((prev) => prev.filter((p) => p.id !== id));
      setFilteredPotensiList((prev) => prev.filter((p) => p.id !== id));
      setTotalPotensiCount((prev) => prev - 1);
    } catch {
      alert("Gagal menghapus potensi. Silakan coba lagi.");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Potensi Desa
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Kelola potensi dan sumber daya desa
                </p>
              </div>
              <Button
                onClick={() => navigate("/admin/potensi/tambah")}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-green-700 hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Tambah Potensi
              </Button>
            </div>
          </div>

          <div className="p-6">
            {/* Filters and Search */}
            <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap gap-3">
                <FilterButton
                  active={categoryFilter === ""}
                  onClick={() => setCategoryFilter("")}
                  count={potensiList.length}
                >
                  <Wheat className="h-4 w-4" />
                  Semua
                </FilterButton>
                {categoryConfig.map((option) => (
                  <FilterButton
                    key={option.key}
                    active={categoryFilter === option.key}
                    onClick={() => setCategoryFilter(option.key)}
                    count={totalByCategory(option.key)}
                  >
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </FilterButton>
                ))}
              </div>
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari potensi berdasarkan nama atau alamat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Potensi Table */}
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <Spinner size="lg" text="Memuat data..." />
                </div>
              ) : error ? (
                <div className="py-12 text-center">
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Error
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{error}</p>
                </div>
              ) : potensiList.length === 0 ? (
                <div className="py-12 text-center">
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Tidak ada potensi
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {categoryFilter
                      ? "Tidak ada potensi yang sesuai dengan filter yang dipilih."
                      : "Belum ada potensi yang ditambahkan. Mulai dengan menambahkan potensi pertama."}
                  </p>
                  <Button
                    onClick={() => navigate("/admin/potensi/tambah")}
                    className="mx-auto mt-4 flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
                  >
                    <Plus className="h-5 w-5" />
                    Tambah Potensi Pertama
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
                          Kategori
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Nama
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Alamat
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Koordinat
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredPotensiList.map((potensi) => {
                        const option = categoryConfig.find(
                          (opt) => opt.key === potensi.category,
                        );
                        return (
                          <tr
                            key={potensi.id}
                            className="transition-colors hover:bg-gray-50"
                          >
                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap text-gray-900">
                              {potensi.id}
                            </td>
                            <td className="px-3 py-2 text-xs whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                                  option?.color || "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {option && <option.icon className="h-3 w-3" />}
                                {option?.label || potensi.category}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-900">
                              {potensi.name}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600">
                              {potensi.address}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600">
                              {potensi.latitude}, {potensi.longitude}
                            </td>
                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    navigate(`/admin/potensi/${potensi.id}`)
                                  }
                                  className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                >
                                  <Eye className="h-3 w-3" />
                                  Detail
                                </button>
                                <button
                                  onClick={() => handleDelete(potensi.id)}
                                  disabled={deleteLoading === potensi.id}
                                  className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                >
                                  {deleteLoading === potensi.id ? (
                                    <Spinner size="sm" className="h-3 w-3" />
                                  ) : (
                                    <Trash2 className="h-3 w-3" />
                                  )}
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Menampilkan{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{" "}
                      sampai{" "}
                      <span className="font-medium">
                        {Math.min(
                          currentPage * itemsPerPage,
                          totalPotensiCount,
                        )}
                      </span>{" "}
                      dari{" "}
                      <span className="font-medium">{totalPotensiCount}</span>{" "}
                      potensi
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                              page === currentPage
                                ? "z-10 border-green-500 bg-green-50 text-green-600"
                                : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
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
