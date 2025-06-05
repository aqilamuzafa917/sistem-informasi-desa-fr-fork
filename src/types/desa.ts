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
