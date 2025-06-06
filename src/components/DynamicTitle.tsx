import { useEffect } from "react";
import { useDesa } from "@/contexts/DesaContext";
import { useLocation } from "react-router-dom";

export default function DynamicTitle() {
  const { desaConfig } = useDesa();
  const location = useLocation();

  useEffect(() => {
    const getPageTitle = (path: string) => {
      // Remove leading slash and split path
      const pathParts = path.slice(1).split("/");

      // Map path to readable title
      const titleMap: { [key: string]: string } = {
        "": "Beranda",
        profildesa: "Profil Desa",
        pengajuansurat: "Pengajuan Surat",
        cekstatussurat: "Cek Status Surat",
        artikeldesa: "Artikel Desa",
        infografis: {
          penduduk: "Infografis Penduduk",
          apbdesa: "Infografis APB Desa",
          idm: "Infografis IDM",
        },
        petafasilitasdesa: "Peta Fasilitas Desa",
        login: "Login",
        dashboard: "Dashboard",
        surat: "Surat",
        skpindah: "SK Pindah",
        skdomisili: "SK Domisili",
        skkematian: "SK Kematian",
        skkelahiran: "SK Kelahiran",
        skusaha: "SK Usaha",
        sktidakmampu: "SK Tidak Mampu",
        sktmkip: "SKTM KIP",
        skkehilanganktp: "SK Kehilangan KTP",
        skkehilangankk: "SK Kehilangan KK",
        skumum: "SK Umum",
        suratcreate: "Buat Surat",
        profil: "Profil",
        artikel: "Artikel",
        pendapatan: "Pendapatan",
        belanja: "Belanja",
        peta: "Peta",
        dataktp: "Data KTP",
        datakk: "Data KK",
        pengaduan: "Pengaduan",
        configdesa: "Konfigurasi Desa",
      };

      // Handle nested routes (like infografis/penduduk)
      if (pathParts.length > 1) {
        const mainPath = pathParts[0];
        const subPath = pathParts[1];
        if (typeof titleMap[mainPath] === "object") {
          return titleMap[mainPath][subPath] || titleMap[mainPath];
        }
      }

      // Return the title for the current path or default to the path itself
      return titleMap[pathParts[0]] || pathParts[0];
    };

    const pageTitle = getPageTitle(location.pathname);
    const desaName = desaConfig?.nama_desa || "Desa";

    document.title = `${pageTitle} - Sistem Informasi ${desaName}`;
  }, [desaConfig?.nama_desa, location.pathname]);

  return null;
}
