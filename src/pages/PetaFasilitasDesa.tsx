import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Button,
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import * as React from "react";
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from "react-icons/bs";
import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Memperbaiki masalah icon Leaflet di React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

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
  // Fix untuk icon Leaflet di React
  React.useEffect(() => {
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
      nama: "SDN Batujajar Timur 01",
      kategori: "sekolah",
      alamat: "Jl. Raya Batujajar No. 123",
      latitude: -6.9175,
      longitude: 107.5019,
      deskripsi: "Sekolah Dasar Negeri",
    },
    {
      id: 2,
      nama: "SMPN 1 Batujajar",
      kategori: "sekolah",
      alamat: "Jl. Pendidikan No. 45",
      latitude: -6.9165,
      longitude: 107.5039,
      deskripsi: "Sekolah Menengah Pertama Negeri",
    },
    {
      id: 3,
      nama: "Masjid Graha Kencana Batujajar",
      kategori: "ibadah",
      alamat: "Batujajar Tim., Kec. Batujajar, Kabupaten Bandung Barat, Jawa Barat 40561",
      latitude: -6.9169971822642795, 
      longitude: 107.50462633385881,
      deskripsi: "Masjid Jami",
    },
    {
      id: 4,
      nama: "Gereja Santo Paulus",
      kategori: "ibadah",
      alamat: "Jl. Gereja No. 8",
      latitude: -6.9195,
      longitude: 107.5049,
      deskripsi: "Gereja Katolik",
    },
    {
      id: 5,
      nama: "Puskesmas Batujajar",
      kategori: "kesehatan",
      alamat: "Jl. Kesehatan No. 15",
      latitude: -6.9155,
      longitude: 107.5009,
      deskripsi: "Pusat Kesehatan Masyarakat",
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
      nama: "Kantor Desa Batujajar Timur",
      kategori: "lainnya",
      alamat: "Jl. Raya Batujajar No. 1",
      latitude: -6.9175,
      longitude: 107.5000,
      deskripsi: "Kantor Pemerintahan Desa",
    },
    {
      id: 8,
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
    let iconUrl = "";
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
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  // Toggle kategori
  const toggleCategory = (kategori: keyof typeof activeCategories) => {
    setActiveCategories(prev => ({
      ...prev,
      [kategori]: !prev[kategori],
    }));
  };

  // Filter fasilitas berdasarkan kategori yang aktif
  const filteredFasilitas = fasilitasDesa.filter(
    (fasilitas) => activeCategories[fasilitas.kategori]
  );

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar Section */}
      <Navbar fluid rounded className="mb-8 border-y-2">
        <NavbarBrand href="/">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Desa Batujajar Timur
          </span>
        </NavbarBrand>
        <div className="flex md:order-2">
          <Button>Hubungi Kami</Button>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="/">Beranda</NavbarLink>
          <NavbarLink href="/#FiturDesa">Fitur Desa</NavbarLink>
          <NavbarLink href="/profildesa">Profil Desa</NavbarLink>
          <NavbarLink href="/infografis/penduduk">Infografis</NavbarLink>
          <NavbarLink href="/artikeldesa">Artikel</NavbarLink>
          <NavbarLink href="/petafasilitas" active>Peta Fasilitas</NavbarLink>
        </NavbarCollapse>
      </Navbar>

      <div className="container mx-auto px-4">
        {/* Judul Halaman */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            PETA FASILITAS DESA BATUJAJAR TIMUR
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Informasi lokasi fasilitas desa dalam bentuk peta interaktif
          </p>
        </div>

        {/* Filter Kategori */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => toggleCategory("sekolah")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 ${activeCategories.sekolah ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
          >
            <div className="h-3 w-3 rounded-full bg-green-600"></div>
            Sekolah
          </button>
          <button
            onClick={() => toggleCategory("ibadah")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 ${activeCategories.ibadah ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
          >
            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
            Tempat Ibadah
          </button>
          <button
            onClick={() => toggleCategory("kesehatan")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 ${activeCategories.kesehatan ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
          >
            <div className="h-3 w-3 rounded-full bg-red-600"></div>
            Kesehatan
          </button>
          <button
            onClick={() => toggleCategory("lainnya")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 ${activeCategories.lainnya ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
          >
            <div className="h-3 w-3 rounded-full bg-orange-600"></div>
            Fasilitas Lainnya
          </button>
        </div>

        {/* Peta */}
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="h-[600px] w-full">
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
                    <div>
                      <h3 className="font-bold">{fasilitas.nama}</h3>
                      <p className="text-sm text-gray-600">{fasilitas.alamat}</p>
                      {fasilitas.deskripsi && (
                        <p className="mt-1 text-sm">{fasilitas.deskripsi}</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Daftar Fasilitas */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Sekolah */}
          <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${!activeCategories.sekolah ? 'opacity-50' : ''}`}>
            <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
              Sekolah
            </h3>
            <div className="space-y-3">
              {fasilitasDesa
                .filter((f) => f.kategori === "sekolah")
                .map((fasilitas) => (
                  <div key={fasilitas.id} className="rounded-lg border border-gray-200 bg-gray-100 p-3 dark:border-gray-700 dark:bg-gray-900">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                      {fasilitas.nama}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {fasilitas.alamat}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Tempat Ibadah */}
          <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${!activeCategories.ibadah ? 'opacity-50' : ''}`}>
            <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
              Tempat Ibadah
            </h3>
            <div className="space-y-3">
              {fasilitasDesa
                .filter((f) => f.kategori === "ibadah")
                .map((fasilitas) => (
                  <div key={fasilitas.id} className="rounded-lg border border-gray-200 bg-gray-100 p-3 dark:border-gray-700 dark:bg-gray-900">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                      {fasilitas.nama}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {fasilitas.alamat}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Kesehatan */}
          <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${!activeCategories.kesehatan ? 'opacity-50' : ''}`}>
            <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
              Kesehatan
            </h3>
            <div className="space-y-3">
              {fasilitasDesa
                .filter((f) => f.kategori === "kesehatan")
                .map((fasilitas) => (
                  <div key={fasilitas.id} className="rounded-lg border border-gray-200 bg-gray-100 p-3 dark:border-gray-700 dark:bg-gray-900">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                      {fasilitas.nama}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {fasilitas.alamat}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Fasilitas Lainnya */}
          <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${!activeCategories.lainnya ? 'opacity-50' : ''}`}>
            <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
              Fasilitas Lainnya
            </h3>
            <div className="space-y-3">
              {fasilitasDesa
                .filter((f) => f.kategori === "lainnya")
                .map((fasilitas) => (
                  <div key={fasilitas.id} className="rounded-lg border border-gray-200 bg-gray-100 p-3 dark:border-gray-700 dark:bg-gray-900">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                      {fasilitas.nama}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {fasilitas.alamat}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <Footer container className="rounded-none">
        <div className="w-full">
          <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
            <div>
              <FooterBrand href="/" src="" name="Desa Batujajar Timur" />
            </div>
            <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
              <div>
                <FooterTitle title="Tentang" />
                <FooterLinkGroup col>
                  <FooterLink href="/profildesa">Profil Desa</FooterLink>
                  <FooterLink href="#">Visi & Misi</FooterLink>
                </FooterLinkGroup>
              </div>
              <div>
                <FooterTitle title="Ikuti Kami" />
                <FooterLinkGroup col>
                  <FooterLink href="#">Facebook</FooterLink>
                  <FooterLink href="#">Instagram</FooterLink>
                </FooterLinkGroup>
              </div>
              <div>
                <FooterTitle title="Informasi" />
                <FooterLinkGroup col>
                  <FooterLink href="#">Kontak</FooterLink>
                  <FooterLink href="#">Layanan</FooterLink>
                </FooterLinkGroup>
              </div>
            </div>
          </div>
          <FooterDivider />
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <FooterCopyright href="/" by="Desa Batujajar Timur™" year={2023} />
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <FooterIcon href="#" icon={BsFacebook} />
              <FooterIcon href="#" icon={BsInstagram} />
              <FooterIcon href="#" icon={BsTwitter} />
              <FooterIcon href="#" icon={BsGithub} />
              <FooterIcon href="#" icon={BsDribbble} />
            </div>
          </div>
        </div>
      </Footer>
    </main>
  );
}