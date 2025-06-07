// HomePage.tsx untuk Sistem Informasi Desa Bajujajar Timur
import * as React from "react";
import axios from "axios";
import NavbarDesa, { CHATBOT_MINIMIZE_EVENT } from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import EnhancedCarousel from "@/components/EnhancedCarousel";
import { PengaduanPopup } from "@/components/PengaduanPopup";
import { API_CONFIG } from "@/config/api";
import { Article, ArticleResponse } from "@/types/desa";

// Import new components
import { FiturDesaSection } from "@/components/pages/home/FiturDesaSection";
import { InfografisDesaSection } from "@/components/pages/home/InfografisDesaSection";
import { APBDesaSection } from "@/components/pages/home/APBDesaSection";
import { IdmSection } from "@/components/pages/home/IdmSection";

export default function HomePage() {
  const [isPengaduanOpen, setIsPengaduanOpen] = React.useState(false);
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch data that's needed at the top level (e.g., carousel)
  React.useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ArticleResponse>(
          `${API_CONFIG.baseURL}/api/publik/artikel`,
          { headers: API_CONFIG.headers },
        );
        if (response.data.status === "success") {
          const officialArticles = response.data.data.data
            .filter((article) => article.jenis_artikel === "resmi")
            .slice(0, 5);
          setArticles(officialArticles);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handlePengaduanClick = () => {
    const event = new CustomEvent(CHATBOT_MINIMIZE_EVENT, {
      detail: { minimize: true },
    });
    window.dispatchEvent(event);
    setIsPengaduanOpen(true);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <NavbarDesa />
      <EnhancedCarousel articles={articles} loading={isLoading} />

      {/* Use the new components */}
      <FiturDesaSection
        loading={isLoading}
        onPengaduanClick={handlePengaduanClick}
      />

      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Infografis Desa
            </h2>
          </div>
          <InfografisDesaSection />
          <APBDesaSection />
          <IdmSection loading={isLoading} />
        </div>
      </section>

      <FooterDesa />
      <PengaduanPopup
        isOpen={isPengaduanOpen}
        onClose={() => setIsPengaduanOpen(false)}
      />
    </main>
  );
}
