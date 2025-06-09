import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

import { API_CONFIG } from "@/config/api";
import { DesaData } from "@/types/desa";

import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import SejarahSection from "@/components/profil/SejarahSection";
import VisiMisiSection from "@/components/profil/VisiMisiSection";
import StrukturOrganisasiSection from "@/components/profil/StrukturOrganisasiSection";
import PetaLokasiSection from "@/components/profil/PetaLokasiSection";
import LoadingSkeleton from "@/components/profil/LoadingSkeleton";
import ErrorState from "@/components/profil/ErrorState";

const ProfileMap = dynamic(() => import("@/components/profil/ProfileMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
  ),
});

const fetchDesaData = async (): Promise<DesaData> => {
  try {
    const response = await axios.get(
      `${API_CONFIG.baseURL}/api/publik/profil-desa/1`,
      { headers: API_CONFIG.headers },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching desa data:", error);
    throw new Error("Failed to fetch village profile data.");
  }
};

export default function ProfilDesaPage() {
  const { data, isLoading, isError, error } = useQuery<DesaData>({
    queryKey: ["desaProfil"],
    queryFn: fetchDesaData,
    retry: 1,
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <ErrorState message={error.message} />;
  }

  if (!data) {
    return <ErrorState message="No data available" />;
  }

  const polygonCoordinates =
    data.polygon_desa?.map(
      (coord) => [coord[1], coord[0]] as [number, number],
    ) ?? [];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <NavbarDesa />

      {/* Enhanced Header Section */}
      <div className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20"></div>

        {/* Header Content */}
        <div className="relative px-8 py-12 text-center">
          {/* Decorative Elements */}
          <div className="absolute top-2 left-8 h-16 w-16 rounded-full bg-blue-100 opacity-60 blur-xl dark:bg-blue-900/30"></div>
          <div className="absolute top-4 right-12 h-12 w-12 rounded-full bg-indigo-100 opacity-40 blur-lg dark:bg-indigo-900/30"></div>

          {/* Main Title */}
          <div className="relative">
            <div className="mb-2 inline-flex items-center justify-center">
              <div className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500"></div>
              <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                Profil Desa
              </span>
              <div className="ml-2 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500"></div>
            </div>

            <h1 className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400">
              {" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400">
                {data.nama_desa.toUpperCase()}
              </span>
            </h1>

            <div className="mx-auto mt-3 max-w-2xl">
              <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                Kenali lebih dalam tentang sejarah, visi misi, dan struktur
                organisasi desa kami
              </p>
            </div>
          </div>
        </div>
      </div>

      <VisiMisiSection visi={data.visi} misi={data.misi} />

      <SejarahSection namaDesa={data.nama_desa} sejarah={data.sejarah} />

      <StrukturOrganisasiSection
        namaDesa={data.nama_desa}
        strukturOrganisasiUrl={data.struktur_organisasi?.[0]?.url}
      />

      <PetaLokasiSection
        batasWilayah={data.batas_wilayah}
        luasDesa={data.luas_desa}
        alamatKantor={data.alamat_kantor}
      >
        {polygonCoordinates.length > 0 && (
          <ProfileMap
            polygon={polygonCoordinates}
            popupData={{
              namaDesa: data.nama_desa,
              alamatKantor: data.alamat_kantor,
              luasDesa: data.luas_desa,
            }}
          />
        )}
      </PetaLokasiSection>

      <FooterDesa />
    </main>
  );
}
