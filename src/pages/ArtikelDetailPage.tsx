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

  function formatDate(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Fungsi untuk mengatur progress bar saat scroll
  useEffect(() => {
    const h = document.documentElement;
    const b = document.body;
    const progress = document.querySelector("#progress");
    const header = document.getElementById("header");

    const handleScroll = () => {
      // Refresh scroll % width
      const scroll =
        ((h.scrollTop || b.scrollTop) /
          ((h.scrollHeight || b.scrollHeight) - h.clientHeight)) *
        100;
      if (progress) {
        (progress as HTMLElement).style.setProperty("--scroll", `${scroll}%`);
      }

      // Apply classes for slide in bar
      const scrollpos = window.scrollY;
      if (header) {
        if (scrollpos > 100) {
          header.classList.remove("hidden");
          header.classList.remove("fadeOutUp");
          header.classList.add("slideInDown");
        } else {
          header.classList.remove("slideInDown");
          header.classList.add("fadeOutUp");
          header.classList.add("hidden");
        }
      }
    };

    document.addEventListener("scroll", handleScroll);

    // Scroll to top functionality
    const scrollTopBtn = document.querySelector(".js-scroll-top");
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });

      const scrollTopPath = document.querySelector(".scroll-top path");
      if (scrollTopPath) {
        const pathLength = (
          scrollTopPath as SVGGeometryElement
        ).getTotalLength();
        (scrollTopPath as SVGElement).style.transition = (
          scrollTopPath as SVGElement
        ).style.webkitTransition = "none";
        (scrollTopPath as SVGElement).style.strokeDasharray =
          `${pathLength} ${pathLength}`;
        (scrollTopPath as SVGElement).style.strokeDashoffset =
          pathLength.toString();
        scrollTopPath.getBoundingClientRect(); // Trigger reflow
        (scrollTopPath as SVGElement).style.transition = (
          scrollTopPath as SVGElement
        ).style.webkitTransition = "stroke-dashoffset 10ms linear";
        (scrollTopPath as SVGElement).style.strokeDashoffset = "0";
      }
    }

    return () => {
      document.removeEventListener("scroll", handleScroll);
      if (scrollTopBtn) {
        scrollTopBtn.removeEventListener("click", () => {});
      }
    };
  }, []);

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
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavbarDesa />
        <div className="container mx-auto px-4 pt-6 sm:pt-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 h-8 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="mb-6 flex flex-wrap gap-2">
              <div className="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
        <div className="container mx-auto mb-6 px-4 sm:mb-8">
          <div className="mx-auto max-w-4xl">
            <div className="aspect-[16/9] w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
        <div className="container mx-auto mb-8 px-4 sm:mb-12">
          <div className="mx-auto max-w-4xl rounded-lg bg-white p-4 shadow-lg sm:p-6 md:p-8 dark:bg-gray-800">
            <div className="space-y-4">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
        <FooterDesa />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-900">
        <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
          Artikel tidak ditemukan
        </h1>
        <a href="/artikeldesa" className="text-green-500 hover:underline">
          Kembali ke daftar artikel
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavbarDesa />

      {/* Article Header */}
      <div className="container mx-auto px-4 pt-6 sm:pt-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-center sm:text-3xl md:text-4xl dark:text-white">
            {article.title}
          </h1>
          <div className="mb-6 flex flex-wrap gap-2 sm:justify-center">
            <p className="rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
              {article.date_created}
            </p>
            <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {article.jenis_artikel === "resmi" ? "Resmi" : "Warga"}
            </span>
            <span className="rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {article.kategori_artikel
                .split(" ")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
                )
                .join(" ")}
            </span>
          </div>
        </div>
      </div>

      {/* Carousel Gambar */}
      {article.media_artikel.length > 0 && (
        <div className="container mx-auto mb-6 px-4 sm:mb-8">
          <div className="mx-auto max-w-4xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
              <img
                src={article.media_artikel[carouselIndex]?.url}
                alt={
                  article.media_artikel[carouselIndex]?.name || "Gambar Artikel"
                }
                className="h-full w-full object-cover"
              />
              {article.media_artikel.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white sm:left-4 sm:p-3"
                    aria-label="Sebelumnya"
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white sm:right-4 sm:p-3"
                    aria-label="Selanjutnya"
                  >
                    &#8594;
                  </button>
                  <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                    {article.media_artikel.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-2 w-2 rounded-full sm:h-3 sm:w-3 ${
                          carouselIndex === idx ? "bg-green-600" : "bg-gray-300"
                        }`}
                      ></span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="container mx-auto mb-8 px-4 sm:mb-12">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-4 shadow-lg sm:p-6 md:p-8 dark:bg-gray-800">
          <div className="prose prose-sm dark:prose-invert sm:prose-base md:prose-lg max-w-none">
            <p className="whitespace-pre-line">{article.content}</p>

            {/* Lokasi jika ada */}
            {article.location_name && (
              <div className="mt-4 text-sm text-gray-700 sm:text-base dark:text-gray-300">
                <strong>Lokasi:</strong> {article.location_name}
              </div>
            )}

            {/* Leaflet Map jika ada koordinat */}
            {article.latitude && article.longitude && (
              <div className="mt-4">
                <div className="aspect-[16/9] w-full overflow-hidden rounded-lg">
                  <MapContainer
                    center={[article.latitude, article.longitude]}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[article.latitude, article.longitude]} />
                  </MapContainer>
                </div>
              </div>
            )}
          </div>

          {/* Author */}
          <div className="mt-6 flex items-center border-t border-gray-200 pt-6 dark:border-gray-700">
            <img
              className="h-10 w-10 rounded-full"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`}
              alt="Avatar of Author"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 sm:text-base dark:text-white">
                {article.author}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Top Button */}
      <button
        className="fixed right-6 bottom-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-100 sm:h-12 sm:w-12 dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600 sm:h-6 sm:w-6 dark:text-gray-300"
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
      </button>

      <FooterDesa />
    </div>
  );
}
