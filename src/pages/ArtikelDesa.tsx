import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Button as FlowbiteButton,
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
  Card,
} from "flowbite-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";

export default function ArtikelDesa() {
  // Sample articles data - in a real app, this would come from an API
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "Festival Panen Desa",
      date: "10 Juni, 2023",
      excerpt:
        "Festival panen tahunan kami merayakan kelimpahan tanah kami dan kerja keras para petani...",
      category: "Acara",
      image: "https://flowbite.com/docs/images/blog/image-1.jpg",
    },
    {
      id: 2,
      title: "Pembukaan Balai Desa Baru",
      date: "15 Mei, 2023",
      excerpt:
        "Balai desa yang telah lama ditunggu akhirnya akan membuka pintunya bulan depan, menyediakan ruang untuk...",
      category: "Berita",
      image: "https://flowbite.com/docs/images/blog/image-2.jpg",
    },
    {
      id: 3,
      title: "Workshop Anyaman Tradisional",
      date: "22 April, 2023",
      excerpt:
        "Pelajari seni anyaman bambu kuno dari tetua desa dalam workshop praktik ini...",
      category: "Budaya",
      image: "https://flowbite.com/docs/images/blog/image-3.jpg",
    },
    {
      id: 4,
      title: "Rencana Pembangunan Desa 2023-2025",
      date: "30 Maret, 2023",
      excerpt:
        "Dewan desa telah menyetujui rencana pembangunan baru yang berfokus pada infrastruktur, pendidikan, dan...",
      category: "Pemerintahan",
      image: "https://flowbite.com/docs/images/blog/image-4.jpg",
    },
    {
      id: 5,
      title: "Sorotan Kuliner Lokal: Resep Kue Beras",
      date: "12 Maret, 2023",
      excerpt:
        "Temukan rahasia di balik kue beras terkenal desa kami dengan resep tradisional ini...",
      category: "Budaya",
      image: "https://flowbite.com/docs/images/blog/image-5.jpg",
    },
    {
      id: 6,
      title: "Hasil Turnamen Olahraga Pemuda",
      date: "28 Februari, 2023",
      excerpt:
        "Turnamen olahraga pemuda tahunan berakhir dengan pertandingan yang menarik dan rekor desa baru...",
      category: "Acara",
      image: "https://flowbite.com/docs/images/blog/image-6.jpg",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Filter articles based on search term and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [
    "Semua",
    ...new Set(articles.map((article) => article.category)),
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar Section */}
      <Navbar fluid rounded className="mb-8 border-y-2">
        <NavbarBrand href="/">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Desa Batujajar Timur
          </span>
        </NavbarBrand>
        <div className="flex md:order-2">
          <FlowbiteButton>Hubungi Kami</FlowbiteButton>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="/">Beranda</NavbarLink>
          <NavbarLink href="/#FiturDesa">Fitur Desa</NavbarLink>
          <NavbarLink href="/profildesa">Profil Desa</NavbarLink>
          <NavbarLink href="/infografis/penduduk">Infografis</NavbarLink>
          <NavbarLink href="/artikeldesa" active>
            Artikel
          </NavbarLink>
          <NavbarLink href="/petafasilitasdesa">Peta Fasilitas</NavbarLink>
        </NavbarCollapse>
      </Navbar>

      <main className="container mx-auto px-6 py-2">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Artikel Desa
          </h1>
          <Button onClick={() => (window.location.href = "/artikeldesa/buat")}>
            Buat Artikel Baru
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-10 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="relative w-full md:w-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <Input
                placeholder="Cari artikel..."
                className="rounded-lg border-gray-200 pl-10 dark:border-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex w-full flex-wrap gap-2 md:w-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  className={
                    selectedCategory === category
                      ? "bg-green-600 hover:bg-green-700"
                      : "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid gap-x-40 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="max-w-sm"
                imgAlt={article.title}
                imgSrc={article.image}
                theme={{
                  img: {
                    base: "h-48 w-full object-cover",
                  },
                }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {article.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1 h-4 w-4"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {article.date}
                  </div>
                </div>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {article.title}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {article.excerpt}
                </p>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() =>
                      (window.location.href = `/artikeldesa/${article.id}`)
                    }
                  >
                    Baca Selengkapnya
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto h-12 w-12 text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Tidak ada artikel ditemukan
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Coba ubah filter pencarian Anda atau pilih kategori yang berbeda.
            </p>
          </div>
        )}
      </main>

      {/* Footer Section */}
      <Footer container className="mt-16">
        <div className="w-full">
          <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
            <div>
              <FooterBrand
                href="/"
                src="https://flowbite.com/docs/images/logo.svg"
                alt="Flowbite Logo"
                name="Desa Batujajar Timur"
              />
            </div>
            <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
              <div>
                <FooterTitle title="Tentang" />
                <FooterLinkGroup col>
                  <FooterLink href="#">Profil Desa</FooterLink>
                  <FooterLink href="#">Visi & Misi</FooterLink>
                </FooterLinkGroup>
              </div>
              <div>
                <FooterTitle title="Layanan" />
                <FooterLinkGroup col>
                  <FooterLink href="#">Pengajuan Surat</FooterLink>
                  <FooterLink href="#">Pengaduan</FooterLink>
                </FooterLinkGroup>
              </div>
              <div>
                <FooterTitle title="Legal" />
                <FooterLinkGroup col>
                  <FooterLink href="#">Kebijakan Privasi</FooterLink>
                  <FooterLink href="#">Syarat & Ketentuan</FooterLink>
                </FooterLinkGroup>
              </div>
            </div>
          </div>
          <FooterDivider />
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <FooterCopyright href="#" by="Desa Batujajar Timur" year={2023} />
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
