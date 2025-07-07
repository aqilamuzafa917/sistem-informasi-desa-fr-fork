import React from "react";
import { FileText } from "lucide-react";

interface FileUploadSectionProps {
  uploadedFiles: File[];
  uploadError: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  uploadedFiles,
  uploadError,
  handleFileChange,
  removeFile,
}) => (
  <div className="rounded-xl bg-gray-50 p-6">
    <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
      <FileText className="mr-2 h-5 w-5 text-blue-600" />
      Dokumen Pendukung
    </h3>
    <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-blue-400">
      <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
      <p className="mb-2 text-gray-600">
        Upload dokumen pendukung (maksimal 2 file)
      </p>
      <p className="mb-4 text-sm text-gray-500">
        Format: PDF, JPG, PNG (Max 2MB)
      </p>

      {uploadError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {uploadError}
        </div>
      )}

      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
      />
      <label
        htmlFor="file-upload"
        className="inline-block cursor-pointer rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Pilih File
      </label>

      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-gray-700">
            File yang dipilih:
          </p>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border bg-white p-3"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-600 hover:text-red-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default FileUploadSection;
