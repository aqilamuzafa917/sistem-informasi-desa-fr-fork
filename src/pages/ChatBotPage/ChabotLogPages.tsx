import React, { useState, useEffect } from "react";
import {
  User,
  MessageSquare,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import axios from "axios";
import { API_CONFIG } from "../../config/api";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface ChatLog {
  id: number;
  user_message: string;
  chatbot_reply: string;
  ip_address: string;
  user_id: number | null;
  session_id: string;
  created_at: string;
  updated_at: string;
  message_history: string;
}

interface PaginationData {
  current_page: number;
  data: ChatLog[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

const ChatbotLogsAdmin: React.FC = () => {
  const [logs, setLogs] = useState<PaginationData | null>(null);
  const [selectedLog, setSelectedLog] = useState<ChatLog | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_CONFIG.baseURL}/api/chatbot-logs?page=${currentPage}`,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLogs(response.data);
    } catch (error) {
      toast.error("Gagal mengambil data log chatbot", {
        duration: 3000,
      });
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleViewDetails = (log: ChatLog) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Log Chatbot
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Monitor dan analisis percakapan chatbot Desa Batujajar Timur
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mx-auto max-w-7xl">
              {/* Logs Table */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                      <Spinner size="xl" text="Memuat data..." />
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                            ID
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                            Pesan User
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                            Balasan Bot
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                            IP Address
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                            Session ID
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                            Waktu
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {logs?.data.map((log, index) => (
                          <tr
                            key={log.id}
                            className={`transition-colors duration-150 hover:bg-slate-50 ${index % 2 === 0 ? "bg-white" : "bg-slate-25"}`}
                          >
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                              #{log.id}
                            </td>
                            <td className="max-w-xs px-6 py-4 text-sm text-slate-700">
                              <div className="flex items-start space-x-2">
                                <MessageSquare
                                  size={16}
                                  className="mt-0.5 flex-shrink-0 text-blue-500"
                                />
                                <span>
                                  {truncateText(log.user_message, 50)}
                                </span>
                              </div>
                            </td>
                            <td className="max-w-xs px-6 py-4 text-sm text-slate-700">
                              <div className="flex items-start space-x-2">
                                <div className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-green-500"></div>
                                <span>
                                  {truncateText(
                                    log.chatbot_reply.replace(/[^\w\s]/g, " "),
                                    50,
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              <code className="rounded bg-slate-100 px-2 py-1 text-xs">
                                {log.ip_address}
                              </code>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              <code className="rounded bg-slate-100 px-2 py-1 text-xs">
                                {log.session_id
                                  ? `${log.session_id.substring(0, 8)}...`
                                  : "N/A"}
                              </code>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              <div className="flex items-center space-x-1">
                                <Clock size={14} className="text-slate-400" />
                                <span>{formatDate(log.created_at)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <button
                                onClick={() => handleViewDetails(log)}
                                className="flex items-center space-x-1 rounded-lg bg-blue-100 px-3 py-2 text-blue-700 transition-colors duration-150 hover:bg-blue-200"
                              >
                                <Eye size={16} />
                                <span>Detail</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination */}
                <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      Menampilkan {logs?.from} - {logs?.to} dari {logs?.total}{" "}
                      hasil
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={!logs?.prev_page_url}
                        className="flex items-center space-x-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 transition-colors duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronLeft size={16} />
                        <span>Sebelumnya</span>
                      </button>

                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, "...", logs?.last_page].map(
                          (page, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                typeof page === "number" && setCurrentPage(page)
                              }
                              className={`rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                                page === logs?.current_page
                                  ? "bg-blue-600 text-white"
                                  : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {page}
                            </button>
                          ),
                        )}
                      </div>

                      <button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={!logs?.next_page_url}
                        className="flex items-center space-x-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 transition-colors duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span>Berikutnya</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Detail */}
        {showModal && selectedLog && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div
                  className="absolute inset-0 bg-gray-500 opacity-75"
                  onClick={() => setShowModal(false)}
                ></div>
              </div> */}

              <div className="inline-block transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
                <div className="bg-white px-6 pt-6 pb-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-800">
                      Detail Log Percakapan
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-slate-400 transition-colors hover:text-slate-600"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-semibold text-slate-600">
                          ID Log
                        </label>
                        <p className="font-mono text-lg text-slate-900">
                          #{selectedLog.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-600">
                          Session ID
                        </label>
                        <p className="font-mono text-sm break-all text-slate-700">
                          {selectedLog.session_id}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-600">
                          IP Address
                        </label>
                        <p className="font-mono text-sm text-slate-700">
                          {selectedLog.ip_address}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-semibold text-slate-600">
                          Waktu Dibuat
                        </label>
                        <p className="text-sm text-slate-700">
                          {formatDate(selectedLog.created_at)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-600">
                          Waktu Update
                        </label>
                        <p className="text-sm text-slate-700">
                          {formatDate(selectedLog.updated_at)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-600">
                          User ID
                        </label>
                        <p className="text-sm text-slate-700">
                          {selectedLog.user_id || "Anonymous"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <h4 className="mb-2 flex items-center font-semibold text-blue-800">
                        <User className="mr-2" size={18} />
                        Pesan User
                      </h4>
                      <p className="whitespace-pre-wrap text-slate-700">
                        {selectedLog.user_message}
                      </p>
                    </div>

                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                      <h4 className="mb-2 flex items-center font-semibold text-green-800">
                        <MessageSquare className="mr-2" size={18} />
                        Balasan Chatbot
                      </h4>
                      <p className="whitespace-pre-wrap text-slate-700">
                        {selectedLog.chatbot_reply}
                      </p>
                    </div>

                    {selectedLog.message_history &&
                      selectedLog.message_history !== "[]" && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <h4 className="mb-2 font-semibold text-slate-800">
                            Riwayat Percakapan
                          </h4>
                          <pre className="overflow-x-auto text-sm whitespace-pre-wrap text-slate-600">
                            {JSON.stringify(
                              JSON.parse(selectedLog.message_history),
                              null,
                              2,
                            )}
                          </pre>
                        </div>
                      )}
                  </div>
                </div>

                <div className="flex justify-end bg-slate-50 px-6 py-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-lg bg-slate-600 px-6 py-2 text-white transition-colors duration-150 hover:bg-slate-700"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ChatbotLogsAdmin;
