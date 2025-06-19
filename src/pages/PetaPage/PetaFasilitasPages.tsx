import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../config/api";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MapPin,
  School,
  Church,
  Hospital,
  Building,
  Trash2,
  AlertCircle,
  Eye,
  Edit,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface NewPOIFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [string | number, string | number];
  };
  properties: {
    id: number;
    name: string;
    kategori?: string;
    alamat?: string;
    tags?: string[];
    artikel_id?: number | null;
    status_artikel?: string | null;
  };
}

interface POI {
  id: number;
  name: string;
  amenity: string;
  latitude: number;
  longitude: number;
  address: string;
  created_at: string;
  updated_at: string;
  artikel_id?: number | null;
  status_artikel?: string | null;
}

const amenityOptions = [
  {
    value: "school",
    label: "Sekolah",
    icon: School,
    color: "bg-blue-100 text-blue-800",
    activeButtonColor: "bg-blue-600",
  },
  {
    value: "place_of_worship",
    label: "Tempat Ibadah",
    icon: Church,
    color: "bg-purple-100 text-purple-800",
    activeButtonColor: "bg-purple-600",
  },
  {
    value: "kesehatan",
    label: "Kesehatan",
    icon: Hospital,
    color: "bg-red-100 text-red-800",
    activeButtonColor: "bg-red-600",
  },
  {
    value: "other",
    label: "Lainnya",
    icon: Building,
    color: "bg-orange-100 text-orange-800",
    activeButtonColor: "bg-orange-600",
  },
];

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  active,
  onClick,
  children,
  count,
}) => {
  const amenityLabel = React.Children.toArray(children)[1] as string;

  let buttonBgClass = "bg-gray-700"; // Default for 'Semua' or unknown
  let countBgClass = "bg-gray-800"; // Default for 'Semua' count badge

  // Find the amenity option if it's not 'Semua'
  if (amenityLabel !== "Semua") {
    const option = amenityOptions.find((opt) => opt.label === amenityLabel);
    if (option) {
      buttonBgClass = option.activeButtonColor;
      countBgClass = option.activeButtonColor; // Use same color for active badge
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

export default function PetaFasilitasPages() {
  const navigate = useNavigate();
  const [poiList, setPoiList] = useState<POI[]>([]);
  const [filteredPoiList, setFilteredPoiList] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [amenityFilter, setAmenityFilter] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPoiCount, setTotalPoiCount] = useState(0);
  const itemsPerPage = 10;

  // Fetch data only once when component mounts
  useEffect(() => {
    const fetchPoiData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch from the new API endpoint
        const response = await axios.get(
          `${API_CONFIG.baseURL}/api/publik/map/poi/all`,
          {
            headers: API_CONFIG.headers,
          },
        );
        const data = response.data;

        // Helper to safely get coordinates as numbers
        const parseCoords = (coords: [string | number, string | number]) => [
          typeof coords[0] === "string" ? parseFloat(coords[0]) : coords[0],
          typeof coords[1] === "string" ? parseFloat(coords[1]) : coords[1],
        ];

        const allFeatures: POI[] = [];

        // Hapus filter artikel_id/status_artikel, tampilkan semua data
        ["sekolah", "tempat_ibadah", "kesehatan", "fasilitas_lainnya"].forEach(
          (kategori) => {
            if (!data[kategori]?.features) return;

            data[kategori].features.forEach((feature: NewPOIFeature) => {
              const [lng, lat] = parseCoords(feature.geometry.coordinates);
              allFeatures.push({
                id: feature.properties.id,
                name: feature.properties.name,
                amenity: kategori, // gunakan nama kategori dari API
                latitude: lat,
                longitude: lng,
                address: feature.properties.alamat || "",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                artikel_id: feature.properties.artikel_id || null,
                status_artikel: feature.properties.status_artikel || null,
              });
            });
          },
        );

        // Hapus filter artikel_id/status_artikel, tampilkan semua data
        setPoiList(
          allFeatures.map((item) => ({
            ...item,
            // Mapping kategori dari API ke amenityOptions
            amenity:
              item.amenity === "sekolah"
                ? "school"
                : item.amenity === "tempat_ibadah"
                  ? "place_of_worship"
                  : item.amenity === "kesehatan"
                    ? "kesehatan"
                    : item.amenity === "fasilitas_lainnya"
                      ? "other"
                      : item.amenity,
          })),
        );
        setFilteredPoiList(
          allFeatures.map((item) => ({
            ...item,
            amenity:
              item.amenity === "sekolah"
                ? "school"
                : item.amenity === "tempat_ibadah"
                  ? "place_of_worship"
                  : item.amenity === "kesehatan"
                    ? "kesehatan"
                    : item.amenity === "fasilitas_lainnya"
                      ? "other"
                      : item.amenity,
          })),
        );
        setTotalPoiCount(allFeatures.length);
      } catch (err) {
        console.error("Error fetching POI data:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setError("Sesi Anda telah berakhir. Silakan login kembali.");
        } else {
          setError("Gagal mengambil data fasilitas.");
        }
        setPoiList([]);
        setFilteredPoiList([]);
        setTotalPoiCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPoiData();
  }, []); // Only fetch once when component mounts

  // Apply filters whenever searchQuery or amenityFilter changes
  useEffect(() => {
    let filtered = [...poiList];

    // Apply amenity filter
    if (amenityFilter === "other") {
      const specificAmenities = ["school", "place_of_worship", "kesehatan"];
      filtered = filtered.filter(
        (poi) => !specificAmenities.includes(poi.amenity),
      );
    } else if (amenityFilter) {
      filtered = filtered.filter((poi) => poi.amenity === amenityFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (poi) =>
          poi.name.toLowerCase().includes(searchLower) ||
          poi.address.toLowerCase().includes(searchLower),
      );
    }

    setFilteredPoiList(filtered);
    setTotalPoiCount(filtered.length);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, amenityFilter, poiList]);

  const handleDelete = async (id: number) => {
    toast.custom(
      (t) => (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="font-medium text-gray-900">Konfirmasi Hapus</h3>
              <p className="text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus fasilitas ini?
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t);
                const token = localStorage.getItem("authToken");
                if (!token) {
                  toast.error("Token tidak ditemukan. Silakan login kembali.");
                  return;
                }
                toast.promise(
                  new Promise<string>((resolve, reject) => {
                    setDeleteLoading(id.toString());
                    axios
                      .delete(`${API_CONFIG.baseURL}/api/map/poi/${id}`, {
                        headers: {
                          ...API_CONFIG.headers,
                          Authorization: `Bearer ${token}`,
                        },
                      })
                      .then(() => {
                        setPoiList((prevList) =>
                          prevList.filter((poi) => poi.id !== id),
                        );
                        setTotalPoiCount((prev) => prev - 1);
                        resolve("Fasilitas berhasil dihapus");
                      })
                      .catch((error) => {
                        console.error("Error deleting POI:", error);
                        reject("Gagal menghapus fasilitas. Silakan coba lagi.");
                      })
                      .finally(() => {
                        setDeleteLoading(null);
                      });
                  }),
                  {
                    loading: "Menghapus fasilitas...",
                    success: (message: string) => message,
                    error: (message: string) => message,
                  },
                );
              }}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      },
    );
  };

  const getAmenityInfo = (amenity: string) => {
    const option = amenityOptions.find((opt) => opt.value === amenity);
    return (
      option || {
        label: amenity,
        color: "bg-gray-100 text-gray-800",
        icon: Building,
      }
    );
  };

  const totalPages = Math.ceil(totalPoiCount / itemsPerPage);

  const totalSchools = poiList.filter((poi) => poi.amenity === "school").length;
  const totalWorship = poiList.filter(
    (poi) => poi.amenity === "place_of_worship",
  ).length;
  const totalKesehatan = poiList.filter(
    (poi) => poi.amenity === "kesehatan",
  ).length;
  const totalOthers = poiList.filter(
    (poi) => !["school", "place_of_worship", "kesehatan"].includes(poi.amenity),
  ).length;

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
                  Fasilitas Desa
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Kelola fasilitas dan tempat penting di desa
                </p>
              </div>
              <Button
                onClick={() => navigate("/admin/fasilitas/tambah")}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Tambah Fasilitas
              </Button>
            </div>
          </div>

          <div className="p-6">
            {/* Filters and Search */}
            <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              {/* Amenity Filter (Card Style) */}
              <div className="mb-4 flex flex-wrap gap-3">
                <FilterButton
                  active={amenityFilter === ""}
                  onClick={() => setAmenityFilter("")}
                  count={poiList.length}
                >
                  <Building className="h-4 w-4" />
                  Semua
                </FilterButton>
                {amenityOptions.map((option) => {
                  const count =
                    option.value === "other"
                      ? totalOthers
                      : option.value === "school"
                        ? totalSchools
                        : option.value === "place_of_worship"
                          ? totalWorship
                          : totalKesehatan;
                  return (
                    <FilterButton
                      key={option.value}
                      active={amenityFilter === option.value}
                      onClick={() => setAmenityFilter(option.value)}
                      count={count}
                    >
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </FilterButton>
                  );
                })}
              </div>

              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari fasilitas berdasarkan nama atau alamat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* POIs Table */}
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
              ) : poiList.length === 0 ? (
                <div className="py-12 text-center">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Tidak ada fasilitas
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {amenityFilter
                      ? "Tidak ada fasilitas yang sesuai dengan filter yang dipilih."
                      : "Belum ada fasilitas yang ditambahkan. Mulai dengan menambahkan fasilitas pertama."}
                  </p>
                  <Button
                    onClick={() => navigate("/admin/fasilitas/tambah")}
                    className="mx-auto mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5" />
                    Tambah Fasilitas Pertama
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
                          Jenis
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
                          Artikel ID
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredPoiList.map((poi) => {
                        const amenityInfo = getAmenityInfo(poi.amenity);
                        return (
                          <tr
                            key={poi.id}
                            className="transition-colors hover:bg-gray-50"
                          >
                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap text-gray-900">
                              {poi.id}
                            </td>
                            <td className="px-3 py-2 text-xs whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${amenityInfo.color}`}
                              >
                                <amenityInfo.icon className="h-3 w-3" />
                                {amenityInfo.label}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-900">
                              {poi.name}
                            </td>
                            <td className="max-w-xs px-3 py-2 text-xs text-gray-600">
                              <div className="line-clamp-2 overflow-hidden">
                                {poi.address}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600">
                              {poi.latitude}, {poi.longitude}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600">
                              {poi.artikel_id || "-"}
                            </td>
                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    navigate(`/admin/fasilitas/${poi.id}`)
                                  }
                                  className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                >
                                  <Eye className="h-3 w-3" />
                                  Detail
                                </button>
                                <button
                                  onClick={() =>
                                    navigate(`/admin/fasilitas/edit/${poi.id}`)
                                  }
                                  className="inline-flex items-center gap-1 rounded-md bg-yellow-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
                                >
                                  <Edit className="h-3 w-3" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(poi.id)}
                                  disabled={deleteLoading === poi.id.toString()}
                                  className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                >
                                  {deleteLoading === poi.id.toString() ? (
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
                        {Math.min(currentPage * itemsPerPage, totalPoiCount)}
                      </span>{" "}
                      dari <span className="font-medium">{totalPoiCount}</span>{" "}
                      fasilitas
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
