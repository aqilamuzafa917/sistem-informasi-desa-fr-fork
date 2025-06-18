import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_CONFIG } from "@/config/api";

// Define interfaces
interface SuratResponseData {
  id_surat: number;
  status_surat: string;
}

interface ArtikelListResponseData {
  id_artikel: number;
  status_artikel: string;
}

interface PengaduanResponseData {
  id: string;
  status: string;
}

interface DetailPendapatan {
  "Pendapatan Asli Desa": string;
  "Pendapatan Transfer": string | number;
  "Pendapatan Lain-lain": string | number;
}

interface DetailBelanja {
  "Belanja Barang/Jasa": string;
  "Belanja Modal": string | number;
  "Belanja Tak Terduga": string | number;
}

interface APBDesaResponseData {
  tahun_anggaran: number;
  total_pendapatan: string;
  total_belanja: string;
  saldo_sisa: string;
  detail_pendapatan: DetailPendapatan;
  detail_belanja: DetailBelanja;
}

interface IDMResponseData {
  id: number;
  tahun: number;
  skor_idm: number;
  status_idm: string;
  target_status: string;
  skor_minimal: number;
  penambahan: number;
  komponen: {
    skorIKE: number;
    skorIKS: number;
    skorIKL: number;
  };
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  surat: {
    total: number;
    diajukan: number;
  };
  artikel: {
    total: number;
    diajukan: number;
  };
  pengaduan: {
    total: number;
    diajukan: number;
  };
  keuangan: {
    pendapatan: number;
    belanja: number;
    saldo: number;
    tahun: number;
  };
  idm: {
    skor: number;
    status: string;
    target: string;
    skorMinimal: number;
    tahun: number;
    komponen: {
      skorIKE: number;
      skorIKS: number;
      skorIKL: number;
    };
  };
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardStats> => {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const headers = {
        ...API_CONFIG.headers,
        Authorization: `Bearer ${token}`,
      };

      // Parallel API calls for better performance
      const [
        suratResponse,
        artikelListResponse,
        artikelStatsResponse,
        pengaduanResponse,
        keuanganResponse,
        idmResponse,
      ] = await Promise.all([
        axios.get<{ data: SuratResponseData[] }>(
          `${API_CONFIG.baseURL}/api/surat`,
          { headers },
        ),
        axios.get<{
          data: { data: ArtikelListResponseData[]; total: number };
        }>(`${API_CONFIG.baseURL}/api/artikel`, { headers }),
        axios.get<{
          data: { diajukan: number };
        }>(`${API_CONFIG.baseURL}/api/artikel/stats`, { headers }),
        axios.get<{ data: PengaduanResponseData[] } | PengaduanResponseData[]>(
          `${API_CONFIG.baseURL}/api/pengaduan`,
          { headers },
        ),
        axios.get<{
          data: APBDesaResponseData[];
        }>(`${API_CONFIG.baseURL}/api/publik/apbdesa/multi-tahun`, { headers }),
        axios.get<IDMResponseData[]>(
          `${API_CONFIG.baseURL}/api/publik/idm-stats`,
          { headers },
        ),
      ]);

      // Process Surat Stats
      const suratData = suratResponse.data?.data || [];
      const totalSurat = suratData.length;
      const suratDiajukan = suratData.filter(
        (surat: SuratResponseData) => surat.status_surat === "Diajukan",
      ).length;

      // Process Artikel Stats
      const totalArtikel = artikelListResponse.data?.data?.total || 0;
      const artikelDiajukan = artikelStatsResponse.data?.data?.diajukan || 0;

      // Process Pengaduan Stats
      const rawPengaduanData = pengaduanResponse.data;
      const pengaduanData: PengaduanResponseData[] = Array.isArray(
        rawPengaduanData,
      )
        ? rawPengaduanData
        : rawPengaduanData?.data || [];
      const totalPengaduan = pengaduanData.length;
      const pengaduanDiajukan = pengaduanData.filter(
        (pengaduan: PengaduanResponseData) => pengaduan.status === "Diajukan",
      ).length;

      // Process Keuangan Stats
      const keuanganData: APBDesaResponseData[] =
        keuanganResponse.data?.data || [];
      if (!Array.isArray(keuanganData) || keuanganData.length === 0) {
        throw new Error("Data keuangan tidak ditemukan");
      }

      const latestYearData = keuanganData.sort(
        (a: APBDesaResponseData, b: APBDesaResponseData) =>
          b.tahun_anggaran - a.tahun_anggaran,
      )[0];
      if (!latestYearData) {
        throw new Error("Data keuangan tahun terbaru tidak ditemukan");
      }

      // Process IDM Stats
      const idmData: IDMResponseData[] = idmResponse.data || [];
      if (!Array.isArray(idmData) || idmData.length === 0) {
        throw new Error("Data IDM tidak ditemukan");
      }

      const latestIdmData = idmData.sort(
        (a: IDMResponseData, b: IDMResponseData) => b.tahun - a.tahun,
      )[0];
      if (!latestIdmData) {
        throw new Error("Data IDM tahun terbaru tidak ditemukan");
      }

      return {
        surat: {
          total: totalSurat,
          diajukan: suratDiajukan,
        },
        artikel: {
          total: totalArtikel,
          diajukan: artikelDiajukan,
        },
        pengaduan: {
          total: totalPengaduan,
          diajukan: pengaduanDiajukan,
        },
        keuangan: {
          pendapatan: parseFloat(latestYearData.total_pendapatan || "0"),
          belanja: parseFloat(latestYearData.total_belanja || "0"),
          saldo: parseFloat(latestYearData.saldo_sisa || "0"),
          tahun: latestYearData.tahun_anggaran,
        },
        idm: {
          skor: parseFloat(latestIdmData.skor_idm.toFixed(4)),
          status: latestIdmData.status_idm,
          target: latestIdmData.target_status,
          skorMinimal: parseFloat(latestIdmData.skor_minimal.toFixed(4)),
          tahun: latestIdmData.tahun,
          komponen: {
            skorIKE: parseFloat(latestIdmData.komponen.skorIKE.toFixed(4)),
            skorIKS: parseFloat(latestIdmData.komponen.skorIKS.toFixed(4)),
            skorIKL: parseFloat(latestIdmData.komponen.skorIKL.toFixed(4)),
          },
        },
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
