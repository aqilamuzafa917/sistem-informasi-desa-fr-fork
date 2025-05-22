import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "flowbite-react";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";

// Tipe data untuk artikel
interface Article {
  id: number;
  title: string;
  content: string;
  date_created: string;
  author: string;
  image: string;
}

export default function ArtikelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi fetch data artikel berdasarkan ID
    // Dalam implementasi nyata, ini akan memanggil API
    const fetchArticle = async () => {
      setLoading(true);
      try {
        // Contoh data artikel
        const dummyArticle: Article = {
          id: parseInt(id || "1"),
          title: "Rencana Pembangunan Desa 2023-2025",
          content:
            "Dewan desa telah menyetujui rencana pembangunan baru yang berfokus pada infrastruktur, pendidikan, dan kesehatan masyarakat. Rencana ini akan diimplementasikan selama tiga tahun ke depan dengan anggaran yang telah dialokasikan dari dana desa dan bantuan pemerintah provinsi. Beberapa proyek utama termasuk perbaikan jalan desa, pembangunan pusat kesehatan masyarakat, dan renovasi sekolah dasar. Partisipasi masyarakat sangat diharapkan dalam pelaksanaan program-program ini untuk memastikan keberhasilan dan keberlanjutan pembangunan desa kita.",
          date_created: "30 Maret, 2023",
          author: "Admin Desa",
          image: "https://flowbite.com/docs/images/blog/image-2.jpg",
        };

        setArticle(dummyArticle);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Fungsi untuk mengatur progress bar saat scroll
  useEffect(() => {
    const h = document.documentElement;
    const b = document.body;
    const progress = document.querySelector("#progress");
    const header = document.getElementById("header");

    const handleScroll = () => {
      // Refresh scroll % width
      const scroll =
        ((h.scrollTop || b.scrollTop) /
          ((h.scrollHeight || b.scrollHeight) - h.clientHeight)) *
        100;
      if (progress) {
        (progress as HTMLElement).style.setProperty("--scroll", `${scroll}%`);
      }

      // Apply classes for slide in bar
      const scrollpos = window.scrollY;
      if (header) {
        if (scrollpos > 100) {
          header.classList.remove("hidden");
          header.classList.remove("fadeOutUp");
          header.classList.add("slideInDown");
        } else {
          header.classList.remove("slideInDown");
          header.classList.add("fadeOutUp");
          header.classList.add("hidden");
        }
      }
    };

    document.addEventListener("scroll", handleScroll);

    // Scroll to top functionality
    const scrollTopBtn = document.querySelector(".js-scroll-top");
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });

      const scrollTopPath = document.querySelector(".scroll-top path");
      if (scrollTopPath) {
        const pathLength = (
          scrollTopPath as SVGGeometryElement
        ).getTotalLength();
        (scrollTopPath as SVGElement).style.transition = (
          scrollTopPath as SVGElement
        ).style.webkitTransition = "none";
        (scrollTopPath as SVGElement).style.strokeDasharray =
          `${pathLength} ${pathLength}`;
        (scrollTopPath as SVGElement).style.strokeDashoffset =
          pathLength.toString();
        scrollTopPath.getBoundingClientRect(); // Trigger reflow
        (scrollTopPath as SVGElement).style.transition = (
          scrollTopPath as SVGElement
        ).style.webkitTransition = "stroke-dashoffset 10ms linear";
        (scrollTopPath as SVGElement).style.strokeDashoffset = "0";
      }
    }

    return () => {
      document.removeEventListener("scroll", handleScroll);
      if (scrollTopBtn) {
        scrollTopBtn.removeEventListener("click", () => {});
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-900">
        <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
          Artikel tidak ditemukan
        </h1>
        <a href="/artikeldesa" className="text-green-500 hover:underline">
          Kembali ke daftar artikel
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white font-sans leading-normal tracking-normal dark:bg-gray-900">
      {/* Slide in nav */}
      <div
        id="header"
        className="animated fixed top-0 z-10 hidden w-full bg-white dark:bg-gray-800"
        style={{ opacity: ".95" }}
      >
        {/* Progress bar */}
        <div
          id="progress"
          className="h-1 bg-white shadow dark:bg-gray-800"
          style={{
            background:
              "linear-gradient(to right, #4dc0b5 var(--scroll), transparent 0)",
          }}
        ></div>
      </div>

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
          <NavbarLink href="#FiturDesa">Fitur Desa</NavbarLink>
          <NavbarLink href="/profildesa">Profil Desa</NavbarLink>
          <NavbarLink href="/infografis/penduduk">Infografis</NavbarLink>
          <NavbarLink href="/artikeldesa" active>
            Artikel
          </NavbarLink>
          <NavbarLink href="/petafasilitasdesa">Peta Fasilitas</NavbarLink>
        </NavbarCollapse>
      </Navbar>

      {/* Article Header */}
      <div className="pt-16 text-center md:pt-32">
        <p className="text-sm font-bold text-green-500 md:text-base">
          {article.date_created}
        </p>
        <h1 className="text-3xl font-bold break-normal text-gray-900 md:text-5xl dark:text-white">
          {article.title}
        </h1>
      </div>

      {/* Article Image */}
      <div
        className="container mx-auto mt-8 w-full max-w-6xl rounded-lg bg-white bg-cover shadow-lg dark:bg-gray-800"
        style={{ backgroundImage: `url('${article.image}')`, height: "75vh" }}
      ></div>

      {/* Article Content */}
      <div className="container mx-auto -mt-32 max-w-5xl">
        <div className="mx-0 sm:mx-6">
          <div
            className="w-full rounded-lg bg-white p-8 text-xl leading-normal text-gray-800 shadow-lg md:p-24 md:text-2xl dark:bg-gray-800 dark:text-gray-200"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {/* Post Content */}
            <h3 className="text-3xl font-bold dark:text-white">
              {article.title}
            </h3>
            <p className="py-6">{article.content}</p>
          </div>

          {/* Author */}
          <div className="flex w-full items-center p-8 font-sans md:p-24">
            <img
              className="mr-4 h-10 w-10 rounded-full"
              src="http://i.pravatar.cc/300"
              alt="Avatar of Author"
            />
            <div className="flex-1">
              <p className="text-base leading-none font-bold text-gray-900 md:text-xl dark:text-white">
                {article.author}
              </p>
            </div>
            <div className="justify-end"></div>
          </div>
        </div>
      </div>

      {/* Scroll Top Button */}
      <button
        className="btn-toggle-round scroll-top js-scroll-top"
        type="button"
        title="Scroll to top"
      >
        <svg
          className="progress-circle"
          width="100%"
          height="100%"
          viewBox="-1 -1 102 102"
        >
          <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-arrow-up"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="18" y1="11" x2="12" y2="5" />
          <line x1="6" y1="11" x2="12" y2="5" />
        </svg>
      </button>

      {/* Footer */}
      <Footer container className="rounded-none bg-white dark:bg-gray-900">
        <div className="w-full text-center">
          <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
            <FooterBrand
              href="/"
              src="/flowbite-react.svg"
              alt="Flowbite Logo"
              name="Desa Batujajar Timur"
            />
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <FooterIcon href="#" icon={BsFacebook} />
              <FooterIcon href="#" icon={BsInstagram} />
              <FooterIcon href="#" icon={BsTwitter} />
              <FooterIcon href="#" icon={BsGithub} />
              <FooterIcon href="#" icon={BsDribbble} />
            </div>
          </div>
          <FooterDivider />
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <FooterCopyright href="#" by="Desa Batujajar Timur" year={2023} />
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <FooterLink href="#">Tentang</FooterLink>
              <FooterLink href="#">Kebijakan Privasi</FooterLink>
              <FooterLink href="#">Lisensi</FooterLink>
              <FooterLink href="#">Kontak</FooterLink>
            </div>
          </div>
        </div>
      </Footer>

      {/* CSS untuk animasi dan scroll */}
      <style>{`
        .smooth { transition: box-shadow 0.3s ease-in-out; }
        ::selection { background-color: aliceblue }
        :root {
          ::-webkit-scrollbar { height: 10px; width: 10px; }
          ::-webkit-scrollbar-track { background: #efefef; border-radius: 6px }
          ::-webkit-scrollbar-thumb { background: #d5d5d5; border-radius: 6px }
          ::-webkit-scrollbar-thumb:hover { background: #c4c4c4 }
        }
        .scroll-top {
          position: fixed;
          z-index: 50;
          padding: 0;
          right: 30px;
          bottom: 100px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(15px);
          height: 46px;
          width: 46px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all .4s ease;
          border: none;
          box-shadow: inset 0 0 0 2px #ccc;
          color: #ccc;
          background-color: #fff;
        }
        .scroll-top.is-active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .scroll-top .icon-tabler-arrow-up {
          position: absolute;
          stroke-width: 2px;
          stroke: #333;
        }
        .scroll-top svg path {
          fill: none;
        }
        .scroll-top svg.progress-circle path {
          stroke: #333;
          stroke-width: 4;
          transition: all .4s ease;
        }
        .scroll-top:hover {
          color: var(--ghost-accent-color);
        }
        .scroll-top:hover .progress-circle path,
        .scroll-top:hover .icon-tabler-arrow-up {
          stroke: var(--ghost-accent-color);
        }
        .animated {
          animation-duration: 1s;
          animation-fill-mode: both;
        }
        .fadeOutUp {
          animation-name: fadeOutUp;
        }
        .slideInDown {
          animation-name: slideInDown;
        }
        @keyframes fadeOutUp {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
            transform: translate3d(0, -100%, 0);
          }
        }
        @keyframes slideInDown {
          from {
            transform: translate3d(0, -100%, 0);
            visibility: visible;
          }
          to {
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
