import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
// import { Card } from "./ui/card"; // Removed unused import
import { MessageCircle, X, Send } from "lucide-react";
import axios from "axios";
import { API_CONFIG } from "../config/api";
import { useLocation } from "react-router-dom";

interface Message {
  text: string;
  isUser: boolean;
}

export function Chatbot() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [isOpen, setIsOpen] = useState(isHome);
  const [showPopup, setShowPopup] = useState(isHome); // for animation
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Animasi keluar sebelum hilang dari DOM
  useEffect(() => {
    if (isOpen) {
      setShowPopup(true);
    } else {
      // Delay hilang dari DOM agar animasi keluar sempat jalan
      const timeout = setTimeout(() => setShowPopup(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Minimize otomatis saat pindah dari / ke halaman lain
  useEffect(() => {
    if (location.pathname === "/") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Kirim halo otomatis hanya sekali saat komponen pertama kali mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      handleSendMessage("Haloo");
    }
  }, []);

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim()) return;

    if (!message) {
      setInputMessage("");
    }
    setMessages((prev) => [...prev, { text: messageToSend, isUser: true }]);
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}/api/publik/chatbot/send`,
        {
          message: messageToSend,
        },
        {
          headers: API_CONFIG.headers,
        },
      );
      setMessages((prev) => [...prev, { text: data.reply, isUser: false }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Maaf, terjadi kesalahan. Silakan coba lagi.", isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Tombol Chatbot dengan animasi */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-4 bottom-4 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-xl transition-all duration-200 hover:bg-blue-700 active:scale-95 ${isOpen ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100"}`}
        aria-label="Buka Chatbot"
        style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.12)" }}
      >
        <MessageCircle className="h-8 w-8 text-white" />
      </button>

      {/* Popup Chatbot dengan animasi */}
      {showPopup && (
        <div
          className={`fixed right-4 bottom-20 z-50 flex h-[500px] w-96 max-w-full flex-col rounded-xl border border-gray-200 bg-white shadow-2xl transition-all duration-200 ${isOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
        >
          <div className="bg-primary/90 flex items-center justify-between rounded-t-xl border-b p-4">
            <h3 className="font-semibold text-white">Chatbot Desa</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow ${
                    message.isUser
                      ? "rounded-br-sm bg-blue-500 text-white"
                      : "rounded-bl-sm border border-gray-200 bg-white text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm shadow">
                  Mengetik...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="rounded-b-xl border-t bg-white p-3">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ketik pesan..."
                className="flex-1 rounded-full border-gray-300 focus:border-blue-400"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
                className="rounded-full bg-blue-500 text-white hover:bg-blue-600"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
