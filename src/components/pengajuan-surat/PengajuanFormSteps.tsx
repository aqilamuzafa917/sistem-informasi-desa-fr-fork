import React from "react";
import { User, AlertCircle, CheckCircle } from "lucide-react";
import { SuratPayload } from "@/types/surat";
import FormField from "./FormField";
import FileUploadSection from "./FileUploadSection";
import { letterTypes } from "@/constants/surat";

interface PengajuanFormStepsProps {
  jenisSurat: string;
  setJenisSurat: (value: string) => void;
  formData: Partial<SuratPayload>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  uploadedFiles: File[];
  uploadError: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
}

const LetterSpecificFormFields: React.FC<{
  jenisSurat: string;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}> = ({ jenisSurat, handleInputChange }) => {
  switch (jenisSurat) {
    case "SK_PINDAH":
      return (
        <div className="rounded-xl bg-gray-50 p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            Detail Tujuan Pindah
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <FormField
              label="Alamat Tujuan"
              name="alamat_tujuan"
              onChange={handleInputChange}
              required
              as="textarea"
              className="md:col-span-2"
            />
            <FormField
              label="RT Tujuan"
              name="rt_tujuan"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="RW Tujuan"
              name="rw_tujuan"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Kelurahan/Desa Tujuan"
              name="kelurahan_desa_tujuan"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Kecamatan Tujuan"
              name="kecamatan_tujuan"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Kabupaten/Kota Tujuan"
              name="kabupaten_kota_tujuan"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Provinsi Tujuan"
              name="provinsi_tujuan"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Alasan Pindah"
              name="alasan_pindah"
              as="select"
              onChange={handleInputChange}
              required
            >
              <option value="">Pilih Alasan</option>
              <option value="Pekerjaan">Pekerjaan</option>
              <option value="Pendidikan">Pendidikan</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Perumahan">Perumahan</option>
              <option value="Keluarga">Keluarga</option>
              <option value="Lainnya">Lainnya</option>
            </FormField>
            <FormField
              label="Klasifikasi Pindah"
              name="klasifikasi_pindah"
              as="select"
              onChange={handleInputChange}
              required
            >
              <option value="">Pilih Klasifikasi</option>
              <option value="Dalam Satu Kelurahan/Desa">
                Dalam Satu Kelurahan/Desa
              </option>
              <option value="Antar Kelurahan/Desa">Antar Kelurahan/Desa</option>
              <option value="Antar Kecamatan">Antar Kecamatan</option>
              <option value="Antar Kabupaten/Kota dalam satu Provinsi">
                Antar Kabupaten/Kota dalam satu Provinsi
              </option>
              <option value="Antar Provinsi">Antar Provinsi</option>
            </FormField>
          </div>
        </div>
      );

    case "SK_DOMISILI":
      return null;

    case "SK_KEMATIAN":
      return (
        <div className="rounded-xl bg-gray-50 p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            Detail Kematian
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <FormField
              label="NIK Penduduk Meninggal"
              name="nik_penduduk_meninggal"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Tanggal Kematian"
              name="tanggal_kematian"
              type="date"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Waktu Kematian"
              name="waktu_kematian"
              type="time"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Tempat Kematian"
              name="tempat_kematian"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Penyebab Kematian"
              name="penyebab_kematian"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Hubungan Pelapor Kematian"
              name="hubungan_pelapor_kematian"
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      );

    case "SK_KELAHIRAN":
      return (
        <div className="space-y-6">
          <div className="rounded-xl bg-gray-50 p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              Detail Kelahiran Bayi
            </h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              <FormField
                label="Nama Bayi"
                name="nama_bayi"
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Tempat Dilahirkan"
                name="tempat_dilahirkan"
                placeholder="Rumah Sakit/Klinik/Rumah"
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Tempat Kelahiran (Kota/Kab)"
                name="tempat_kelahiran"
                placeholder="Contoh: Jakarta"
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Tanggal Lahir Bayi"
                name="tanggal_lahir_bayi"
                type="date"
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Waktu Lahir Bayi"
                name="waktu_lahir_bayi"
                type="time"
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Jenis Kelamin Bayi"
                name="jenis_kelamin_bayi"
                as="select"
                onChange={handleInputChange}
                required
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </FormField>
              <FormField
                label="Jenis Kelahiran"
                name="jenis_kelahiran"
                as="select"
                onChange={handleInputChange}
                required
              >
                <option value="">Pilih Jenis Kelahiran</option>
                <option value="Tunggal">Tunggal</option>
                <option value="Kembar 2">Kembar 2</option>
                <option value="Kembar 3">Kembar 3</option>
                <option value="Kembar 4">Kembar 4</option>
                <option value="Lainnya">Lainnya</option>
              </FormField>
              <FormField
                label="Anak ke-"
                name="anak_ke"
                type="number"
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Penolong Kelahiran"
                name="penolong_kelahiran"
                as="select"
                onChange={handleInputChange}
                required
              >
                <option value="">Pilih Penolong</option>
                <option value="Dokter">Dokter</option>
                <option value="Bidan/Perawat">Bidan/Perawat</option>
                <option value="Dukun">Dukun</option>
                <option value="Lainnya">Lainnya</option>
              </FormField>
              <FormField
                label="Berat Bayi (kg)"
                name="berat_bayi_kg"
                type="number"
                onChange={handleInputChange}
                placeholder="Contoh: 3.2"
              />
              <FormField
                label="Panjang Bayi (cm)"
                name="panjang_bayi_cm"
                type="number"
                onChange={handleInputChange}
                placeholder="Contoh: 50"
              />
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              Data Orang Tua & Pelapor
            </h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              <FormField
                label="NIK Ibu"
                name="nik_penduduk_ibu"
                onChange={handleInputChange}
                required
              />
              <FormField
                label="NIK Ayah"
                name="nik_penduduk_ayah"
                onChange={handleInputChange}
                required
              />
              <FormField
                label="NIK Pelapor Kelahiran"
                name="nik_penduduk_pelapor_lahir"
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Hubungan Pelapor dengan Bayi"
                name="hubungan_pelapor_lahir"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>
      );

    case "SK_USAHA":
      return (
        <div className="rounded-xl bg-gray-50 p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            Detail Usaha
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <FormField
              label="Nama Usaha"
              name="nama_usaha"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Jenis Usaha"
              name="jenis_usaha"
              onChange={handleInputChange}
              required
            />
          </div>
          <FormField
            label="Alamat Usaha"
            name="alamat_usaha"
            as="textarea"
            onChange={handleInputChange}
            required
            className="mt-4"
          />
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <FormField
              label="Status Bangunan Usaha"
              name="status_bangunan_usaha"
              as="select"
              onChange={handleInputChange}
              required
            >
              <option value="">Pilih Status</option>
              <option value="Milik Sendiri">Milik Sendiri</option>
              <option value="Sewa">Sewa</option>
              <option value="Kontrak">Kontrak</option>
              <option value="Lainnya">Lainnya</option>
            </FormField>
            <FormField
              label="Sejak Tanggal Usaha"
              name="sejak_tanggal_usaha"
              type="date"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
            <FormField
              label="Perkiraan Modal Usaha (Rp)"
              name="perkiraan_modal_usaha"
              type="number"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Perkiraan Pendapatan Usaha/bln (Rp)"
              name="perkiraan_pendapatan_usaha"
              type="number"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Jumlah Tenaga Kerja"
              name="jumlah_tenaga_kerja"
              type="number"
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      );

    case "SK_TIDAK_MAMPU":
      return (
        <div className="rounded-xl bg-gray-50 p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            Detail Ekonomi Keluarga
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <FormField
              label="Pekerjaan Kepala Keluarga"
              name="pekerjaan_kepala_keluarga"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Penghasilan Perbulan Kepala Keluarga (Rp)"
              name="penghasilan_perbulan_kepala_keluarga"
              type="number"
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      );

    case "SKTM_KIP":
      return (
        <div className="rounded-xl bg-gray-50 p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            Detail Ekonomi & Siswa
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <FormField
              label="Pekerjaan Kepala Keluarga"
              name="pekerjaan_kepala_keluarga"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Penghasilan Perbulan Kepala Keluarga (Rp)"
              name="penghasilan_perbulan_kepala_keluarga"
              type="number"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="NIK Siswa (yang mengajukan KIP)"
              name="nik_penduduk_siswa"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Nama Sekolah Siswa"
              name="nama_sekolah"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="NISN Siswa"
              name="nisn_siswa"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Kelas Siswa"
              name="kelas_siswa"
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      );

    case "SK_KEHILANGAN_KTP":
      return (
        <div className="rounded-xl bg-gray-50 p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            Detail Kehilangan KTP
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <FormField
              label="Nomor KTP Hilang"
              name="nomor_ktp_hilang"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Tanggal Perkiraan Hilang"
              name="tanggal_perkiraan_hilang"
              type="date"
              onChange={handleInputChange}
              required
            />
          </div>
          <FormField
            label="Lokasi Perkiraan Hilang"
            name="lokasi_perkiraan_hilang"
            as="textarea"
            onChange={handleInputChange}
            required
            className="mt-4"
          />
          <FormField
            label="Kronologi Singkat Kehilangan"
            name="kronologi_singkat"
            as="textarea"
            rows={4}
            onChange={handleInputChange}
            required
            className="mt-4"
          />
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <FormField
              label="Nomor Laporan Polisi (Jika Ada)"
              name="nomor_laporan_polisi"
              onChange={handleInputChange}
            />
            <FormField
              label="Tanggal Laporan Polisi (Jika Ada)"
              name="tanggal_laporan_polisi"
              type="date"
              onChange={handleInputChange}
            />
          </div>
        </div>
      );

    case "SK_KEHILANGAN_KK":
      return (
        <div className="rounded-xl bg-gray-50 p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            Detail Kehilangan KK
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <FormField
              label="Nomor KK Hilang"
              name="nomor_kk_hilang"
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Tanggal Perkiraan Hilang"
              name="tanggal_perkiraan_hilang"
              type="date"
              onChange={handleInputChange}
              required
            />
          </div>
          <FormField
            label="Lokasi Perkiraan Hilang"
            name="lokasi_perkiraan_hilang"
            as="textarea"
            onChange={handleInputChange}
            required
            className="mt-4"
          />
          <FormField
            label="Kronologi Singkat Kehilangan"
            name="kronologi_singkat"
            as="textarea"
            rows={4}
            onChange={handleInputChange}
            required
            className="mt-4"
          />
        </div>
      );

    case "SK_UMUM":
      return (
        <div className="rounded-xl bg-gray-50 p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            Detail Keterangan Umum
          </h3>
          <FormField
            label="Deskripsi Lengkap Keperluan"
            name="deskripsi_keperluan"
            as="textarea"
            rows={4}
            onChange={handleInputChange}
            required
            placeholder="Jelaskan secara rinci keperluan Anda untuk surat keterangan umum ini."
          />
        </div>
      );

    default:
      return (
        <div className="rounded-xl bg-gray-50 p-6">
          <div className="py-12 text-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-3 text-lg">Silakan pilih jenis surat di atas</p>
            <p className="text-sm text-gray-500">
              Formulir pengajuan akan tampil sesuai jenis surat yang Anda pilih.
            </p>
          </div>
        </div>
      );
  }
};

