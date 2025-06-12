// HomePage.tsx untuk Sistem Informasi Desa Bajujajar Timur
import * as React from "react";
import NavbarDesa, { CHATBOT_MINIMIZE_EVENT } from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import EnhancedCarousel from "@/components/EnhancedCarousel";
import { PengaduanPopup } from "@/components/PengaduanPopup";

// Import new components
import { FiturDesaSection } from "@/components/pages/home/FiturDesaSection";
import { InfografisDesaSection } from "@/components/pages/home/InfografisDesaSection";
import { APBDesaSection } from "@/components/pages/home/APBDesaSection";
import { IdmSection } from "@/components/pages/home/IdmSection";
import { useHomePage } from "@/contexts/HomePageContext";

export default function HomePage() {
  const [isPengaduanOpen, setIsPengaduanOpen] = React.useState(false);
  const { articles, isLoading } = useHomePage();

  const handlePengaduanClick = () => {
    const event = new CustomEvent(CHATBOT_MINIMIZE_EVENT, {
      detail: { minimize: true },
    });
    window.dispatchEvent(event);
    setIsPengaduanOpen(true);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-[#00b4d8] to-[#48cc6c] opacity-10" />
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
