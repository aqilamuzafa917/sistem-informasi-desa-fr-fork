import { useState, useEffect } from "react";
import NavbarDesa from "../components/NavbarDesa";
import FooterDesa from "../components/FooterDesa";
import axios from "axios";
import { API_CONFIG } from "../config/api";
import {
  Search,
  Calendar,
  ArrowRight,
  Plus,
  Filter,
  Clock,
  User,
} from "lucide-react";

interface Artikel {
  id_artikel: number;
  judul_artikel: string;
  kategori_artikel: string;
  isi_artikel: string;
  penulis_artikel: string;
  tanggal_publikasi_artikel: string;
  media_artikel: Array<{
    path: string;
    type: string;
    name: string;
    url: string;
  }>;
}

interface PaginatedArtikelData {
  current_page: number;
  data: Artikel[];
  last_page: number;
  total: number;
  per_page: number;
}

interface ArtikelResponse {
  status: string;
  data: PaginatedArtikelData;
}

type CategoryType =
  | "Semua"
  | "Berita"
  | "Kegiatan Sosial"
  | "Budaya"
  | "Pendidikan"
  | "Pemerintahan";

const categories: CategoryType[] = [
  "Semua",
  "Berita",
  "Kegiatan Sosial",
  "Budaya",
  "Pendidikan",
  "Pemerintahan",
];

const categoryColors: Record<CategoryType, string> = {
  Semua:
    "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 border-slate-300",
  Berita:
    "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 border-blue-300",
  "Kegiatan Sosial":
    "bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 border-green-300",
  Budaya:
    "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300 border-purple-300",
  Pendidikan:
    "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 hover:from-orange-200 hover:to-orange-300 border-orange-300",
  Pemerintahan:
    "bg-gradient-to-r from-red-100 to-red-200 text-red-800 hover:from-red-200 hover:to-red-300 border-red-300",
};