const PengajuanFormSteps: React.FC<PengajuanFormStepsProps> = ({
  jenisSurat,
  setJenisSurat,
  formData,
  handleInputChange,
  uploadedFiles,
  uploadError,
  handleFileChange,
  removeFile,
  currentStep,
  setCurrentStep,
  handleSubmit,
  isLoading,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
      <form onSubmit={handleSubmit}>
        {/* Step 1: Letter Type Selection */}
        {currentStep === 1 && (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Pilih Jenis Surat
              </h2>
              <p className="text-gray-600">
                Pilih jenis surat keterangan yang ingin Anda ajukan
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {letterTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setJenisSurat(type.value)}
                    className={`rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                      jenisSurat === type.value
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`h-12 w-12 rounded-lg ${type.color} flex items-center justify-center`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">
                          {type.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          Surat Keterangan
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {jenisSurat && (
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Lanjutkan
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Form */}
        {currentStep === 2 && (
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Isi Data Formulir
                </h2>
                <p className="text-gray-600">
                  Lengkapi semua data yang diperlukan dengan benar
                </p>
              </div>
              <div className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
                {letterTypes.find((type) => type.value === jenisSurat)?.label}
              </div>
            </div>

            {/* Form Fields Container */}
            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="rounded-xl bg-gray-50 p-6">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                  <User className="mr-2 h-5 w-5 text-blue-600" />
                  Informasi Pemohon
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    label="NIK Pemohon"
                    name="nik_pemohon"
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan NIK pemohon"
                  />
                  <FormField
                    label="Keperluan"
                    name="keperluan"
                    onChange={handleInputChange}
                    required
                    placeholder="Untuk keperluan apa surat ini"
                  />
                </div>
              </div>

              {/* Use the LetterSpecificFormFields component */}
              <LetterSpecificFormFields
                jenisSurat={jenisSurat}
                handleInputChange={handleInputChange}
              />

              {/* Use the FileUploadSection component */}
              <FileUploadSection
                uploadedFiles={uploadedFiles}
                uploadError={uploadError}
                handleFileChange={handleFileChange}
                removeFile={removeFile}
              />
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="rounded-lg bg-gray-200 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-300"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Review Data
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Review Data
              </h2>
              <p className="text-gray-600">
                Periksa kembali data yang telah Anda masukkan
              </p>
            </div>

            <div className="mb-6 rounded-xl bg-blue-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    {
                      letterTypes.find((type) => type.value === jenisSurat)
                        ?.label
                    }
                  </h3>
                  <p className="text-blue-700">Pengajuan surat keterangan</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-700">Estimasi Proses</div>
                  <div className="font-semibold text-blue-900">
                    1-3 Hari Kerja
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards - can be a separate component later */}
            <div className="mb-8 space-y-4">
              <div className="rounded-lg border border-gray-200 p-6">
                <h4 className="mb-3 font-semibold text-gray-900">
                  Informasi Pemohon
                </h4>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <div>
                    <span className="text-gray-600">NIK:</span>{" "}
                    <span className="font-medium">
                      {formData.nik_pemohon || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Keperluan:</span>{" "}
                    <span className="font-medium">
                      {formData.keperluan || "-"}
                    </span>
                  </div>
                </div>
                {/* Add other review details based on formData and jenisSurat */}
              </div>
              {/* Potentially add more review summary cards here */}
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start">
                <AlertCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-yellow-600" />
                <div>
                  <h4 className="mb-2 font-semibold text-yellow-900">
                    Perhatian
                  </h4>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    <li>• Pastikan semua data yang dimasukkan sudah benar</li>
                    <li>
                      • Proses pengajuan akan memakan waktu 1-3 hari kerja
                    </li>
                    <li>
                      • Anda akan mendapat notifikasi status pengajuan via email
                    </li>
                    <li>• Data yang sudah dikirim tidak dapat diubah</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="agree"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <label htmlFor="agree" className="ml-2 text-sm text-gray-700">
                Saya menyatakan bahwa data yang saya berikan adalah benar dan
                dapat dipertanggungjawabkan
              </label>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="rounded-lg bg-gray-200 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-300"
              >
                Ubah Data
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center rounded-lg bg-green-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Kirim Pengajuan
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PengajuanFormSteps;
