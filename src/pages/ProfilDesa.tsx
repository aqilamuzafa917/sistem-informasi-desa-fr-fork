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

      <header className="py-12">
        <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900 md:text-5xl dark:text-white">
          Profil {data.nama_desa}
        </h1>
      </header>

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
