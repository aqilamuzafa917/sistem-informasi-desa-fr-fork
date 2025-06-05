import * as React from "react";
import { useDesa } from "@/contexts/DesaContext";

interface InfografisNavProps {
  activeTab: "penduduk" | "apbdesa" | "idm";
}

export default function InfografisNav({ activeTab }: InfografisNavProps) {
  const { desaConfig, loading } = useDesa();

  return (
    <>
      {/* Judul Halaman */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
          INFOGRAFIS DESA{" "}
          {loading ? (
            <span className="inline-block h-12 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></span>
          ) : (
            desaConfig?.nama_desa?.toUpperCase()
          )}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Informasi statistik dan data desa dalam bentuk visual
        </p>
      </div>

      {/* Navigasi Tab */}
      <div className="mb-8 flex flex-wrap justify-center gap-8">
        <a href="/infografis/penduduk" className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="mb-2 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
              <svg
                className={`h-6 w-6 ${
                  activeTab === "penduduk"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span
              className={`text-sm font-medium ${
                activeTab === "penduduk"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Penduduk
            </span>
            {activeTab === "penduduk" && (
              <div className="mt-1 h-1 w-16 rounded-full bg-blue-600 dark:bg-blue-400"></div>
            )}
          </div>
        </a>

        <a href="/infografis/apbdesa" className="flex flex-col items-center">
          <div className="mb-2 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
            <svg
              className={`h-6 w-6 ${
                activeTab === "apbdesa"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span
            className={`text-sm font-medium ${
              activeTab === "apbdesa"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            APBDes
          </span>
          {activeTab === "apbdesa" && (
            <div className="mt-1 h-1 w-16 rounded-full bg-blue-600 dark:bg-blue-400"></div>
          )}
        </a>

        <a href="/infografis/idm" className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="mb-2 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
              <svg
                className={`h-6 w-6 ${
                  activeTab === "idm"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span
              className={`text-sm font-medium ${
                activeTab === "idm"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              IDM
            </span>
            {activeTab === "idm" && (
              <div className="mt-1 h-1 w-16 rounded-full bg-blue-600 dark:bg-blue-400"></div>
            )}
          </div>
        </a>
      </div>
    </>
  );
}
