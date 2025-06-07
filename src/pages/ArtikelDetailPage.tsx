import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import { API_CONFIG } from "@/config/api";

// Fix for default marker icon in Leaflet
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

// Tipe data untuk artikel
interface Article {
  id: number;
  title: string;
  content: string;
  date_created: string;
  author: string;
  image: string;
  jenis_artikel: string;
  kategori_artikel: string;
  media_artikel: { url: string; name: string }[];
  latitude?: number;
  longitude?: number;
  location_name?: string;
}

export default function ArtikelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFloatingHeader, setShowFloatingHeader] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_CONFIG.baseURL}/api/publik/artikel/${id}`,
          {
            headers: API_CONFIG.headers,
          },
        );
        if (response.data.status === "success") {
          const data = response.data.data;
          setArticle({
            id: data.id_artikel,
            title: data.judul_artikel,
            content: data.isi_artikel,
            date_created: formatDate(data.tanggal_publikasi_artikel),
            author: data.penulis_artikel,
            image:
              (data.media_artikel &&
                data.media_artikel.length > 0 &&
                data.media_artikel[0].url) ||
              "https://flowbite.com/docs/images/blog/image-2.jpg",
            jenis_artikel: data.jenis_artikel,
            kategori_artikel: data.kategori_artikel,
            media_artikel: data.media_artikel || [],
            latitude: data.latitude,
            longitude: data.longitude,
            location_name: data.location_name,
          });
        } else {
          setArticle(null);
        }
      } catch (error) {
        setArticle(null);
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Scroll progress and floating header effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setScrollProgress(scrollPercent);
      setShowFloatingHeader(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function formatDate(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Carousel navigation
  const handlePrev = () => {
    if (!article) return;
    setCarouselIndex((prev) =>
      prev === 0 ? article.media_artikel.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    if (!article) return;
    setCarouselIndex((prev) =>
      prev === article.media_artikel.length - 1 ? 0 : prev + 1,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <NavbarDesa />
        <div className="container mx-auto px-4 pt-6 sm:pt-8">
          <div className="mx-auto max-w-4xl">
            {/* Loading skeleton */}
            <div className="mb-6 space-y-4">
              {/* Removed spinner container */}
              <div className="mx-auto h-8 w-3/4 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
              <div className="flex justify-center gap-2">
                <div className="h-6 w-24 animate-pulse rounded-full bg-gradient-to-r from-blue-200 to-blue-300 dark:from-gray-700 dark:to-gray-600"></div>
                <div className="h-6 w-20 animate-pulse rounded-full bg-gradient-to-r from-green-200 to-green-300 dark:from-gray-700 dark:to-gray-600"></div>
                <div className="h-6 w-32 animate-pulse rounded-full bg-gradient-to-r from-purple-200 to-purple-300 dark:from-gray-700 dark:to-gray-600"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto mb-6 px-4 sm:mb-8">
          <div className="mx-auto max-w-4xl">
            <div className="aspect-[16/9] w-full animate-pulse rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 shadow-2xl dark:from-gray-700 dark:to-gray-600"></div>
          </div>
        </div>
        <div className="container mx-auto mb-8 px-4 sm:mb-12">
          <div className="mx-auto max-w-4xl rounded-xl border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-sm dark:border-gray-600/20 dark:bg-gray-800/80">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 ${
                    i % 2 === 0 ? "w-full" : i % 3 === 0 ? "w-5/6" : "w-4/6"
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <FooterDesa />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="space-y-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-red-400 to-pink-400 opacity-20 blur-2xl"></div>
            <div className="relative rounded-2xl border border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur-sm dark:border-gray-600/20 dark:bg-gray-800/90">
              <div className="mb-4 text-6xl">📄</div>
              <h1 className="mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:to-gray-300">
                Artikel tidak ditemukan
              </h1>
              <a
                href="/artikeldesa"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-emerald-600 hover:shadow-xl"
              >
                ← Kembali ke daftar artikel
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavbarDesa />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 z-50 h-1 w-full bg-gray-200/50 dark:bg-gray-700/50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Floating Header */}
      <div
        className={`fixed top-0 right-0 left-0 z-40 border-b border-white/20 bg-white/95 shadow-lg backdrop-blur-md transition-all duration-300 dark:border-gray-700/20 dark:bg-gray-900/95 ${
          showFloatingHeader
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="truncate text-lg font-semibold text-gray-800 dark:text-white">
              {article.title}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {article.date_created}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <div className="container mx-auto px-4 pt-8 sm:pt-12">
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-400/10 to-emerald-400/10 blur-3xl"></div>

            <div className="space-y-6 text-center">
              <h1 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-3xl leading-tight font-bold text-transparent sm:text-4xl md:text-5xl dark:from-white dark:to-gray-300">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center space-x-2 rounded-full border border-green-200/50 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 shadow-md dark:border-green-700/50 dark:from-green-900/50 dark:to-emerald-900/50">
                  <svg
                    className="h-4 w-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    {article.date_created}
                  </span>
                </div>

                <div className="flex items-center space-x-2 rounded-full border border-blue-200/50 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 shadow-md dark:border-blue-700/50 dark:from-blue-900/50 dark:to-indigo-900/50">
                  <svg
                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    {article.jenis_artikel === "resmi" ? "Resmi" : "Warga"}
                  </span>
                </div>

                <div className="flex items-center space-x-2 rounded-full border border-purple-200/50 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 shadow-md dark:border-purple-700/50 dark:from-purple-900/50 dark:to-pink-900/50">
                  <svg
                    className="h-4 w-4 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                    {article.kategori_artikel
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(" ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Carousel */}
      {article.media_artikel.length > 0 && (
        <div className="container mx-auto mt-8 mb-8 px-4 sm:mb-12">
          <div className="mx-auto max-w-4xl">
            <div className="group relative">
              {/* Decorative glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-emerald-400/20 blur-2xl"></div>

              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl dark:border-gray-600/20 dark:bg-gray-800">
                <img
                  src={article.media_artikel[carouselIndex]?.url}
                  alt={
                    article.media_artikel[carouselIndex]?.name ||
                    "Gambar Artikel"
                  }
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Enhanced carousel controls */}
                {article.media_artikel.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-white/90 p-3 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white dark:border-gray-600/30 dark:bg-gray-800/90 dark:hover:bg-gray-700"
                      aria-label="Sebelumnya"
                    >
                      <svg
                        className="h-5 w-5 text-gray-700 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-white/90 p-3 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white dark:border-gray-600/30 dark:bg-gray-800/90 dark:hover:bg-gray-700"
                      aria-label="Selanjutnya"
                    >
                      <svg
                        className="h-5 w-5 text-gray-700 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    {/* Enhanced indicators */}
                    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm">
                      {article.media_artikel.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCarouselIndex(idx)}
                          className={`h-2 w-2 rounded-full transition-all duration-300 ${
                            carouselIndex === idx
                              ? "w-6 bg-white shadow-lg"
                              : "bg-white/60 hover:bg-white/80"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Article Content */}
      <div className="container mx-auto mb-8 px-4 sm:mb-12">
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/60 to-blue-50/60 blur-3xl dark:from-gray-800/60 dark:to-gray-700/60"></div>

            <div className="relative rounded-2xl border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-sm sm:p-8 md:p-10 dark:border-gray-600/20 dark:bg-gray-800/80">
              <div className="prose prose-sm dark:prose-invert sm:prose-base md:prose-lg max-w-none">
                <div className="text-justify leading-relaxed text-gray-800 dark:text-gray-200">
                  <p className="whitespace-pre-line first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:text-4xl first-letter:font-bold first-letter:text-gray-900 dark:first-letter:text-white">
                    {article.content}
                  </p>
                </div>

                {/* Enhanced Location Section */}
                {article.location_name && (
                  <div className="mt-8 rounded-xl border border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:border-amber-700/30 dark:from-amber-900/20 dark:to-orange-900/20">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5 text-amber-600 dark:text-amber-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <strong className="text-amber-800 dark:text-amber-300">
                        Lokasi:
                      </strong>
                      <span className="text-amber-700 dark:text-amber-200">
                        {article.location_name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Enhanced Map Section */}
                {article.latitude && article.longitude && (
                  <div className="mt-8">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-green-400/20 blur-xl"></div>
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/20 shadow-2xl dark:border-gray-600/20">
                        <MapContainer
                          center={[article.latitude, article.longitude]}
                          zoom={15}
                          style={{ height: "100%", width: "100%" }}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker
                            position={[article.latitude, article.longitude]}
                          />
                        </MapContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Author Section */}
              <div className="mt-8 flex items-center border-t border-gray-200/50 pt-8 dark:border-gray-700/50">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-emerald-400/30 blur-lg"></div>
                  <img
                    className="relative h-12 w-12 rounded-full border-2 border-white shadow-lg dark:border-gray-600"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`}
                    alt="Avatar of Author"
                  />
                </div>
                <div className="ml-4">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="h-4 w-4 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ditulis oleh
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {article.author}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Top Button */}
      <button
        className="group fixed right-6 bottom-6 z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/40 to-emerald-400/40 blur-lg transition-all duration-300 group-hover:blur-xl"></div>
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/90 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white dark:border-gray-600/30 dark:bg-gray-800/90 dark:hover:bg-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 transition-transform duration-300 group-hover:-translate-y-0.5 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
        </div>
      </button>

      <FooterDesa />
    </div>
  );
}
