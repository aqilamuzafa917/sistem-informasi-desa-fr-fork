import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Button as FlowbiteButton,
} from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Create a custom event for chatbot state
export const CHATBOT_MINIMIZE_EVENT = "chatbot-minimize";

export default function NavbarDesa() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFiturDesaInView, setIsFiturDesaInView] = useState(false);

  // Handle scroll position
  useEffect(() => {
    const handleScroll = () => {
      const isAtTop = window.scrollY < 100; // Consider "top" as within 100px of the top
      window.dispatchEvent(
        new CustomEvent(CHATBOT_MINIMIZE_EVENT, {
          detail: { minimize: !isAtTop },
        }),
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFiturDesaInView(entry.isIntersecting);
      },
      {
        threshold: 0.5,
        rootMargin: "-80px 0px 0px 0px",
      },
    );

    const fiturDesaElement = document.getElementById("FiturDesa");
    if (fiturDesaElement) {
      observer.observe(fiturDesaElement);
    }

    return () => {
      if (fiturDesaElement) {
        observer.unobserve(fiturDesaElement);
      }
    };
  }, []);

  const handleFiturDesaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("FiturDesa");
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <Navbar
      fluid
      rounded
      className="sticky top-0 z-50 mb-5 border-y-2 transition-all duration-300 ease-in-out"
    >
      <NavbarBrand href="/">
        <span className="self-center text-xl font-semibold whitespace-nowrap transition-colors duration-300 ease-in-out hover:text-blue-600 dark:text-white">
          Desa Batujajar Timur
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <FlowbiteButton className="transition-all duration-300 ease-in-out hover:scale-105 active:scale-95">
          Hubungi Kami
        </FlowbiteButton>
        <NavbarToggle className="transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95" />
      </div>
      <NavbarCollapse>
        <NavbarLink
          href="/"
          active={
            location.pathname === "/" && !location.hash && !isFiturDesaInView
          }
          className="transition-all duration-300 ease-in-out hover:scale-105 hover:text-blue-600"
        >
          Beranda
        </NavbarLink>
        <NavbarLink
          href="/#FiturDesa"
          active={isFiturDesaInView}
          onClick={handleFiturDesaClick}
        >
          Fitur Desa
        </NavbarLink>
        <NavbarLink
          href="/profildesa"
          active={location.pathname === "/profildesa"}
        >
          Profil Desa
        </NavbarLink>
        <NavbarLink
          href="/infografis/penduduk"
          active={location.pathname.startsWith("/infografis")}
        >
          Infografis
        </NavbarLink>
        <NavbarLink
          href="/artikeldesa"
          active={location.pathname === "/artikeldesa"}
        >
          Artikel
        </NavbarLink>
        <NavbarLink
          href="/petafasilitasdesa"
          active={location.pathname === "/petafasilitasdesa"}
        >
          Peta Fasilitas
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
