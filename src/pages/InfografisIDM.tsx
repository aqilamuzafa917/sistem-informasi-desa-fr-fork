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
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InfografisIDM() {
  // Data untuk IDM
  const desaNama = "Batujajar Timur";
  const kecamatan = "Batujajar";
  const kabupaten = "Bandung Barat";
  const provinsi = "Jawa Barat";
  
  // Data IDM
  const tahun = "2024";
  const skorIDM = "0.7925";
  const statusIDM = "MAJU";
  const targetStatus = "MANDIRI";
  const skorMinimal = "0.8156";
  const penambahan = "0.0231";
  
  // Data komponen IDM
  const skorIKS = "0.7943"; // Indeks Ketahanan Sosial
  const skorIKE = "0.7167"; // Indeks Ketahanan Ekonomi
  const skorIKL = "0.8667"; // Indeks Ketahanan Ekologi/Lingkungan

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
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
          <NavbarLink href="/infografis/penduduk" active>
            Infografis
          </NavbarLink>
          <NavbarLink href="/artikeldesa">Artikel</NavbarLink>
          <NavbarLink href="/petafasilitasdesa">Peta Fasilitas</NavbarLink>
        </NavbarCollapse>
      </Navbar>

      {/* Main Content */}
      <div className="container mx-auto px-4">
         {/* Judul Halaman */}
         <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            INFOGRAFIS DESA BATUJAJAR TIMUR
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Informasi statistik dan data desa dalam bentuk visual
          </p>
        </div>

        {/* Navigasi Tab */}
        <div className="mb-8 flex flex-wrap justify-center gap-8">
          <a href="/Infografis/penduduk" className="flex flex-col items-center">
            <div className="flex flex-col items-center">
              <div className="mb-2 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
                <svg
                  className="h-6 w-6 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Penduduk
              </span>
            </div>
          </a>

          <a href="/Infografis/apbdesa" className="flex flex-col items-center">
            <div className="mb-2 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
              <svg
                className="h-6 w-6 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              APBDes
            </span>
          </a>

          <a href="/Infografis/idm" className="flex flex-col items-center">
            <div className="flex flex-col items-center">
              <div className="mb-2 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
                <svg
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                IDM
              </span>
              <div className="mt-1 h-1 w-16 rounded-full bg-blue-600 dark:bg-blue-400"></div>
            </div>
          </a>
        </div>

         {/* Judul Demografi */}
         <div className="mb-8 px-4 py-8">
         <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
          Indeks Desa Membangun (IDM)
          </h2>
          <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">
          Indeks Desa Membangun (IDM) merupakan indeks komposit yang dibentuk dari tiga indeks,
          yaitu Indeks Ketahanan Sosial, Indeks Ketahanan Ekonomi, dan Indeks Ketahanan Ekologi/Lingkungan.
          </p>
        </div>
        </div>

        {/* Konten IDM */} 
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Skor dan Status IDM */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>SKOR IDM {tahun}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-5xl font-bold text-gray-700 dark:text-gray-300">{skorIDM}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>STATUS IDM {tahun}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-5xl font-bold text-gray-700 dark:text-gray-300">{statusIDM}</p>
              </CardContent>
            </Card>
          </div>

          {/* Target, Skor Minimal, dan Penambahan */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Target Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-3xl font-bold text-gray-700 dark:text-gray-300">{targetStatus}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Skor Minimal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-3xl font-bold text-gray-700 dark:text-gray-300">{skorMinimal}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Penambahan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-3xl font-bold text-gray-700 dark:text-gray-300">{penambahan}</p>
              </CardContent>
            </Card>
          </div>

          {/* Komponen IDM: IKS, IKE, IKL */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Skor IKS</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-3xl font-bold text-gray-700 dark:text-gray-300">{skorIKS}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Skor IKE</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-3xl font-bold text-gray-700 dark:text-gray-300">{skorIKE}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Skor IKL</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-3xl font-bold text-gray-700 dark:text-gray-300">{skorIKL}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>


      {/* Footer */}
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
    </div>
  );
}