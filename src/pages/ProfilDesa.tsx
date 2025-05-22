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
} from "flowbite-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button as ButtonUI } from "@/components/ui/button";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

export default function ProfilDesa() {
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
          <NavbarLink href="/">
            Beranda
          </NavbarLink>
          <NavbarLink href="/#FiturDesa">Fitur Desa</NavbarLink>
          <NavbarLink href="/profildesa" active>Profil Desa</NavbarLink>
          <NavbarLink href="/infografis/penduduk">Infografis</NavbarLink>
          <NavbarLink href="/artikeldesa">Artikel</NavbarLink>
          <NavbarLink href="/petafasilitasdesa">Peta Fasilitas</NavbarLink>
        </NavbarCollapse>
      </Navbar>

      {/* Main Content */}

      <h1 className="mb-12 text-center text-4xl font-bold text-gray-900 dark:text-white">
        Profil Desa Batujajar Timur
      </h1>

      {/* Section Visi & Misi - Full Width */}
      <section className="bord-y-5 mb-16 w-full bg-white py-12 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Visi & Misi
          </h2>
          <div className="flex flex-col gap-8">
            {/* Visi */}
            <Card className="mx-auto max-w-7xl rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="p-8">
                <h2 className="mb-4 text-center text-3xl font-bold text-blue-700 dark:text-blue-400">
                  Visi
                </h2>
                <p className="text-center text-xl text-gray-800 dark:text-gray-200">
                  Terwujudnya Batujajar Timur sebagai desa yang mandiri,
                  sejahtera, dan berdaya saing, melalui pembangunan
                  berkelanjutan yang berpihak pada masyarakat dan lingkungan.
                </p>
              </CardContent>
            </Card>

            {/* Misi */}
            <Card className="mx-auto max-w-7xl rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="p-8">
                <h2 className="mb-4 text-center text-3xl font-bold text-blue-700 dark:text-blue-400">
                  Misi
                </h2>
                <ol className="list-disc space-y-2 pl-8 text-xl text-gray-800 dark:text-gray-200">
                  <li>
                    Meningkatkan kualitas hidup masyarakat: Melalui peningkatan
                    akses terhadap pendidikan, kesehatan, dan kebutuhan dasar
                    lainnya.
                  </li>
                  <li>
                    Meningkatkan kemandirian ekonomi masyarakat: Dengan
                    mengembangkan potensi lokal dan menciptakan lapangan kerja
                    baru.
                  </li>
                  <li>
                    Meningkatkan kualitas lingkungan: Dengan mengelola sumber
                    daya alam secara berkelanjutan dan menciptakan lingkungan
                    yang sehat.
                  </li>
                  <li>
                    Meningkatkan kualitas pemerintahan desa: Dengan pelayanan
                    yang prima, transparan, dan akuntabel.
                  </li>
                  <li>
                    Meningkatkan partisipasi masyarakat: Dengan melibatkan
                    masyarakat dalam perencanaan dan pelaksanaan pembangunan.
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Sejarah Desa - Full Width */}
      <section className="mb-16 w-full bg-sky-50 py-12 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Sejarah Desa
          </h2>
          <Card className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <CardContent className="p-0">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Sejarah Desa Batujajar Timur
              </h2>
              <div className="mb-6 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                <div className="flex h-64 items-center justify-center bg-gray-200 dark:bg-gray-600">
                  <svg
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
              </div>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section Struktur Organisasi - Full Width */}
      <section className="mb-16 w-full bg-white py-12 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Struktur Organisasi
          </h2>
          <Card className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <CardContent className="p-0">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Struktur Organisasi Desa
              </h2>
              <div className="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                <div className="flex h-96 items-center justify-center bg-gray-200 dark:bg-gray-600">
                  <svg
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    ></path>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section Peta Lokasi - Full Width */}
      <section className="mb-16 h-full w-full bg-sky-50 py-12 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Peta Lokasi
          </h2>
          <Card className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <CardContent className="p-0">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Peta Lokasi Desa
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                    Batas Desa:
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Utara
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Desa Sukaresmi
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Timur
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Desa Bojong
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Selatan
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Desa Cicadas
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Barat
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Desa Karang Nunggal Kab. Cianjur
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <div className="mb-2">
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Luas Desa:
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        13.131.900 m²
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Jumlah Penduduk
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        5.656 Jiwa
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-80 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-600">
                    <svg
                      className="h-16 w-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Footer */}
      <Footer container className="rounded-none">
        <div className="w-full">
          <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
            <div>
              <FooterBrand
                src="/path/to/logo.png"
                href="/"
                name="Desa Batujajar Timur"
              />
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
