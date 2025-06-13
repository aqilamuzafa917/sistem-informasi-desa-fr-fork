import { useState, useEffect } from "react";
import axios from "axios";
import { API_CONFIG } from "../config/api";

interface PendudukData {
  nama: string;
}

export const usePenduduk = (nik: string) => {
  const [penduduk, setPenduduk] = useState<PendudukData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset states when NIK is empty
    if (!nik) {
      setPenduduk(null);
      setError(null);
      return;
    }

    // Validate NIK length
    if (nik.length > 16) {
      setError("NIK harus 16 digit");
      setPenduduk(null);
      return;
    }

    if (nik.length < 16 && nik.length > 0) {
      setError(`NIK harus 16 digit (${nik.length}/16)`);
      setPenduduk(null);
      return;
    }

    // Only proceed with API call if NIK is exactly 16 digits
    if (nik.length === 16) {
      const fetchPenduduk = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await axios.get(
            `${API_CONFIG.baseURL}/api/publik/penduduk/${nik}`,
            { headers: API_CONFIG.headers },
          );
          setPenduduk(response.data);
        } catch {
          setError("NIK tidak ditemukan");
          setPenduduk(null);
        } finally {
          setLoading(false);
        }
      };

      const debounceTimer = setTimeout(fetchPenduduk, 500); // Debounce 500ms
      return () => clearTimeout(debounceTimer);
    }
  }, [nik]);

  return { penduduk, loading, error };
};
