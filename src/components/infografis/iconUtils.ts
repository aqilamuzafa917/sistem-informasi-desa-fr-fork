import {
  UserX,
  Home,
  GraduationCap,
  Clock,
  Building2,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Wheat,
  Fish,
  Factory,
  HardHat,
  Truck,
  Users,
  Hammer,
  Scissors,
  Zap,
  Pickaxe,
  TreePine,
  Wrench,
  Shirt,
  Palette,
  Stethoscope,
  BookOpen,
  Moon,
  Cross,
  Coffee,
  Megaphone,
  Landmark,
  Crown,
  Globe,
  MapPin,
  Plane,
  Scale,
  FileText,
  Building,
  Calculator,
  TrendingUp,
  Heart,
  Pill,
  Brain,
  Radio,
  Anchor,
  Microscope,
  Car,
  TrendingDown,
  Circle,
  UserCheck,
  Briefcase,
} from "lucide-react";
import {
  FaStarAndCrescent,
  FaCross,
  FaOm,
  FaYinYang,
  FaBookOpen,
  FaStar,
  FaHeart,
  FaHeartBroken,
  FaUser,
  FaUserSlash,
} from "react-icons/fa";

// Fungsi untuk mendapatkan ikon berdasarkan jenis pekerjaan
export const getJobIcon = (jobTitle: string) => {
  const jobLower = jobTitle.toLowerCase();

  if (
    jobLower.includes("tidak bekerja") ||
    jobLower.includes("belum bekerja")
  ) {
    return UserX;
  } else if (jobLower.includes("mengurus rumah tangga")) {
    return Home;
  } else if (jobLower.includes("pelajar") || jobLower.includes("mahasiswa")) {
    return GraduationCap;
  } else if (jobLower.includes("pensiunan")) {
    return Clock;
  } else if (
    jobLower.includes("pegawai negeri sipil") ||
    jobLower.includes("pns")
  ) {
    return Building2;
  } else if (
    jobLower.includes("tentara nasional indonesia") ||
    jobLower.includes("tni")
  ) {
    return Shield;
  } else if (
    jobLower.includes("kepolisian ri") ||
    jobLower.includes("polisi")
  ) {
    return ShieldCheck;
  } else if (
    jobLower.includes("perdagangan") ||
    jobLower.includes("pedagang")
  ) {
    return ShoppingCart;
  } else if (jobLower.includes("petani") || jobLower.includes("pekebun")) {
    return Wheat;
  } else if (jobLower.includes("peternak")) {
    return Wheat; // Using Wheat as alternative for Cow
  } else if (jobLower.includes("nelayan") || jobLower.includes("perikanan")) {
    return Fish;
  } else if (jobLower.includes("industri")) {
    return Factory;
  } else if (jobLower.includes("konstruksi")) {
    return HardHat;
  } else if (jobLower.includes("transportasi")) {
    return Truck;
  } else if (
    jobLower.includes("karyawan swasta") ||
    jobLower.includes("karyawan bumn") ||
    jobLower.includes("karyawan bumd") ||
    jobLower.includes("karyawan honorer")
  ) {
    return Users;
  } else if (
    jobLower.includes("buruh harian lepas") ||
    jobLower.includes("buruh tani") ||
    jobLower.includes("buruh nelayan") ||
    jobLower.includes("buruh peternakan")
  ) {
    return Hammer;
  } else if (jobLower.includes("pembantu rumah tangga")) {
    return Home;
  } else if (jobLower.includes("tukang cukur")) {
    return Scissors;
  } else if (jobLower.includes("tukang listrik")) {
    return Zap;
  } else if (jobLower.includes("tukang batu")) {
    return Pickaxe;
  } else if (jobLower.includes("tukang kayu")) {
    return TreePine;
  } else if (jobLower.includes("tukang sol sepatu")) {
    return Wrench;
  } else if (
    jobLower.includes("tukang las") ||
    jobLower.includes("pandai besi")
  ) {
    return Hammer;
  } else if (jobLower.includes("tukang jahit")) {
    return Shirt;
  } else if (jobLower.includes("tukang gigi")) {
    return Stethoscope;
  } else if (
    jobLower.includes("penata rias") ||
    jobLower.includes("penata busana") ||
    jobLower.includes("penata rambut")
  ) {
    return Palette;
  } else if (jobLower.includes("mekanik")) {
    return Wrench;
  } else if (jobLower.includes("seniman")) {
    return Palette;
  } else if (jobLower.includes("tabib")) {
    return Stethoscope;
  } else if (jobLower.includes("perancang busana")) {
    return Shirt;
  } else if (jobLower.includes("penterjemah")) {
    return BookOpen;
  } else if (
    jobLower.includes("imam masjid") ||
    jobLower.includes("ustadz") ||
    jobLower.includes("mubaligh")
  ) {
    return Moon;
  } else if (jobLower.includes("pendeta") || jobLower.includes("pastor")) {
    return Cross;
  } else if (jobLower.includes("wartawan")) {
    return BookOpen; // Using BookOpen as alternative for Newspaper
  } else if (jobLower.includes("juru masak")) {
    return Coffee;
  } else if (jobLower.includes("promotor acara")) {
    return Megaphone;
  } else if (
    jobLower.includes("anggota dpr") ||
    jobLower.includes("anggota dpd") ||
    jobLower.includes("anggota bpk") ||
    jobLower.includes("anggota mahkamah konstitusi") ||
    jobLower.includes("anggota dprd")
  ) {
    return Landmark;
  } else if (
    jobLower.includes("presiden") ||
    jobLower.includes("wakil presiden")
  ) {
    return Crown;
  } else if (
    jobLower.includes("anggota kabinet") ||
    jobLower.includes("kementerian")
  ) {
    return Building2;
  } else if (jobLower.includes("duta besar")) {
    return Globe;
  } else if (
    jobLower.includes("gubernur") ||
    jobLower.includes("wakil gubernur") ||
    jobLower.includes("bupati") ||
    jobLower.includes("wakil bupati") ||
    jobLower.includes("walikota") ||
    jobLower.includes("wakil walikota")
  ) {
    return MapPin;
  } else if (jobLower.includes("dosen")) {
    return GraduationCap;
  } else if (jobLower.includes("guru")) {
    return GraduationCap;
  } else if (jobLower.includes("pilot")) {
    return Plane;
  } else if (jobLower.includes("pengacara")) {
    return Scale;
  } else if (jobLower.includes("notaris")) {
    return FileText;
  } else if (jobLower.includes("arsitek")) {
    return Building;
  } else if (jobLower.includes("akuntan")) {
    return Calculator;
  } else if (jobLower.includes("konsultan")) {
    return TrendingUp;
  } else if (jobLower.includes("dokter")) {
    return Stethoscope;
  } else if (jobLower.includes("bidan") || jobLower.includes("perawat")) {
    return Heart;
  } else if (jobLower.includes("apoteker")) {
    return Pill;
  } else if (jobLower.includes("psikiater") || jobLower.includes("psikolog")) {
    return Brain;
  } else if (
    jobLower.includes("penyiar televisi") ||
    jobLower.includes("penyiar radio")
  ) {
    return Radio;
  } else if (jobLower.includes("pelaut")) {
    return Anchor;
  } else if (jobLower.includes("peneliti")) {
    return Microscope;
  } else if (jobLower.includes("sopir")) {
    return Car;
  } else if (jobLower.includes("pialang")) {
    return TrendingDown;
  } else if (jobLower.includes("paranormal")) {
    return Circle;
  } else if (jobLower.includes("perangkat desa")) {
    return UserCheck;
  } else if (jobLower.includes("kepala desa")) {
    return Crown;
  } else if (jobLower.includes("biarawati")) {
    return Cross;
  } else if (jobLower.includes("wiraswasta")) {
    return TrendingUp;
  } else {
    return Briefcase; // Default untuk pekerjaan lainnya
  }
};

