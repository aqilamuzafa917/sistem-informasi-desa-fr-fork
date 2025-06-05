import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Button as FlowbiteButton,
} from "flowbite-react";
import { useLocation } from "react-router-dom";

export default function NavbarDesa() {
  const location = useLocation();

  return (
    <Navbar fluid rounded className="sticky top-0 z-50 mb-5 border-y-2">
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
        <NavbarLink
          href="/"
          active={location.pathname === "/" && !location.hash}
        >
          Beranda
        </NavbarLink>
        <NavbarLink href="#FiturDesa" active={location.hash === "#FiturDesa"}>
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
