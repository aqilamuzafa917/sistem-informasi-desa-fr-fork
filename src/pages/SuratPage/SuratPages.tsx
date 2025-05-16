// import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function SuratPages() {
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   // Clear authentication token (e.g., from localStorage)
  //   localStorage.removeItem("authToken");
  //   // Redirect to login page
  //   navigate("/");
  // };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbPage>Surat</BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mb-0 flex justify-end">
            <Button className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
              Buat Surat
            </Button>
          </div>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">Total Surat</p>
              <p className="mt-2 text-center text-4xl font-bold">0000</p>
            </div>
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">SK Belum Verifikasi</p>
              <p className="mt-2 text-center text-4xl font-bold">0000</p>
            </div>
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">Total Diterima</p>
              <p className="mt-2 text-center text-4xl font-bold">0000</p>
            </div>
          </div>
          <div className="mt-2 mb-2 flex justify-center">
            <div className="flex overflow-hidden rounded-full bg-gray-200">
              <div className="cursor-pointer px-4 py-2 font-medium hover:bg-gray-300">
                Semua
              </div>
              <div className="cursor-pointer px-4 py-2 font-medium hover:bg-gray-300">
                Disetujui
              </div>
              <div className="cursor-pointer px-4 py-2 font-medium hover:bg-gray-300">
                Diajukan
              </div>
              <div className="cursor-pointer px-4 py-2 font-medium hover:bg-gray-300">
                Ditolak
              </div>
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-black/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