// Fungsi untuk mendapatkan ikon agama yang spesifik
export const getReligionIcon = (religion: string) => {
  const religionLower = religion.toLowerCase();

  if (religionLower.includes("islam")) {
    return FaStarAndCrescent; // Bulan bintang untuk Islam
  } else if (religionLower.includes("kristen")) {
    return FaCross; // Salib untuk Kristen
  } else if (religionLower.includes("katolik")) {
    return FaCross; // Salib untuk Katolik
  } else if (religionLower.includes("hindu")) {
    return FaOm; // Om symbol untuk Hindu
  } else if (religionLower.includes("buddha")) {
    return FaYinYang; // Yin Yang untuk Buddha
  } else if (religionLower.includes("konghucu")) {
    return FaBookOpen; // Kitab suci untuk Konghucu
  } else {
    return FaStar; // Default
  }
};

// Fungsi untuk mendapatkan ikon status perkawinan
export const getMaritalStatusIcon = (status: string) => {
  const statusLower = status.toLowerCase();

  if (statusLower.includes("belum menikah")) {
    return FaUser; // Single person icon
  } else if (statusLower.includes("menikah")) {
    return FaHeart; // Solid heart for married
  } else if (statusLower.includes("cerai hidup")) {
    return FaHeartBroken; // Broken heart for divorce
  } else if (statusLower.includes("cerai mati")) {
    return FaUserSlash; // Person with slash for widowed
  } else {
    return FaHeart; // Default
  }
};
