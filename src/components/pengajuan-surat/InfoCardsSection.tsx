import React from "react";
import { Clock, CheckCircle, FileText } from "lucide-react";

const InfoCardsSection: React.FC = () => (
  <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
        <Clock className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="mb-2 font-semibold text-gray-900">Proses Cepat</h3>
      <p className="text-sm text-gray-600">
        Pengajuan diproses dalam 1-3 hari kerja
      </p>
    </div>
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
        <CheckCircle className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="mb-2 font-semibold text-gray-900">Data Aman</h3>
      <p className="text-sm text-gray-600">
        Informasi Anda dijamin keamanannya
      </p>
    </div>
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
        <FileText className="h-6 w-6 text-purple-600" />
      </div>
      <h3 className="mb-2 font-semibold text-gray-900">Online 24/7</h3>
      <p className="text-sm text-gray-600">Ajukan kapan saja, dimana saja</p>
    </div>
  </div>
);

export default InfoCardsSection;
