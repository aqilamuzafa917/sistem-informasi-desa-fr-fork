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
      <div className="bg-white font-sans leading-normal tracking-normal dark:bg-gray-900">
        <NavbarDesa />
        <div className="container mx-auto -mt-20 max-w-7xl px-4 pt-16 text-center md:pt-32">
          <div className="mx-auto h-8 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex flex-wrap items-center justify-center gap-2 p-4">
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="h-[70vh] w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="container mx-auto mt-3 max-w-7xl">
          <div className="mx-0 sm:mx-6">
            <div className="w-full rounded-lg bg-white p-8 md:p-24 dark:bg-gray-800">
              <div className="space-y-4">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
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
    <div className="bg-white font-sans leading-normal tracking-normal dark:bg-gray-900">
      {/* Slide in nav */}
      <div
        id="header"
        className="animated fixed top-0 z-10 hidden w-full bg-white dark:bg-gray-800"
        style={{ opacity: ".95" }}
      >
        {/* Progress bar */}
        <div
          id="progress"
          className="h-1 bg-white shadow dark:bg-gray-800"
          style={{
            background:
              "linear-gradient(to right, #4dc0b5 var(--scroll), transparent 0)",
          }}
        ></div>
      </div>

      {/* Navbar Section */}
      <NavbarDesa />

      {/* Article Header */}
      <div className="container mx-auto -mt-20 max-w-7xl px-4 pt-16 text-center md:pt-32">
        <h1 className="text-3xl font-bold break-normal text-gray-900 md:text-4xl dark:text-white">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2 p-4 text-xs">
          <p className="inline-block rounded bg-green-100 px-3 py-1 font-semibold text-green-800 dark:bg-green-900 dark:text-green-300">
            {article.date_created}
          </p>
          <span className="inline-block rounded bg-blue-100 px-3 py-1 font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {article.jenis_artikel === "resmi" ? "Resmi" : "Warga"}
          </span>
          <span className="inline-block rounded bg-gray-100 px-3 py-1 font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-200">
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

      {/* Carousel Gambar */}
      {article.media_artikel.length > 0 && (
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="relative h-[70vh] w-full overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
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
                  className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg hover:bg-white"
                  aria-label="Sebelumnya"
                >
                  &#8592;
                </button>
                <button
                  onClick={handleNext}
                  className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg hover:bg-white"
                  aria-label="Selanjutnya"
                >
                  &#8594;
                </button>
                <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                  {article.media_artikel.map((_, idx) => (
                    <span
                      key={idx}
                      className={`inline-block h-3 w-3 rounded-full ${carouselIndex === idx ? "bg-green-600" : "bg-gray-300"}`}
                    ></span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="container mx-auto mt-3 max-w-7xl">
        <div className="mx-0 sm:mx-6">
          <div
            className="w-full rounded-lg bg-white p-8 text-xl leading-normal text-gray-800 shadow-lg md:p-24 md:text-2xl dark:bg-gray-800 dark:text-gray-200"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {/* Post Content */}
            <p
              className="-mt-23 py-6 text-justify"
              style={{ whiteSpace: "pre-line" }}
            >
              {article.content}
            </p>
            {/* Lokasi jika ada */}
            {article.location_name && (
              <div className="mt-0 text-base text-gray-700 dark:text-gray-300">
                <strong>Lokasi:</strong> {article.location_name}
              </div>
            )}
            {/* Leaflet Map jika ada koordinat */}
            {article.latitude && article.longitude && (
              <div className="mt-6 mb-0">
                <div className="h-80 w-full overflow-hidden rounded-lg">
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
          <div className="-mt-10 flex w-full items-center p-8 font-sans md:p-24">
            <img
              className="mr-4 h-10 w-10 rounded-full"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`}
              alt="Avatar of Author"
            />
            <div className="flex-1">
              <p className="text-base leading-none font-bold text-gray-900 md:text-xl dark:text-white">
                {article.author}
              </p>
            </div>
            <div className="justify-end"></div>
          </div>
        </div>
      </div>

      {/* Scroll Top Button */}
      <button
        className="btn-toggle-round scroll-top js-scroll-top"
        type="button"
        title="Scroll to top"
      >
        <svg
          className="progress-circle"
          width="100%"
          height="100%"
          viewBox="-1 -1 102 102"
        >
          <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-arrow-up"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="18" y1="11" x2="12" y2="5" />
          <line x1="6" y1="11" x2="12" y2="5" />
        </svg>
      </button>

      {/* Footer */}
      <FooterDesa />

      {/* CSS untuk animasi dan scroll */}
      <style>{`
        .smooth { transition: box-shadow 0.3s ease-in-out; }
        ::selection { background-color: aliceblue }
        :root {
          ::-webkit-scrollbar { height: 10px; width: 10px; }
          ::-webkit-scrollbar-track { background: #efefef; border-radius: 6px }
          ::-webkit-scrollbar-thumb { background: #d5d5d5; border-radius: 6px }
          ::-webkit-scrollbar-thumb:hover { background: #c4c4c4 }
        }
        .scroll-top {
          position: fixed;
          z-index: 50;
          padding: 0;
          right: 30px;
          bottom: 100px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(15px);
          height: 46px;
          width: 46px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all .4s ease;
          border: none;
          box-shadow: inset 0 0 0 2px #ccc;
          color: #ccc;
          background-color: #fff;
        }
        .scroll-top.is-active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .scroll-top .icon-tabler-arrow-up {
          position: absolute;
          stroke-width: 2px;
          stroke: #333;
        }
        .scroll-top svg path {
          fill: none;
        }
        .scroll-top svg.progress-circle path {
          stroke: #333;
          stroke-width: 4;
          transition: all .4s ease;
        }
        .scroll-top:hover {
          color: var(--ghost-accent-color);
        }
        .scroll-top:hover .progress-circle path,
        .scroll-top:hover .icon-tabler-arrow-up {
          stroke: var(--ghost-accent-color);
        }
        .animated {
          animation-duration: 1s;
          animation-fill-mode: both;
        }
        .fadeOutUp {
          animation-name: fadeOutUp;
        }
        .slideInDown {
          animation-name: slideInDown;
        }
        @keyframes fadeOutUp {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
            transform: translate3d(0, -100%, 0);
          }
        }
        @keyframes slideInDown {
          from {
            transform: translate3d(0, -100%, 0);
            visibility: visible;
          }
          to {
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
