export interface DesaData {
  id: number;
  nama_desa: string;
  sejarah: string;
  tradisi_budaya: string;
  visi: string;
  misi: string;
  peta_lokasi: string;
  alamat_kantor: string;
  struktur_organisasi: {
    path: string;
    type: string;
    name: string;
    url: string;
  }[];
  batas_wilayah: {
    utara: string;
    timur: string;
    selatan: string;
    barat: string;
  };
  luas_desa: number;
  social_media: {
    platform: string;
    url: string;
    username: string;
  }[];
  polygon_desa: [number, number][];
}

export interface DetailPendapatan {
  "Pendapatan Asli Desa": string;
  "Pendapatan Transfer": string;
  "Pendapatan Lain-lain": string | number;
}

export interface DetailBelanja {
  "Belanja Barang/Jasa": string;
  "Belanja Modal": string;
  "Belanja Tak Terduga": string;
}

export interface APBDesaData {
  tahun_anggaran: number;
  total_pendapatan: string;
  total_belanja: string;
  saldo_sisa: string;
  detail_pendapatan: DetailPendapatan;
  detail_belanja: DetailBelanja;
}

export interface APBDesaResponse {
  status: string;
  data: APBDesaData[];
}

export interface Article {
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

export interface ArticleResponse {
  status: string;
  data: {
    current_page: number;
    data: Article[];
    last_page: number;
    total: number;
    per_page: number;
  };
}

export interface PendudukStats {
  total_penduduk: number;
  total_laki_laki: number;
  total_perempuan: number;
  total_kk: number;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      gender: string;
      jumlah: number;
      percentage: number;
    };
  }>;
}
