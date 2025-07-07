import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, AlertCircle, Bot, Check } from "lucide-react";
import axios from "axios";
import { API_CONFIG } from "../config/api";
import { useLocation } from "react-router-dom";
import { CHATBOT_MINIMIZE_EVENT } from "./NavbarDesa";
import { PengaduanPopup } from "./PengaduanPopup";
import React from "react";
import { useDesa } from "@/contexts/DesaContext";
import { v4 as uuidv4 } from "uuid";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
  isError?: boolean;
}

interface ContextMessage {
  role: "user" | "model";
  content: string;
  timestamp: string;
}

const STORAGE_KEY = "chatbot_messages";
const CONTEXT_HISTORY_KEY = "chatbot_context_history";
const SESSION_ID_KEY = "chatbot_session_id";
const MESSAGE_HISTORY_LIMIT = 10; // Number of previous messages to include in context

// Function result keywords for context filtering
const FUNCTION_RESULT_KEYWORDS = [
  "Status Pengajuan Surat",
  "Total Penduduk",
  "Total Kepala Keluarga",
  "Laporan APBDesa",
  "Total Pendapatan",
  "Artikel Terbaru Desa",
  "Data Tidak Ditemukan",
  "NIK Tidak Ditemukan",
  "Gagal Mengambil Data",
];

// Consistent theme colors
const theme = {
  primary: "var(--color-cyan-blue)", // Cyan blue
  secondary: "var(--color-deep-blue)", // Deep blue
  accent: "var(--color-light-cyan)", // Light cyan
  highlight: "var(--color-pale-blue)", // Pale blue
  link: "var(--color-deep-blue)", // Deep blue
  warning: "var(--color-fresh-green)", // Fresh green
  info: "var(--color-pale-blue)", // Pale blue
};

