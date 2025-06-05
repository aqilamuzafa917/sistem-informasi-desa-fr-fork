import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Article {
  id_artikel: number;
  jenis_artikel: string;
  status_artikel: string;
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

interface EnhancedCarouselProps {
  articles?: Article[];
  loading?: boolean;
}

const EnhancedCarousel = ({
  articles = [],
  loading = false,
}: EnhancedCarouselProps) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const slideInterval = 5000;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  }, [articles.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || isHovered || loading || articles.length <= 1) return;

    const interval = setInterval(nextSlide, slideInterval);
    return () => clearInterval(interval);
  }, [isPlaying, isHovered, loading, nextSlide, articles.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, isPlaying]);

  // Reset slide when articles change
  useEffect(() => {
    setCurrentSlide(0);
  }, [articles]);

  if (loading) {
    return (
      <div className="container mx-auto mb-12 px-4">
        <div className="h-72 overflow-hidden rounded-xl bg-gray-100 sm:h-96 md:h-[400px] lg:h-[500px] xl:h-[550px] 2xl:h-[600px] dark:bg-gray-800">
          <img
            src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
            alt="Loading placeholder"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="container mx-auto mb-12 px-4">
        <div className="h-72 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 sm:h-96 md:h-[400px] lg:h-[500px] xl:h-[550px] 2xl:h-[600px] dark:from-gray-800 dark:to-gray-900">
          <div className="flex h-full w-full items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="mb-4 text-4xl">📰</div>
              <p className="text-lg font-medium">No articles available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mb-12 px-4">
      <div
        className="group relative h-72 overflow-hidden rounded-xl shadow-2xl sm:h-96 md:h-[400px] lg:h-[500px] xl:h-[550px] 2xl:h-[600px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="region"
        aria-label="Article carousel"
      >
        {/* Main carousel container */}
        <div className="relative h-full w-full">
          {articles.map((article, index) => (
            <div
              key={article.id_artikel}
              className={`absolute inset-0 transform transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? "translate-x-0 scale-100 opacity-100"
                  : index < currentSlide
                    ? "-translate-x-full scale-95 opacity-0"
                    : "translate-x-full scale-95 opacity-0"
              }`}
              aria-hidden={index !== currentSlide}
            >
              {/* Background image with parallax effect */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={
                    (article.media_artikel && article.media_artikel[0]?.url) ||
                    "https://flowbite.com/docs/images/carousel/carousel-1.svg"
                  }
                  alt={article.judul_artikel}
                  className={`h-full w-full object-cover transition-transform duration-[10s] ease-out ${
                    index === currentSlide ? "scale-110" : "scale-105"
                  }`}
                  loading={index <= 1 ? "eager" : "lazy"}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://flowbite.com/docs/images/carousel/carousel-1.svg";
                  }}
                />
              </div>

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>

              {/* Content */}
              <div className="absolute right-0 bottom-0 left-0 p-6 md:p-8 lg:p-10">
                <div className="max-w-4xl">
                  <h3 className="mb-3 text-xl leading-tight font-bold text-white drop-shadow-lg md:mb-4 md:text-2xl lg:text-4xl xl:text-5xl">
                    {article.judul_artikel}
                  </h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-gray-200 drop-shadow md:text-base lg:text-lg">
                    {article.isi_artikel && article.isi_artikel.length > 180
                      ? `${article.isi_artikel.substring(0, 180)}...`
                      : article.isi_artikel || "No content available..."}
                  </p>

                  {/* Read more button */}
                  <button
                    className="mt-4 rounded-full border border-white/30 bg-white/20 px-6 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30 md:mt-6 md:text-base"
                    onClick={() => {
                      navigate(`/artikeldesa/${article.id_artikel}`);
                    }}
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {articles.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full border border-white/30 bg-white/20 p-3 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-white/30 focus:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full border border-white/30 bg-white/20 p-3 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-white/30 focus:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </>
        )}

        {/* Play/Pause button */}
        {articles.length > 1 && (
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 rounded-full border border-white/30 bg-white/20 p-2 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-white/30 focus:opacity-100"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Indicators */}
        {articles.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Progress bar */}
        {articles.length > 1 && isPlaying && !isHovered && (
          <div className="absolute bottom-0 left-0 h-1 bg-white/30">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: `${((currentSlide + 1) / articles.length) * 100}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Article counter */}
      {articles.length > 1 && (
        <div className="mt-4 flex justify-center text-sm text-gray-600 dark:text-gray-400">
          <span>
            {currentSlide + 1} of {articles.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default EnhancedCarousel;
