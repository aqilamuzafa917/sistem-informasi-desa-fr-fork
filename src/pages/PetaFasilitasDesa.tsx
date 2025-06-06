import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
// Memperbaiki masalah icon Leaflet di React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { useDesa } from "@/contexts/DesaContext";

// Definisi tipe untuk data fasilitas
interface Fasilitas {
  id: number;
  nama: string;
  kategori: "sekolah" | "ibadah" | "kesehatan" | "lainnya";
  alamat: string;
  latitude: number;
  longitude: number;
  deskripsi?: string;
}

export default function PetaFasilitasDesa() {
  const { desaConfig } = useDesa();

  // Fix untuk icon Leaflet di React
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  }, []);

  // State untuk kategori yang aktif
  const [activeCategories, setActiveCategories] = React.useState<{
    sekolah: boolean;
    ibadah: boolean;
    kesehatan: boolean;
    lainnya: boolean;
  }>({
    sekolah: true,
    ibadah: true,
    kesehatan: true,
    lainnya: true,
  });

  // Data fasilitas desa (contoh data)
  const fasilitasDesa: Fasilitas[] = [
    {
      id: 1,
      nama: `SDN ${desaConfig?.nama_desa} 01`,
      kategori: "sekolah",
      alamat: `${desaConfig?.alamat_desa}`,
      latitude: -6.9123,
      longitude: 107.4567,
      deskripsi: "Sekolah Dasar Negeri",
    },
    {
      id: 2,
      nama: `SMPN 1 ${desaConfig?.nama_kecamatan}`,
      kategori: "sekolah",
      alamat: `${desaConfig?.alamat_desa}`,
      latitude: -6.9125,
      longitude: 107.4569,
      deskripsi: "Sekolah Menengah Pertama Negeri",
    },
    {
      id: 3,
      nama: `Masjid ${desaConfig?.nama_desa}`,
      kategori: "ibadah",
      alamat: `${desaConfig?.alamat_desa}`,
      latitude: -6.9127,
      longitude: 107.4571,
      deskripsi: "Masjid Jami",
    },
    {
      id: 4,
      nama: `Puskesmas ${desaConfig?.nama_desa}`,
      kategori: "kesehatan",
      alamat: `${desaConfig?.alamat_desa}`,
      latitude: -6.9129,
      longitude: 107.4573,
      deskripsi: "Pusat Kesehatan Masyarakat",
    },
    {
      id: 5,
      nama: `Kantor Desa ${desaConfig?.nama_desa}`,
      kategori: "lainnya",
      alamat: `${desaConfig?.alamat_desa}`,
      latitude: -6.9131,
      longitude: 107.4575,
      deskripsi: "Kantor Pemerintahan Desa",
    },
    {
      id: 6,
      nama: "Klinik Sehat",
      kategori: "kesehatan",
      alamat: "Jl. Sehat No. 22",
      latitude: -6.9145,
      longitude: 107.5059,
      deskripsi: "Klinik Pratama",
    },
    {
      id: 7,
      nama: "Lapangan Sepak Bola",
      kategori: "lainnya",
      alamat: "Jl. Olahraga No. 5",
      latitude: -6.9135,
      longitude: 107.5069,
      deskripsi: "Fasilitas Olahraga",
    },
  ];

  // Fungsi untuk mendapatkan icon berdasarkan kategori
  const getMarkerIcon = (kategori: string) => {
    let iconColor = "";

    switch (kategori) {
      case "sekolah":
        iconColor = "green";
        break;
      case "ibadah":
        iconColor = "blue";
        break;
      case "kesehatan":
        iconColor = "red";
        break;
      case "lainnya":
        iconColor = "orange";
        break;
      default:
        iconColor = "gray";
    }

    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  // Toggle kategori
  const toggleCategory = (kategori: keyof typeof activeCategories) => {
    setActiveCategories((prev) => ({
      ...prev,
      [kategori]: !prev[kategori],
    }));
  };

  // Filter fasilitas berdasarkan kategori yang aktif
  const filteredFasilitas = fasilitasDesa.filter(
    (fasilitas) => activeCategories[fasilitas.kategori],
  );

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar Section */}
      <NavbarDesa />

      <div className="container mx-auto px-4">
        {/* Judul Halaman */}
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-bold text-blue-600 sm:text-4xl dark:text-blue-400">
            PETA FASILITAS DESA {desaConfig?.nama_desa?.toUpperCase()}
          </h1>
          <p className="mt-2 text-base text-gray-600 sm:text-lg dark:text-gray-400">
            Informasi lokasi fasilitas desa dalam bentuk peta interaktif
          </p>
        </div>

        {/* Filter Kategori */}
        <div className="mb-6 flex flex-wrap justify-center gap-2 sm:mb-8 sm:gap-4">
          <button
            onClick={() => toggleCategory("sekolah")}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base ${activeCategories.sekolah ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
          >
            <div className="h-2 w-2 rounded-full bg-green-600 sm:h-3 sm:w-3"></div>
            Sekolah
          </button>
          <button
            onClick={() => toggleCategory("ibadah")}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base ${activeCategories.ibadah ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
          >
            <div className="h-2 w-2 rounded-full bg-blue-600 sm:h-3 sm:w-3"></div>
            Tempat Ibadah
          </button>
          <button
            onClick={() => toggleCategory("kesehatan")}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base ${activeCategories.kesehatan ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
          >
            <div className="h-2 w-2 rounded-full bg-red-600 sm:h-3 sm:w-3"></div>
            Kesehatan
          </button>
          <button
            onClick={() => toggleCategory("lainnya")}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base ${activeCategories.lainnya ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
          >
            <div className="h-2 w-2 rounded-full bg-orange-600 sm:h-3 sm:w-3"></div>
            Fasilitas Lainnya
          </button>
        </div>

        {/* Peta */}
        <div className="z-0 mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm sm:mb-8 dark:border-gray-700 dark:bg-gray-800">
          <div className="z-0 h-[400px] w-full sm:h-[500px] md:h-[600px]">
            <MapContainer
              center={[-6.9175, 107.5019]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredFasilitas.map((fasilitas) => (
                <Marker
                  key={fasilitas.id}
                  position={[fasilitas.latitude, fasilitas.longitude]}
                  icon={getMarkerIcon(fasilitas.kategori)}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {fasilitas.nama}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {fasilitas.alamat}
                      </p>
                      {fasilitas.deskripsi && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {fasilitas.deskripsi}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Daftar Fasilitas */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Sekolah */}
          <div
            className={`overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800 ${!activeCategories.sekolah ? "opacity-50" : ""}`}
          >
            <h3 className="mb-3 text-xl font-bold text-gray-800 sm:mb-4 sm:text-2xl dark:text-white">
              Sekolah
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {fasilitasDesa
                .filter((f) => f.kategori === "sekolah")
                .map((fasilitas) => (
                  <div
                    key={fasilitas.id}
                    className="rounded-lg border border-gray-200 bg-gray-100 p-2.5 sm:p-3 dark:border-gray-700 dark:bg-gray-900"
                  >
                    <h4 className="text-sm font-semibold text-gray-700 sm:text-base dark:text-gray-300">
                      {fasilitas.nama}
                    </h4>
                    <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                      {fasilitas.alamat}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Tempat Ibadah */}
          <div
            className={`overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800 ${!activeCategories.ibadah ? "opacity-50" : ""}`}
          >
            <h3 className="mb-3 text-xl font-bold text-gray-800 sm:mb-4 sm:text-2xl dark:text-white">
              Tempat Ibadah
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {fasilitasDesa
                .filter((f) => f.kategori === "ibadah")
                .map((fasilitas) => (
                  <div
                    key={fasilitas.id}
                    className="rounded-lg border border-gray-200 bg-gray-100 p-2.5 sm:p-3 dark:border-gray-700 dark:bg-gray-900"
                  >
                    <h4 className="text-sm font-semibold text-gray-700 sm:text-base dark:text-gray-300">
                      {fasilitas.nama}
                    </h4>
                    <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                      {fasilitas.alamat}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Kesehatan */}
          <div
            className={`overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800 ${!activeCategories.kesehatan ? "opacity-50" : ""}`}
          >
            <h3 className="mb-3 text-xl font-bold text-gray-800 sm:mb-4 sm:text-2xl dark:text-white">
              Kesehatan
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {fasilitasDesa
                .filter((f) => f.kategori === "kesehatan")
                .map((fasilitas) => (
                  <div
                    key={fasilitas.id}
                    className="rounded-lg border border-gray-200 bg-gray-100 p-2.5 sm:p-3 dark:border-gray-700 dark:bg-gray-900"
                  >
                    <h4 className="text-sm font-semibold text-gray-700 sm:text-base dark:text-gray-300">
                      {fasilitas.nama}
                    </h4>
                    <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                      {fasilitas.alamat}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Fasilitas Lainnya */}
          <div
            className={`overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800 ${!activeCategories.lainnya ? "opacity-50" : ""}`}
          >
            <h3 className="mb-3 text-xl font-bold text-gray-800 sm:mb-4 sm:text-2xl dark:text-white">
              Fasilitas Lainnya
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {fasilitasDesa
                .filter((f) => f.kategori === "lainnya")
                .map((fasilitas) => (
                  <div
                    key={fasilitas.id}
                    className="rounded-lg border border-gray-200 bg-gray-100 p-2.5 sm:p-3 dark:border-gray-700 dark:bg-gray-900"
                  >
                    <h4 className="text-sm font-semibold text-gray-700 sm:text-base dark:text-gray-300">
                      {fasilitas.nama}
                    </h4>
                    <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                      {fasilitas.alamat}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <FooterDesa />
    </main>
  );
}