export function Chatbot() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { desaConfig } = useDesa();
  const [isOpen, setIsOpen] = useState(isHome);
  const [showPopup, setShowPopup] = useState(isHome);
  const [isPengaduanOpen, setIsPengaduanOpen] = useState(false);
  const [sessionId] = useState<string>(() => {
    // Try to get session ID from localStorage first
    const storedSessionId = localStorage.getItem(SESSION_ID_KEY);
    if (storedSessionId) return storedSessionId;

    // If not in localStorage, try sessionStorage
    const sessionStoredId = sessionStorage.getItem(SESSION_ID_KEY);
    if (sessionStoredId) return sessionStoredId;

    // Generate new UUID if no session ID exists
    const newSessionId = uuidv4();
    // Try to store in localStorage first
    try {
      localStorage.setItem(SESSION_ID_KEY, newSessionId);
    } catch {
      // Fallback to sessionStorage if localStorage fails
      sessionStorage.setItem(SESSION_ID_KEY, newSessionId);
    }
    return newSessionId;
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [contextHistory, setContextHistory] = useState<ContextMessage[]>(() => {
    const savedContext = localStorage.getItem(CONTEXT_HISTORY_KEY);
    return savedContext ? JSON.parse(savedContext) : [];
  });
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const lastScrollY = useRef(0);

  // Save messages and context history to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(CONTEXT_HISTORY_KEY, JSON.stringify(contextHistory));
  }, [contextHistory]);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (!isHome) {
        setIsOpen(false);
        return;
      }

      const currentScrollY = window.scrollY;
      if (currentScrollY === 0) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Listen for minimize event
  useEffect(() => {
    const handleMinimize = (event: CustomEvent<{ minimize: boolean }>) => {
      if (!isHome) {
        setIsOpen(false);
      } else {
        setIsOpen(!event.detail.minimize);
      }
    };

    window.addEventListener(
      CHATBOT_MINIMIZE_EVENT,
      handleMinimize as EventListener,
    );
    return () => {
      window.removeEventListener(
        CHATBOT_MINIMIZE_EVENT,
        handleMinimize as EventListener,
      );
    };
  }, [isHome]);

  // Animation handling
  useEffect(() => {
    if (isOpen) {
      setShowPopup(true);
      const timeout = setTimeout(() => scrollToBottom(), 150);
      return () => clearTimeout(timeout);
    } else {
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

  // Minimize automatically when moving from / to other pages
  useEffect(() => {
    if (location.pathname === "/") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Send hello automatically only once when component first mounts and no chat history
  useEffect(() => {
    if (!hasInitialized.current && messages.length === 0) {
      hasInitialized.current = true;
      handleSendMessage("Haloo");
    }
  });

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim()) return;

    if (!message) {
      setInputMessage("");
    }

    // Add new user message to UI state
    const newUserMessage: Message = {
      text: messageToSend,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // Add user message to context history
    const newContextMessage: ContextMessage = {
      role: "user",
      content: messageToSend,
      timestamp: newUserMessage.timestamp,
    };
    setContextHistory((prev) => [...prev, newContextMessage]);

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}/api/publik/chatbot/send`,
        {
          message: messageToSend,
          session_id: sessionId,
          message_history: contextHistory.slice(-MESSAGE_HISTORY_LIMIT),
        },
        {
          headers: API_CONFIG.headers,
        },
      );

      const chatbotReply = data.reply;
      const newBotMessage: Message = {
        text: chatbotReply,
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      // Always add bot response to UI messages
      setMessages((prev) => [...prev, newBotMessage]);

      // Check if the response is a function result
      const isFunctionResult = FUNCTION_RESULT_KEYWORDS.some((keyword) =>
        chatbotReply.includes(keyword),
      );

      // Only add to context history if it's not a function result
      if (!isFunctionResult) {
        const newBotContextMessage: ContextMessage = {
          role: "model",
          content: chatbotReply,
          timestamp: newBotMessage.timestamp,
        };
        setContextHistory((prev) => [...prev, newBotContextMessage]);
      }
    } catch {
      const errorMessage = "Maaf, terjadi kesalahan. Silakan coba lagi.";
      setMessages((prev) => [
        ...prev,
        {
          text: errorMessage,
          isUser: false,
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (text: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    const lines = text.split("\n");
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const italicRegex = /\*(?!\*|_)(.*?)(?<!\*|_)\*/g;
    const listItemStart = /^\* /;
    const urlRegex = /(https?:\/\/[^\s]+)/g; // Regex to detect standalone URLs

    const processBoldItalic = (segment: string): React.ReactNode[] => {
      const segmentElements: React.ReactNode[] = [];
      let lastIndex = 0;
      let elementIndex = 0;
      const uniqueId = Math.random().toString(36).substring(2, 15);

      const combinedRegex = new RegExp(
        `${boldRegex.source}|${italicRegex.source}`,
        "g",
      );

      const matches = [...segment.matchAll(combinedRegex)];

      matches.forEach((match) => {
        const matchIndex = match.index!;
        const fullMatch = match[0];

        if (matchIndex > lastIndex) {
          segmentElements.push(
            <span
              key={`text-${uniqueId}-${elementIndex}-${lastIndex}-${matchIndex}`}
            >
              {segment.substring(lastIndex, matchIndex)}
            </span>,
          );
          elementIndex++;
        }

        if (match[1]) {
          segmentElements.push(
            <strong key={`bold-${uniqueId}-${elementIndex}-${matchIndex}`}>
              {match[1]}
            </strong>,
          );
          elementIndex++;
        } else if (match[3]) {
          segmentElements.push(
            <em key={`italic-${uniqueId}-${elementIndex}-${matchIndex}`}>
              {match[3]}
            </em>,
          );
          elementIndex++;
        }

        lastIndex = matchIndex + fullMatch.length;
      });

      if (lastIndex < segment.length) {
        segmentElements.push(
          <span key={`text-${uniqueId}-${elementIndex}-${lastIndex}-end`}>
            {segment.substring(lastIndex)}
          </span>,
        );
      }

      return segmentElements;
    };

    const processTextSegment = (segment: string): React.ReactNode[] => {
      const segmentElements: React.ReactNode[] = [];
      let lastIndex = 0;

      // Combine both markdown links and standalone URLs
      const combinedLinkRegex = new RegExp(
        `${linkRegex.source}|${urlRegex.source}`,
        "g",
      );
      const matches = [...segment.matchAll(combinedLinkRegex)];

      matches.forEach((match) => {
        const fullMatch = match[0];
        const markdownLinkText = match[1]; // For markdown links
        const markdownUrl = match[2]; // For markdown links
        const standaloneUrl = match[3]; // For standalone URLs
        const matchIndex = match.index!;

        if (matchIndex > lastIndex) {
          segmentElements.push(
            ...processBoldItalic(segment.substring(lastIndex, matchIndex)),
          );
        }

        if (markdownUrl) {
          // Handle markdown links
          segmentElements.push(
            <a
              key={`link-${lastIndex}-${matchIndex}`}
              href={markdownUrl}
              className={`text-[${theme.link}] underline hover:text-blue-800`}
            >
              {processBoldItalic(markdownLinkText)}
            </a>,
          );
        } else if (standaloneUrl) {
          // For standalone URLs, extract the feature name from the URL
          const url = new URL(standaloneUrl);
          const path = url.pathname;
          let featureName = path.split("/").pop() || standaloneUrl;

          // Map paths to feature names
          const featureMap: { [key: string]: string } = {
            "": "Halaman Utama",
            profildesa: "Profil Desa",
            pengajuansurat: "Pengajuan Surat",
            cekstatussurat: "Cek Status Surat",
            artikeldesa: "Artikel Desa",
            "infografis/penduduk": "Data Penduduk",
            "infografis/apbdesa": "APB Desa",
            "infografis/idm": "IDM",
            petafasilitasdesa: "Peta Fasilitas Desa",
          };

          // Get the feature name from the map or use the path
          featureName = featureMap[path.slice(1)] || featureName;

          // Handle markdown links
          segmentElements.push(
            <a
              key={`url-${lastIndex}-${matchIndex}`}
              href={standaloneUrl}
              className={`text-[${theme.link}] underline hover:text-blue-800`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {featureName}
            </a>,
          );
        }

        lastIndex = matchIndex + fullMatch.length;
      });

      if (lastIndex < segment.length) {
        segmentElements.push(
          ...processBoldItalic(segment.substring(lastIndex)),
        );
      }

      return segmentElements;
    };

    let inList = false;
    let currentListItems: React.ReactNode[] = [];

    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();
      const isListItem = listItemStart.test(trimmedLine);

      if (isListItem) {
        const listItemContent = trimmedLine.replace(listItemStart, "");
        if (!inList) {
          if (elements.length > 0) {
            elements.push(<br key={`br-before-list-${lineIndex}`} />);
          }
          inList = true;
          currentListItems = [];
        }
        currentListItems.push(
          <li key={`list-item-${lineIndex}`} className="text-left">
            {processTextSegment(listItemContent)}
          </li>,
        );
      } else {
        if (inList) {
          elements.push(
            <ul
              key={`list-${lineIndex}`}
              className="my-2 list-disc space-y-1 pl-5"
            >
              {currentListItems}
            </ul>,
          );
          inList = false;
          currentListItems = [];
        }
        if (trimmedLine) {
          elements.push(
            <span key={`text-line-${lineIndex}`}>
              {processTextSegment(trimmedLine)}
            </span>,
          );
          if (
            lineIndex < lines.length - 1 &&
            !listItemStart.test(lines[lineIndex + 1].trim())
          ) {
            elements.push(<br key={`br-${lineIndex}`} />);
          }
        } else if (
          lineIndex < lines.length - 1 &&
          lines[lineIndex + 1].trim() &&
          !listItemStart.test(lines[lineIndex + 1].trim())
        ) {
          elements.push(<br key={`br-${lineIndex}`} />);
        }
      }
    });

    if (inList && currentListItems.length > 0) {
      elements.push(
        <ul key={`list-end`} className="my-2 list-disc space-y-1 pl-5">
          {currentListItems}
        </ul>,
      );
    }

    return elements;
  };

  // Define the static routes where the chatbot should be visible
  const staticAllowedRoutes = [
    "/",
    "/profildesa",
    "/pengajuansurat",
    "/cekstatussurat",
    "/infografis/penduduk",
    "/infografis/apbdesa",
    "/infografis/idm",
    "/petafasilitasdesa",
    "/petapotensidesa"
  ];

  // Check if the current route is in the static allowed list or starts with /artikeldesa
  const isAllowedRoute =
    staticAllowedRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/artikeldesa");

  // Hide the component if not on an allowed route
  if (!isAllowedRoute) {
    return null;
  }

  return (
    <>
      {/* Complaint Button */}
      <button
        onClick={() => setIsPengaduanOpen(true)}
        className="fixed right-20 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:scale-95 sm:right-20 sm:h-14 sm:w-14"
        aria-label="Buka Form Pengaduan"
      >
        <AlertCircle className="h-5 w-5 text-white sm:h-6 sm:w-6" />
      </button>

      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:ring-2 focus:outline-none active:scale-95 sm:h-14 sm:w-14 ${
          isOpen
            ? "pointer-events-none translate-y-4 scale-90 opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }`}
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
        }}
        aria-label="Buka Chatbot"
      >
        <MessageCircle className="h-5 w-5 text-white sm:h-6 sm:w-6" />
      </button>

      {/* Chatbot Popup */}
      {showPopup && (
        <div
          className={`fixed right-4 bottom-20 z-50 flex h-[calc(100vh-8rem)] w-[calc(100vw-2rem)] max-w-[24rem] flex-col rounded-xl bg-white shadow-2xl transition-all duration-300 ease-in-out sm:h-[500px] sm:w-96 ${
            isOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-4 scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between rounded-t-xl p-2.5 text-white shadow-sm sm:p-4"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            }}
          >
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className="relative">
                <Bot
                  className="h-5 w-5 sm:h-8 sm:w-8"
                  style={{ color: theme.warning }}
                />
                <div
                  className="absolute right-0 bottom-0 h-1.5 w-1.5 rounded-full ring-2 ring-white sm:h-2.5 sm:w-2.5"
                  style={{ backgroundColor: theme.info }}
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white sm:text-lg">
                  AI Chatbot Desa {desaConfig?.nama_desa}
                </h3>
                <p
                  className="text-[9px] sm:text-xs"
                  style={{ color: theme.warning }}
                >
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-white transition-colors hover:bg-white/20 sm:h-8 sm:w-8"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 space-y-2 overflow-y-auto bg-gray-50 px-2 pt-2 pb-1.5 sm:space-y-4 sm:px-4 sm:pt-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-1 sm:gap-2 ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!message.isUser && (
                  <Bot
                    className="h-4 w-4 flex-shrink-0 sm:h-6 sm:w-6"
                    style={{ color: theme.primary }}
                  />
                )}
                <div
                  className={`flex flex-col gap-0.5 sm:gap-1 ${
                    message.isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm shadow-sm transition-all duration-200 sm:max-w-[280px] sm:px-4 sm:py-2.5 sm:text-base ${
                      message.isUser
                        ? "rounded-br-sm text-white"
                        : message.isError
                          ? "rounded-bl-sm border border-red-200 bg-red-50 text-red-600"
                          : "rounded-bl-sm bg-white text-gray-800"
                    }`}
                    style={
                      message.isUser
                        ? {
                            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                            marginLeft: "auto",
                          }
                        : {}
                    }
                  >
                    <div className="break-words">
                      {renderMessageContent(message.text)}
                    </div>
                  </div>
                  <span
                    className={`flex items-center gap-0.5 text-[9px] text-gray-500 sm:gap-1 sm:text-xs ${
                      message.isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {message.isUser ? (
                      <Check className="h-2 w-2 sm:h-3 sm:w-3" />
                    ) : null}
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-1 sm:gap-2">
                <Bot
                  className="h-4 w-4 animate-pulse sm:h-6 sm:w-6"
                  style={{ color: theme.accent }}
                />
                <div className="max-w-[85%] rounded-2xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-sm sm:px-4 sm:py-2 sm:text-sm">
                  <div className="flex gap-1">
                    <div className="h-1 w-1 animate-bounce rounded-full bg-gray-400 sm:h-2 sm:w-2"></div>
                    <div
                      className="h-1 w-1 animate-bounce rounded-full bg-gray-400 sm:h-2 sm:w-2"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-1 w-1 animate-bounce rounded-full bg-gray-400 sm:h-2 sm:w-2"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="rounded-b-xl bg-white p-2 sm:p-4">
            <div className="relative flex items-center">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  } else if (e.key === " ") {
                    e.stopPropagation();
                  }
                }}
                placeholder="Ketik pesan atau tanyakan sesuatu"
                className="w-full resize-none rounded-full border border-gray-200 bg-gray-50 py-1.5 pr-9 pl-2.5 text-xs focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none sm:py-2 sm:pr-12 sm:pl-4 sm:text-sm"
                rows={1}
                style={{ minHeight: "32px", maxHeight: "100px" }}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="absolute top-1/2 right-1 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 sm:right-1.5 sm:h-8 sm:w-8"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                }}
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <PengaduanPopup
        isOpen={isPengaduanOpen}
        onClose={() => setIsPengaduanOpen(false)}
      />
    </>
  );
}
