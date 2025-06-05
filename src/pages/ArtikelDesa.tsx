import { useState, useEffect } from "react";
import NavbarDesa from "../components/NavbarDesa";
import FooterDesa from "../components/FooterDesa";

import {
  Card,
  Spinner,
  Pagination,
} from "flowbite-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

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

export default function ArtikelDesa() {
  const [articles, setArticles] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 9; // Show 9 articles per page for grid layout

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get<ArtikelResponse>(
          `https://thankful-urgently-silkworm.ngrok-free.app/api/publik/artikel?page=${currentPage}&per_page=${itemsPerPage}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "69420",
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

  // Get unique categories from articles
  const categories = [
    "Semua",
    ...new Set(articles.map((article) => article.kategori_artikel)),
  ];

  // Filter articles based on search term and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.judul_artikel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.isi_artikel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" ||
      article.kategori_artikel === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar Section */}
      <NavbarDesa />

      <main className="container mx-auto px-6 py-2">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Artikel Desa
          </h1>
          <Button onClick={() => (window.location.href = "/artikeldesa/buat")}>
            Buat Artikel Baru
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-10 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="relative w-full md:w-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <Input
                placeholder="Cari artikel..."
                className="rounded-lg border-gray-200 pl-10 dark:border-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex w-full flex-wrap gap-2 md:w-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  className={
                    selectedCategory === category
                      ? "bg-green-600 hover:bg-green-700"
                      : "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {capitalizeWords(category)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner size="xl" />
          </div>
        ) : error ? (
          <div className="py-12 text-center">
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
              className="mx-auto h-12 w-12 text-red-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              {error}
            </h3>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Card
                key={article.id_artikel}
                className="flex h-[500px] max-w-sm flex-col"
                imgAlt={article.judul_artikel}
                imgSrc={
                  article.media_artikel?.[0]?.url ||
                  "https://flowbite.com/docs/images/blog/image-1.jpg"
                }
                theme={{
                  img: {
                    base: "h-48 w-full object-cover",
                  },
                  root: {
                    base: "flex h-full flex-col",
                  },
                }}
              >
                <div className="flex flex-grow flex-col">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {capitalizeWords(article.kategori_artikel)}
                    </span>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1 h-4 w-4"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {formatDate(article.tanggal_publikasi_artikel)}
                    </div>
                  </div>
                  <h5 className="line-clamp-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {capitalizeWords(article.judul_artikel)}
                  </h5>
                  <p className="mt-2 line-clamp-3 font-normal text-gray-700 dark:text-gray-400">
                    {capitalizeWords(article.isi_artikel.substring(0, 150))}...
                  </p>
                </div>
                <div className="mt-auto pt-4">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() =>
                      (window.location.href = `/artikeldesa/${article.id_artikel}`)
                    }
                  >
                    Baca Selengkapnya
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
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
              className="mx-auto h-12 w-12 text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Tidak ada artikel ditemukan
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Coba ubah filter pencarian Anda atau pilih kategori yang berbeda.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              showIcons
            />
          </div>
        )}
      </main>

      {/* Footer Section */}
      <FooterDesa />
    </div>
  );
}
