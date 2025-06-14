import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  AppWindow,
  ChartNoAxesColumnIncreasing,
  Files,
  House,
  Images,
  MessageCircleWarning,
  Bolt,
  User,
  ShieldUser,
  Map,
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
import { NavInfografis } from "./nav-infografis";
import { useDesa } from "@/contexts/DesaContext";
import { NavPeta } from "./nav-peta";

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
            title: "IDM",
            url: "/admin/idm",
            isActive: currentPath === "/admin/idm",
          },
        ],
      },
    ],
    navPeta: [
      {
        title: "Peta Desa",
        url: "#",
        icon: Map,
        isActive: ["/petafasilitas", "/petapotensi"].includes(currentPath),
        items: [
          {
            title: "Peta Fasilitas",
            url: "/admin/petafasilitas",
            isActive: currentPath === "/admin/petafasilitas",
          },
          {
            title: "Peta Potensi",
            url: "/admin/petapotensi",
            isActive: currentPath === "/admin/petapotensi",
          },
        ],
      },
    ],
    navPenduduk: [
      {
        title: "Penduduk",
        url: "/admin/penduduk",
        icon: User,
        isActive: currentPath === "/admin/penduduk",
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
    navUser: [
      {
        title: "Kelola User",
        url: "/admin/user",
        icon: ShieldUser,
        isActive: currentPath === "/admin/user",
      },
    ],
    navChatBot: [
      {
        title: "Chat Bot",
        url: "/admin/chatbot",
        icon: MessageCircleWarning,
        isActive: currentPath === "/admin/chatbot",
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
              <Link to="/admin/dashboard">
                <span className="text-sm font-semibold">
                  Admin Desa {desaConfig?.nama_desa}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.navDashboard.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <Link to={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {data.navSurat.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <Link to={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {data.navProfil.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <Link to={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {data.navPenduduk.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <Link to={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {data.navArtikel.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <Link to={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <NavInfografis items={data.navInfografis} />
          <NavPeta items={data.navPeta} />
          {data.navPengaduan.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <Link to={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {data.navUser.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <Link to={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {data.navChatBot.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <Link to={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {data.navConfigDesa.map((data) => (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton asChild isActive={data.isActive}>
                <Link to={data.url}>
                  <data.icon />
                  <span>{data.title}</span>
                </Link>
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
