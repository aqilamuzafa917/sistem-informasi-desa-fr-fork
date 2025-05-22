import { useState } from "react";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
  Table,
  Spinner,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
} from "flowbite-react";
import { Card } from "@/components/ui/card";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";

export default function CekStatusSuratPage() {
  const [nik, setNik] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState("");

  // Contoh data status surat (dalam implementasi nyata, ini akan diambil dari API)
  const dummyData = [
    {
      id: "SK001",
      jenis_surat: "SK Pindah",
      tanggal_pengajuan: "2023-06-15",
      status: "Disetujui",
      keterangan: "Surat dapat diambil di kantor desa",
    },
    {
      id: "SK002",
      jenis_surat: "SK Domisili",
      tanggal_pengajuan: "2023-06-18",
      status: "Dalam Proses",
      keterangan: "Sedang ditinjau oleh kepala desa",
    },
    {
      id: "SK003",
      jenis_surat: "SK Tidak Mampu",
      tanggal_pengajuan: "2023-06-20",
      status: "Ditolak",
      keterangan: "Data tidak lengkap, silakan ajukan ulang",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNik(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setStatusData(null);

    if (!nik || nik.length < 16) {
      setError("NIK harus terdiri dari 16 digit");
      return;
    }

    setIsLoading(true);

    // Simulasi pemanggilan API dengan setTimeout
    setTimeout(() => {
      // Dalam implementasi nyata, ini akan diganti dengan panggilan API
      // const response = await fetch(`/api/status-surat?nik=${nik}`);
      // const data = await response.json();

      // Simulasi data berdasarkan NIK terakhir
      const lastDigit = parseInt(nik.slice(-1));
      if (lastDigit >= 0 && lastDigit < dummyData.length) {
        setStatusData(dummyData[lastDigit] as any);
      } else {
        setStatusData(null);
      }

      setIsLoading(false);
    }, 1000);
  };

  const renderStatusBadge = (status: string) => {
    let color = "";
    switch (status) {
      case "Disetujui":
        color = "success";
        break;
      case "Dalam Proses":
        color = "warning";
        break;
      case "Ditolak":
        color = "failure";
        break;
      default:
        color = "info";
    }
    return (
      <span
        className={`bg-${color}-100 text-${color}-800 rounded-full px-2.5 py-0.5 text-xs font-medium dark:bg-${color}-900 dark:text-${color}-300`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
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
          <NavbarLink href="/#FiturDesa" active>
            Fitur Desa
          </NavbarLink>
          <NavbarLink href="/profildesa">Profil Desa</NavbarLink>
          <NavbarLink href="/infografis/penduduk">Infografis</NavbarLink>
          <NavbarLink href="/artikeldesa">Artikel</NavbarLink>
          <NavbarLink href="/petafasilitasdesa">Peta Fasilitas</NavbarLink>
        </NavbarCollapse>
      </Navbar>

      <div className="container mx-auto flex-grow px-4 py-8">
        <Card className="p-6">
          <h2 className="mb-6 text-2xl font-bold">Cek Status Surat</h2>
          <p className="mb-6 text-gray-600">
            Silakan masukkan NIK Anda untuk melihat status pengajuan surat.
            Sistem akan menampilkan semua pengajuan surat yang terkait dengan
            NIK tersebut beserta status prosesnya.
          </p>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">NIK</label>
              <div className="flex">
                <input
                  type="text"
                  className="w-full rounded-l-md border p-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Masukkan 16 digit NIK"
                  value={nik}
                  onChange={handleInputChange}
                  maxLength={16}
                  pattern="\d*"
                  required
                />
                <button
                  type="submit"
                  className="rounded-r-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner size="sm" /> : "Cek Status"}
                </button>
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
          </form>

          {isLoading && (
            <div className="py-8 text-center">
              <Spinner size="xl" />
              <p className="mt-2 text-gray-600">Memuat data...</p>
            </div>
          )}

          {!isLoading && statusData && (
            <div className="overflow-hidden rounded-md border">
              <Table hoverable>
                <TableHead>
                  <TableHeadCell>ID Surat</TableHeadCell>
                  <TableHeadCell>Jenis Surat</TableHeadCell>
                  <TableHeadCell>Tanggal Pengajuan</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Keterangan</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell>{(statusData as any).id}</TableCell>
                    <TableCell>{(statusData as any).jenis_surat}</TableCell>
                    <TableCell>
                      {(statusData as any).tanggal_pengajuan}
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge((statusData as any).status)}
                    </TableCell>
                    <TableCell>{(statusData as any).keterangan}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading &&
            statusData &&
            Array.isArray(statusData) &&
            (statusData as any[]).length === 0 && (
              <div className="rounded-md border py-8 text-center text-gray-600">
                Tidak ada pengajuan surat yang terkait dengan NIK tersebut.
              </div>
            )}

          {!isLoading && !statusData && !error && (
            <div className="rounded-md border py-8 text-center text-gray-600">
              Masukkan NIK Anda untuk melihat status pengajuan surat.
            </div>
          )}
        </Card>
      </div>

      <Footer container className="mt-auto rounded-none">
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
    </div>
  );
}
