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
        url: "/admin/dashboard",
        icon: House,
        isActive: currentPath === "/admin/dashboard",
      },
    ],
    navSurat: [
      {
        title: "Surat",
        url: "/admin/surat",
        icon: Files,
        isActive: currentPath.includes("/sk"),
      },
    ],
    navProfil: [
      {
        title: "Profil Desa",
        url: "/admin/profil",
        icon: AppWindow,
        isActive: currentPath === "/admin/profil",
      },
    ],
    navArtikel: [
      {
        title: "Artikel Desa",
        url: "/admin/artikel",
        icon: Images,
        isActive: currentPath === "/admin/artikel",
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
            url: "/admin/pendapatan",
            isActive: currentPath === "/admin/pendapatan",
          },
          {
            title: "Belanja Desa",
            url: "/admin/belanja",
            isActive: currentPath === "/admin/belanja",
          },
          {
            title: "Peta Fasilitas",
            url: "/admin/peta",
            isActive: currentPath === "/admin/peta",
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
            url: "/admin/dataktp",
            isActive: currentPath === "/admin/dataktp",
          },
          {
            title: "Data KK",
            url: "/admin/datakk",
            isActive: currentPath === "/admin/datakk",
          },
        ],
      },
    ],
    navPengaduan: [
      {
        title: "Pengaduan Warga",
        url: "/admin/pengaduan",
        icon: MessageCircleWarning,
        isActive: currentPath === "/admin/pengaduan",
      },
    ],
    navConfigDesa: [
      {
        title: "Konfigurasi Website",
        url: "/admin/configdesa",
        icon: Bolt,
        isActive: currentPath === "/admin/configdesa",
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
              <a href="/admin/dashboard">
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