export default function ArtikelDesa() {
  const [articles, setArticles] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [articleType, setArticleType] = useState<"semua" | "resmi" | "warga">(
    "semua",
  );
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get<ArtikelResponse>(
          `${API_CONFIG.baseURL}/api/publik/artikel?page=${currentPage}&per_page=${itemsPerPage}`,
          {
            headers: {
              ...API_CONFIG.headers,
            },
          },
        );

        if (response.data.status === "success") {
          setArticles(response.data.data.data);
          setTotalPages(response.data.data.last_page);
        } else {
          setError("Gagal mengambil data artikel");
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Terjadi kesalahan saat mengambil data artikel");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage]);

  // Filter and sort articles
  const filteredArticles = articles
    .filter((article) => {
    const matchesSearch =
        article.judul_artikel
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
      article.isi_artikel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" ||
      article.kategori_artikel === selectedCategory;
      const matchesType =
        articleType === "semua" ||
        (articleType === "resmi" &&
          article.penulis_artikel.toLowerCase().includes("admin")) ||
        (articleType === "warga" &&
          !article.penulis_artikel.toLowerCase().includes("admin"));
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort(
      (a, b) =>
        new Date(b.tanggal_publikasi_artikel).getTime() -
        new Date(a.tanggal_publikasi_artikel).getTime(),
    );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const latestArticles = articles.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavbarDesa />

      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
            Artikel Desa
          </h1>
                <p className="mt-1 text-base text-gray-600">
                  Berita dan informasi terkini dari desa
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => (window.location.href = "/artikeldesa/buat")}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
              >
                <Plus className="mr-2 h-4 w-4" />
                Buat Artikel
              </button>
            </div>
          </div>
        </div>
        </div>

      <main className="relative container mx-auto px-6 py-8">
        {/* Latest Articles Banner */}
        {loading ? (
          <div className="mb-12 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-2">
                <Clock className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Artikel Terbaru
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="rounded-2xl border border-white/50 bg-white/80 p-6 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-lg bg-slate-200"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 w-3/4 rounded-lg bg-slate-200"></div>
                        <div className="h-4 w-1/2 rounded-lg bg-slate-200"></div>
                        <div className="h-6 w-24 rounded-xl bg-slate-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          latestArticles.length > 0 && (
            <div className="mb-12 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8 shadow-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-2">
                  <Clock className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Artikel Terbaru
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {latestArticles.map((article, index) => (
                  <div
                    key={article.id_artikel}
                    className="group rounded-2xl border border-white/50 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl font-bold text-blue-500">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 line-clamp-2 font-semibold text-slate-900 transition-colors duration-200 group-hover:text-blue-600">
                          {capitalizeWords(article.judul_artikel)}
                        </h3>
                        <div className="mb-2 flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(article.tanggal_publikasi_artikel)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {article.penulis_artikel}
                          </span>
                        </div>
                        <span
                          className={`rounded-2xl px-4 py-2 text-xs font-bold shadow-lg backdrop-blur-sm ${categoryColors[article.kategori_artikel as CategoryType] || categoryColors["Semua"]}`}
                        >
                          {capitalizeWords(article.kategori_artikel)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* Enhanced Search and Filter Section */}
        <div className="mb-12 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-8 xl:flex-row">
            {/* Search Box */}
            <div className="flex-1">
              <div className="group relative">
                <Search
                  className="absolute top-1/2 left-6 -translate-y-1/2 transform text-slate-400 transition-colors duration-200 group-focus-within:text-blue-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Temukan artikel yang Anda butuhkan..."
                  className="w-full rounded-2xl border-2 border-slate-200 bg-white/50 py-5 pr-6 pl-16 text-slate-700 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            </div>

            {/* Sort Options */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <select
                value={articleType}
                onChange={(e) =>
                  setArticleType(e.target.value as "semua" | "resmi" | "warga")
                }
                className="rounded-2xl border-2 border-slate-200 bg-white/50 px-6 py-4 text-slate-700 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              >
                <option value="semua">Semua Artikel</option>
                <option value="resmi">Artikel Resmi</option>
                <option value="warga">Artikel Warga</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-8 border-t border-slate-200 pt-8">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`transform rounded-2xl border-2 px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category
                      ? "shadow-lg ring-4 ring-blue-500/30 " +
                        categoryColors[category as CategoryType]
                      : categoryColors[category as CategoryType]
                  }`}
                  onClick={() => setSelectedCategory(category as CategoryType)}
                >
                  {capitalizeWords(category)}
                </button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 text-slate-600">
              <span className="rounded-xl bg-blue-100 px-4 py-2 font-semibold text-blue-700">
                {filteredArticles.length} artikel ditemukan
              </span>
              <div className="flex items-center gap-2 text-sm">
                <Filter size={16} />
                <span>Kategori: {selectedCategory}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Filter size={16} />
                <span>
                  Tipe:{" "}
                  {articleType === "semua"
                    ? "Semua Artikel"
                    : articleType === "resmi"
                      ? "Artikel Resmi"
                      : "Artikel Warga"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-xl backdrop-blur-sm"
              >
                <div className="h-64 bg-gradient-to-r from-slate-200 to-slate-300"></div>
                <div className="p-8">
                  <div className="mb-4 h-6 w-24 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300"></div>
                  <div className="mb-4 h-8 w-3/4 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300"></div>
                  <div className="mb-6 space-y-3">
                    <div className="h-4 rounded-lg bg-gradient-to-r from-slate-200 to-slate-300"></div>
                    <div className="h-4 w-5/6 rounded-lg bg-gradient-to-r from-slate-200 to-slate-300"></div>
                  </div>
                  <div className="h-12 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-300"></div>
                </div>
                </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <div className="mx-auto max-w-2xl rounded-3xl border border-white/20 bg-white/80 p-16 shadow-2xl backdrop-blur-xl">
              <div className="relative">
                <div className="absolute inset-0 scale-150 transform rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-3xl"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
                  className="relative mx-auto mb-8 h-24 w-24 text-red-400"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
              </div>
              <h3 className="mb-4 text-3xl font-bold text-slate-900">
              {error}
            </h3>
              <p className="mb-8 text-lg leading-relaxed text-slate-600">
                Terjadi kesalahan saat mengambil data artikel. Silakan coba lagi
                nanti.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex transform items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
              >
                <ArrowRight size={20} />
                Muat Ulang Halaman
              </button>
            </div>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article) => (
              <article
                key={article.id_artikel}
                className="group overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Article Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={
                      article.media_artikel?.[0]?.url ||
                      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=300&fit=crop"
                    }
                    alt={article.judul_artikel}
                    className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span
                      className={`rounded-2xl px-4 py-2 text-xs font-bold shadow-lg backdrop-blur-sm ${categoryColors[article.kategori_artikel as CategoryType] || categoryColors["Semua"]}`}
                    >
                      {capitalizeWords(article.kategori_artikel)}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-8">
                  {/* Meta Info */}
                  <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                      {formatDate(article.tanggal_publikasi_artikel)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        {article.penulis_artikel}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="mb-4 line-clamp-2 text-xl leading-tight font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600">
                    {capitalizeWords(article.judul_artikel)}
                  </h2>

                  {/* Excerpt */}
                  <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {article.isi_artikel.length > 150
                      ? article.isi_artikel.substring(0, 150) + "..."
                      : article.isi_artikel}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end">
                    <button
                    onClick={() =>
                      (window.location.href = `/artikeldesa/${article.id_artikel}`)
                    }
                      className="group/btn transform rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                    >
                      <div className="flex items-center gap-2">
                        Baca
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-200 group-hover/btn:translate-x-1"
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto max-w-2xl rounded-3xl border border-white/20 bg-white/80 p-16 shadow-2xl backdrop-blur-xl">
              <div className="relative">
                <div className="absolute inset-0 scale-150 transform rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
                <Search className="relative mx-auto mb-8 h-24 w-24 text-slate-400" />
              </div>
              <h3 className="mb-4 text-3xl font-bold text-slate-900">
                Artikel Tidak Ditemukan
            </h3>
              <p className="mb-8 text-lg leading-relaxed text-slate-600">
                Maaf, tidak ada artikel yang sesuai dengan pencarian Anda. Coba
                gunakan kata kunci yang berbeda atau jelajahi kategori lainnya.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Semua");
                  }}
                  className="inline-flex transform items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                >
                  <Filter size={20} />
                  Reset Semua Filter
                </button>
                <button
                  onClick={() => (window.location.href = "/artikeldesa")}
                  className="inline-flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50"
                >
                  <ArrowRight size={20} />
                  Jelajahi Semua Artikel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/80 p-3 shadow-xl backdrop-blur-xl">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-xl px-6 py-3 font-medium text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`rounded-xl px-5 py-3 font-semibold transition-all duration-300 ${
                    currentPage === index + 1
                      ? "scale-105 transform bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-xl px-6 py-3 font-medium text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      <FooterDesa />
    </div>
  );
}
