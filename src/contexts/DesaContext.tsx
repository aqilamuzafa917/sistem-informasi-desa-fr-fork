import * as React from "react";
import axios from "axios";
import { API_CONFIG } from "@/config/api";

interface DesaConfig {
  kode: string;
  nama_kabupaten: string;
  nama_kecamatan: string;
  nama_desa: string;
  alamat_desa: string;
  kode_pos: string;
  nama_provinsi: string;
  jabatan_kepala: string;
  nama_kepala_desa: string;
  jabatan_ttd: string;
  nama_pejabat_ttd: string;
  nip_pejabat_ttd: string;
  logo_desa: string;
  sosial_media: string;
  website_desa: string;
  email_desa: string;
  telepon_desa: string;
  center_map?: [number, number];
}

interface DesaContextType {
  desaConfig: DesaConfig | null;
  loading: boolean;
  fetchDesaConfig: () => Promise<void>;
}

const DesaContext = React.createContext<DesaContextType | undefined>(undefined);

const STORAGE_KEY = "desa_config";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function DesaProvider({ children }: { children: React.ReactNode }) {
  const [desaConfig, setDesaConfig] = React.useState<DesaConfig | null>(() => {
    // Try to get cached data from localStorage
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        // Check if cache is still valid
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      } catch (e) {
        console.error("Error parsing cached desa config:", e);
      }
    }
    return null;
  });

  const [loading, setLoading] = React.useState(!desaConfig);

  const fetchDesaConfig = React.useCallback(async () => {
    // Don't fetch if we have valid cached data
    if (desaConfig) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_CONFIG.baseURL}/api/publik/desa-config`,
        {
          headers: API_CONFIG.headers,
        },
      );
      const data = response.data;
      setDesaConfig(data);

      // Cache the data with timestamp
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      console.error("Error fetching desa config:", error);
    } finally {
      setLoading(false);
    }
  }, [desaConfig]);

  React.useEffect(() => {
    fetchDesaConfig();
  }, [fetchDesaConfig]);

  return (
    <DesaContext.Provider value={{ desaConfig, loading, fetchDesaConfig }}>
      {children}
    </DesaContext.Provider>
  );
}

export function useDesa() {
  const context = React.useContext(DesaContext);
  if (context === undefined) {
    throw new Error("useDesa must be used within a DesaProvider");
  }
  return context;
}
