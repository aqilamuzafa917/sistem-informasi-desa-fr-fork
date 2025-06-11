import * as React from "react";
import { useLocation } from "react-router-dom";
import {
  AppWindow,
  ChartNoAxesColumnIncreasing,
  Files,
  House,
  Images,
  MessageCircleWarning,
  Users,
  Bolt,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavPenduduk } from "./nav-penduduk";
import { NavInfografis } from "./nav-infografis";
import { useDesa } from "@/contexts/DesaContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  const { desaConfig } = useDesa();

  // This is sample data with isActive based on current path
  const data = {
    navDashboard: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: House,
        isActive: currentPath === "/dashboard",
      },
    ],
    navSurat: [
      {
        title: "Surat",
        url: "/surat",
        icon: Files,
        isActive: currentPath.includes("/sk"),
        items: [
          {
            title: "SK Pindah",
            url: "/skpindah",
            isActive: currentPath === "/skpindah",
          },
          {
            title: "SK Domisili",
            url: "/skdomisili",
            isActive: currentPath === "/skdomisili",
          },
          {
            title: "SK Kematian",
            url: "/skkematian",
            isActive: currentPath === "/skkematian",
          },
          {
            title: "SK Kelahiran",
            url: "/skKelahiran",
            isActive: currentPath === "/skkelahiran",
          },
          {
            title: "SK Usaha",
            url: "/skusaha",
            isActive: currentPath === "/skusaha",
          },
          {
            title: "SK Tidak Mampu",
            url: "/sktidakmampu",
            isActive: currentPath === "/sktidakmampu",
          },
          {
            title: "SKTM KIP",
            url: "/sktmkip",
            isActive: currentPath === "/sktmkip",
          },
          {
            title: "SK Kehilangan KTP",
            url: "/skkehilanganktp",
            isActive: currentPath === "/skkehilanganktp",
          },
          {
            title: "SK Kehilangan KK",
            url: "/skkehilangankk",
            isActive: currentPath === "/skkehilangankk",
          },
          {
            title: "SK Umum",
            url: "/skumum",
            isActive: currentPath === "/skumum",
          },
        ],
      },
    ],
    navProfil: [
      {
        title: "Profil Desa",
        url: "/profil",
        icon: AppWindow,
        isActive: currentPath === "/profil",
      },
    ],
    navArtikel: [
      {
        title: "Artikel Desa",
        url: "/artikel",
        icon: Images,
        isActive: currentPath === "/artikel",
      },
    ],
    navInfografis: [
      {
        title: "Infografis Desa",
        url: "#",
        icon: ChartNoAxesColumnIncreasing,
        isActive: ["/pendapatan", "/belanja", "/peta"].includes(currentPath),
        items: [
          {
            title: "Pendapatan Desa",
            url: "/pendapatan",
            isActive: currentPath === "/pendapatan",
          },
          {
            title: "Belanja Desa",
            url: "/belanja",
            isActive: currentPath === "/belanja",
          },
          {
            title: "Peta Fasilitas",
            url: "/peta",
            isActive: currentPath === "/peta",
          },
        ],
      },
    ],
    navPenduduk: [
      {
        title: "Penduduk",
        url: "#",
        icon: Users,
        isActive: ["/dataktp", "/datakk"].includes(currentPath),
        items: [
          {
            title: "Data KTP",
            url: "/dataktp",
            isActive: currentPath === "/dataktp",
          },
          {
            title: "Data KK",
            url: "/datakk",
            isActive: currentPath === "/datakk",
          },
        ],
      },
    ],
    navPengaduan: [
      {
        title: "Pengaduan Warga",
        url: "/pengaduan",
        icon: MessageCircleWarning,
        isActive: currentPath === "/pengaduan",
      },
    ],
    navConfigDesa: [
      {
        title: "Config Web",
        url: "/configdesa",
        icon: Bolt,
        isActive: currentPath === "/configdesa",
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <span className="text-sm font-semibold">
                  Admin Desa {desaConfig?.nama_desa}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.navDashboard.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <a href={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {data.navSurat.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <a href={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {data.navProfil.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <a href={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <NavPenduduk items={data.navPenduduk} />
          {data.navArtikel.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <a href={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <NavInfografis items={data.navInfografis} />
          {data.navPengaduan.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <a href={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {data.navConfigDesa.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <a href={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
