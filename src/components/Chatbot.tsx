import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, AlertCircle, Bot, Clock } from "lucide-react";
import axios from "axios";
import { API_CONFIG } from "../config/api";
import { useLocation } from "react-router-dom";
import { CHATBOT_MINIMIZE_EVENT } from "./NavbarDesa";
import { PengaduanPopup } from "./PengaduanPopup";
import React from "react";
import { useDesa } from "@/contexts/DesaContext";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
}

const STORAGE_KEY = "chatbot_messages";

// Consistent theme colors
const theme = {
  primary: "#2563EB", // Dark blue
  secondary: "#3B82F6", // Medium blue
  accent: "#60A5FA", // Light blue
  highlight: "#93C5FD", // Lighter blue
  link: "#1D4ED8", // Darker blue
  warning: "#22C55E", // Bright green
  info: "#86EFAC", // Light green
};

export function Chatbot() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { desaConfig } = useDesa();
  const [isOpen, setIsOpen] = useState(isHome);
  const [showPopup, setShowPopup] = useState(isHome);
  const [isPengaduanOpen, setIsPengaduanOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const lastScrollY = useRef(0);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

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

    setMessages((prev) => [
      ...prev,
      {
        text: messageToSend,
        isUser: true,
        timestamp: new Date().toISOString(),
      },
    ]);
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
      setMessages((prev) => [
        ...prev,
        {
          text: data.reply,
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: "Maaf, terjadi kesalahan. Silakan coba lagi.",
          isUser: false,
          timestamp: new Date().toISOString(),
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
            <span key={`text-${lastIndex}-${matchIndex}`}>
              {segment.substring(lastIndex, matchIndex)}
            </span>,
          );
        }

        if (match[1]) {
          segmentElements.push(
            <strong key={`bold-${matchIndex}`}>{match[1]}</strong>,
          );
        } else if (match[3]) {
          segmentElements.push(
            <em key={`italic-${matchIndex}`}>{match[3]}</em>,
          );
        }

        lastIndex = matchIndex + fullMatch.length;
      });

      if (lastIndex < segment.length) {
        segmentElements.push(
          <span key={`text-end-${lastIndex}`}>
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
          // Handle standalone URLs
          segmentElements.push(
            <a
              key={`url-${lastIndex}-${matchIndex}`}
              href={standaloneUrl}
              className={`text-[${theme.link}] underline hover:text-blue-800`}
              target="_blank" // Open standalone URLs in a new tab
              rel="noopener noreferrer"
            >
              {standaloneUrl}
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
        className="fixed right-20 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:scale-95"
        aria-label="Buka Form Pengaduan"
      >
        <AlertCircle className="h-6 w-6 text-white" />
      </button>

      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:ring-2 focus:outline-none active:scale-95 ${
          isOpen
            ? "pointer-events-none translate-y-4 scale-90 opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }`}
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
        }}
        aria-label="Buka Chatbot"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </button>

      {/* Chatbot Popup */}
      {showPopup && (
        <div
          className={`fixed right-4 bottom-20 z-50 flex h-[500px] w-96 max-w-[calc(100vw-2rem)] flex-col rounded-xl bg-white shadow-2xl transition-all duration-300 ease-in-out ${
            isOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-4 scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between rounded-t-xl p-4 text-white shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="h-8 w-8" style={{ color: theme.warning }} />
                <div
                  className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full ring-2 ring-white"
                  style={{ backgroundColor: theme.info }}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  AI Chatbot Desa {desaConfig?.nama_desa}
                </h3>
                <p className="text-xs" style={{ color: theme.warning }}>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-white transition-colors hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 space-y-4 overflow-y-auto bg-gray-50 px-4 pt-4 pb-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!message.isUser && (
                  <Bot
                    className="h-6 w-6 flex-shrink-0"
                    style={{ color: theme.primary }}
                  />
                )}
                <div
                  className={`flex flex-col gap-1 ${
                    message.isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[280px] rounded-2xl px-4 py-2 text-sm shadow-sm transition-all duration-200 ${
                      message.isUser
                        ? "rounded-br-sm text-white"
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
                    className={`flex items-center gap-1 text-xs text-gray-500 ${
                      message.isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2">
                <Bot
                  className="h-6 w-6 animate-pulse"
                  style={{ color: theme.accent }}
                />
                <div className="max-w-[80%] rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="rounded-b-xl bg-white p-4">
            <div className="relative flex items-center">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ketik pesan atau tanyakan sesuatu"
                className="w-full resize-none rounded-full border border-gray-200 bg-gray-50 py-2 pr-12 pl-4 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                rows={1}
                style={{ minHeight: "40px", maxHeight: "120px" }}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                }}
              >
                <Send className="h-4 w-4" />
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
