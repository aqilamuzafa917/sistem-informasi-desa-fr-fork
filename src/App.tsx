// import { DarkThemeToggle } from "flowbite-react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import HomePage from "./pages/HomePage"; // Import the HomePage
import LoginPage from "./pages/LoginPage"; // Import the LoginPage
import DashboardPage from "./pages/DashboardPage"; // Import the DashboardPage
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import ArtikelPages from "./pages/ArtikelPage/ArtikelPages";
import PendapatanPages from "./pages/InfografisPage/PendapatanPages";
import BelanjaPages from "./pages/InfografisPage/BelanjaPages";
import PetaPages from "./pages/InfografisPage/PetaPages";
import PendudukPages from "./pages/PendudukPage/PendudukPages";
import DataKKPages from "./pages/PendudukPage/KkPages";
import PengaduanPages from "./pages/PengaduanPage/PenganduanPages";
import ProfilPages from "./pages/ProfilPage/ProfilPages";
import SuratPages from "./pages/SuratPage/SuratPages";
import VerifikasiSuratPages from "./pages/SuratPage/VerifikasiSuratPages";
import ProfilDesa from "./pages/ProfilDesa";
import PengajuanSuratPage from "./pages/PengajuanSuratPage";
import CekStatusSuratPage from "./pages/CekStatusSuratPage";
import ArtikelDesa from "./pages/ArtikelDesa";
import ArtikelDetailPage from "./pages/ArtikelDetailPage";
import ArtikelCreatePage from "./pages/ArtikelCreatePage";
import InfografisPenduduk from "./pages/InfografisPenduduk";
import InfografisAPBDesa from "./pages/InfografisAPBDesa";
import InfografisIDM from "./pages/InfografisIDM";
import PetaFasilitasDesa from "./pages/PetaFasilitasDesa";
import SuratCreate from "./pages/SuratPage/SuratCreate";
import PendudukCreate from "./pages/PendudukPage/PendudukCreate"; 
import ArtikelCreate from "./pages/ArtikelPage/ArtikelCreate";
import VerifikasiArtikelPage from "./pages/ArtikelPage/VerifikasiArtikelPage";
import ConfigPages from "./pages/ConfigPage/ConfigPages";
import VerifikasiPengaduanPage from "./pages/PengaduanPage/VerifikasiPengaduanPages";
import { Chatbot } from "./components/Chatbot";
import DynamicTitle from "./components/DynamicTitle";
import DynamicFavicon from "./components/DynamicFavicon";
import DynamicManifest from "./components/DynamicManifest";
import PendapatanCreate from "./pages/InfografisPage/PendapatanCreate";
import PendapatanDetail from "./pages/InfografisPage/PendapatanDetail";
import BelanjaDetail from "./pages/InfografisPage/BelanjaDetail";
import BelanjaCreate from "./pages/InfografisPage/BelanjaCreate";
import { HomePageProvider } from "./contexts/HomePageContext";
import DetailPendudukPages from "./pages/PendudukPage/DetailPendudukPages";
import UserPages from "./pages/UserPage/UserPages";
import UserCreate from "./pages/UserPage/UserCreate";

// You might want to create a DashboardPage for after login
// import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors duration={5000} />
      <DynamicTitle />
      <DynamicFavicon />
      <DynamicManifest />
      {/* <div className="absolute top-4 right-4 z-50">
        <DarkThemeToggle />
      </div> */}

      {/* Navigation example (optional, you can place this in a Navbar component) */}
      {/* <nav className="bg-gray-100 dark:bg-gray-800 p-4 absolute top-16 right-4 z-50 rounded shadow">
        <ul className="flex flex-col space-y-2">
          <li>
            <Link to="/" className="text-blue-600 hover:underline dark:text-blue-400">Home</Link>
          </li>
          <li>
            <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">Login</Link>
          </li>
          <li>
            <Link to="/dashboard" className="text-blue-600 hover:underline dark:text-blue-400">Dashboard</Link>
          </li>
        </ul>
      </nav> */}

      <Routes>
        <Route
          path="/"
          element={
            <HomePageProvider>
              <HomePage />
            </HomePageProvider>
          }
        />
        <Route path="/profildesa" element={<ProfilDesa />} />
        <Route path="/pengajuansurat" element={<PengajuanSuratPage />} />
        <Route path="/cekstatussurat" element={<CekStatusSuratPage />} />
        <Route path="/artikeldesa" element={<ArtikelDesa />} />
        <Route path="/artikeldesa/:id" element={<ArtikelDetailPage />} />
        <Route path="/artikeldesa/buat" element={<ArtikelCreatePage />} />
        <Route path="/infografis/penduduk" element={<InfografisPenduduk />} />
        <Route path="/infografis/apbdesa" element={<InfografisAPBDesa />} />
        <Route path="/infografis/idm" element={<InfografisIDM />} />
        <Route path="/petafasilitasdesa" element={<PetaFasilitasDesa />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/surat" element={<SuratPages />} />
          <Route path="/admin/surat/:id" element={<VerifikasiSuratPages />} />
          <Route path="/admin/suratcreate" element={<SuratCreate />} />
          <Route path="/admin/profil" element={<ProfilPages />} />
          <Route path="/admin/artikel" element={<ArtikelPages />} />
          <Route path="/admin/artikel/buat" element={<ArtikelCreate />} />
          <Route path="/admin/artikel/:id" element={<VerifikasiArtikelPage />} />
          <Route path="/admin/pendapatan" element={<PendapatanPages />} />
          <Route path="/admin/pendapatan/detail" element={<PendapatanDetail />} />
          <Route path="/admin/pendapatan/tambah" element={<PendapatanCreate />} />
          <Route path="/admin/belanja" element={<BelanjaPages />} />
          <Route path="/admin/belanja/detail" element={<BelanjaDetail />} />
          <Route path="/admin/belanja/tambah" element={<BelanjaCreate />} />
          <Route path="/admin/peta" element={<PetaPages />} />
          <Route path="/admin/penduduk" element={<PendudukPages />} />
          <Route path="/admin/penduduk/:nik" element={<DetailPendudukPages />} />
          <Route path="/admin/penduduk/tambah" element={<PendudukCreate />} />
          <Route path="/admin/datakk" element={<DataKKPages />} />
          <Route path="/admin/pengaduan" element={<PengaduanPages />} />
          <Route path="/admin/pengaduan/:id" element={<VerifikasiPengaduanPage />} />
          <Route path="/admin/configdesa" element={<ConfigPages />} />
          <Route path="/admin/user" element={<UserPages />} />
          <Route path="/admin/user/tambah" element={<UserCreate />} />
        </Route>
      </Routes>

      <Chatbot />
    </>
  );
}
