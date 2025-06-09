import { FileText, User, MapPin, Building, AlertCircle } from "lucide-react";

export const letterTypes = [
  {
    value: "SK_PINDAH",
    label: "SK Pindah",
    icon: MapPin,
    color: "bg-blue-500",
  },
  {
    value: "SK_DOMISILI",
    label: "SK Domisili",
    icon: Building,
    color: "bg-green-500",
  },
  {
    value: "SK_KEMATIAN",
    label: "SK Kematian",
    icon: AlertCircle,
    color: "bg-red-500",
  },
  {
    value: "SK_KELAHIRAN",
    label: "SK Kelahiran",
    icon: User,
    color: "bg-pink-500",
  },
  {
    value: "SK_USAHA",
    label: "SK Usaha",
    icon: Building,
    color: "bg-purple-500",
  },
  {
    value: "SK_TIDAK_MAMPU",
    label: "SK Tidak Mampu",
    icon: FileText,
    color: "bg-orange-500",
  },
  {
    value: "SKTM_KIP",
    label: "SKTM KIP",
    icon: FileText,
    color: "bg-teal-500",
  },
  {
    value: "SK_KEHILANGAN_KTP",
    label: "SK Kehilangan KTP",
    icon: AlertCircle,
    color: "bg-yellow-500",
  },
  {
    value: "SK_KEHILANGAN_KK",
    label: "SK Kehilangan KK",
    icon: AlertCircle,
    color: "bg-indigo-500",
  },
  {
    value: "SK_UMUM",
    label: "SK Umum",
    icon: FileText,
    color: "bg-gray-500",
  },
];

export const steps = [
  {
    number: 1,
    title: "Pilih Jenis Surat",
    description: "Tentukan jenis surat yang akan diajukan",
  },
  {
    number: 2,
    title: "Isi Data",
    description: "Lengkapi formulir dengan data yang diperlukan",
  },
  {
    number: 3,
    title: "Review & Kirim",
    description: "Periksa kembali data sebelum mengirim",
  },
];
