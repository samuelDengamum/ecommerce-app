"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import io from "socket.io-client";

type Message = {
  id?: string;
  text: string;
  sender: "user" | "agent";
  time?: string;
  timestamp?: string | Date;
};

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(isOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.id) {
        localStorage.setItem("lastReadMsgId", lastMsg.id);
      }
      setUnreadCount(0);
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    queueMicrotask(() => {
      setIsLoggedIn(!!token);
      setIsAdmin(user?.role === "admin");
    });

    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      setIsLoggedIn(!!token);
      setIsAdmin(user?.role === "admin");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authchange", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authchange", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      const newSocket = io("http://localhost:5000", {
        query: { token: localStorage.getItem("token") },
        transports: ["websocket"],
      });
      socketRef.current = newSocket;

      newSocket.on("connect", () => {
        console.log("SupportChat connected to socket server");
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const sessionId = user?._id || user?.id || 'guest-' + Math.random().toString(36).substr(2, 9);
        
        newSocket.emit("join", {
          sessionId: sessionId,
          name: user?.name || "User",
          email: user?.email || ""
        });
      });

      newSocket.on("chat_history", (history) => {
        setMessages(history || []);
        if (history && history.length > 0 && !isOpenRef.current) {
          const lastReadId = localStorage.getItem("lastReadMsgId");
          let unread = 0;
          for (let i = history.length - 1; i >= 0; i--) {
            if (history[i].id === lastReadId) break;
            if (history[i].sender === 'agent') {
              unread++;
            } else {
              break;
            }
          }
          setUnreadCount(unread);
        }
        scrollToBottom();
      });

      newSocket.on("receive_user_msg", (message) => {
        setMessages((prev) => {
          if (prev.find(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
        if (!isOpenRef.current && message.sender === 'agent') {
          setUnreadCount((prev) => prev + 1);
        }
        scrollToBottom();
      });

      newSocket.on("disconnect", () => {
        console.log("SupportChat disconnected from socket server");
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isLoggedIn, isAdmin]);

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (!isLoggedIn) {
      setInputValue("");
      setIsOpen(false);
      router.push("/login");
      return;
    }

    if (socketRef.current) {
      const tempId = Date.now().toString();
      const message = {
        id: tempId,
        text: inputValue,
        sender: "user" as const,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      // Add locally immediately for responsive UI
      setMessages((prev) => [...prev, message]);
      
      // Emit to server (match server.js expectation)
      socketRef.current.emit("user_msg", { text: inputValue });
      setInputValue("");
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      if (socketRef.current) {
        socketRef.current.emit("mark_as_read");
      }
    }
  };

  if (isAdmin) {
    return null;
  }

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-50 ${isOpen ? "pointer-events-none" : ""}`}>
        <button
          onClick={toggleChat}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"}`}
          aria-label="Open support chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <div
        className={`fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100vh-100px)] bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-75 opacity-0 translate-y-8 pointer-events-none"}`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span translate="no" className="text-white font-bold text-sm">NS</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm" translate="no">Nexis Support</h3>
              <p className="text-blue-100 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Online
              </p>
            </div>
          </div>
          <button onClick={toggleChat} className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
          {messages.map((msg, index) => (
            <div key={msg.id || index} className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}>
              <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.sender === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-slate-800 border border-white/5 text-slate-200 rounded-bl-sm"}`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">
                {msg.time || (msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "")}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-950 border-t border-white/5 shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-slate-900 border border-white/10 text-slate-200 text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
            />
            <button type="submit" disabled={!inputValue.trim()} className="absolute right-1 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 disabled:opacity-0 disabled:scale-75 disabled:pointer-events-none">
              <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <div className="text-center mt-3">
            <span translate="no" className="text-[10px] text-slate-500 font-medium tracking-wide">Powered by Nexis Assist</span>
          </div>
        </div>
      </div>
    </>
  );
}
