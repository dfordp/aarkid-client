import { useEffect, useRef, useState, useCallback } from "react";
import { IoIosSend } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { useRecoilValue } from "recoil";
import { User as UserAtom } from "@/atom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import BotPic from "../assets/chatbotpic.jpg";
import { motion } from "framer-motion";

interface Message {
  _id?: string;
  user_id: string | null;
  sent_By: "user" | "gemini";
  message_content: string;
  createdAt: string; // ISO string
}

interface User {
  image: string;
}

const PAGE_SIZE = 20;
const TOP_TRIGGER_ROOT_MARGIN = "0px 0px -85% 0px"; // only when user is very near the top
const MIN_MESSAGES_BEFORE_LOAD = 15; // don’t attempt loading older until we have this many in view

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const lastLoadTime = useRef<number>(0); // debounce loads
  const user = useRecoilValue(UserAtom) as User;

  const sortAscending = (list: Message[]) =>
    [...list].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  const fetchPage = useCallback(
    async (pageNum: number) => {
      const _id = localStorage.getItem("_id");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/getMessagesByUserId/${_id}?page=${pageNum}&limit=${PAGE_SIZE}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
          withCredentials: true,
        }
      );
      const data: Message[] = Array.isArray(res.data?.data) ? res.data.data : res.data;
      const normalized = sortAscending(data || []);
      const totalPages = res.data?.totalPages ?? undefined;
      return { items: normalized, totalPages };
    },
    []
  );

  // Initial load: newest page (assumed page 1 = newest page from your backend; if not, just keep your existing mapping)
  useEffect(() => {
    (async () => {
      try {
        const { items, totalPages } = await fetchPage(1);
        setMessages(items);
        setPage(1);
        setHasMore((totalPages ?? 2) > 1 || (items?.length ?? 0) === PAGE_SIZE);
        // Scroll to the bottom after first paint
        setTimeout(() => scrollToBottom("auto"), 50);
      } catch (e) {
        console.error("❌ Initial messages load failed:", e);
      }
    })();
  }, [fetchPage]);

  // IntersectionObserver to load older messages only when truly near the top
  useEffect(() => {
    const container = scrollRef.current;
    const target = topSentinelRef.current;
    if (!container || !target) return;

    const io = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;

        // guard: avoid eager loading
        const now = Date.now();
        if (now - lastLoadTime.current < 500) return; // debounce
        if (loadingOlder || !hasMore) return;
        if (messages.length < MIN_MESSAGES_BEFORE_LOAD) return;

        // capture current scroll metrics BEFORE we prepend
        const prevScrollHeight = container.scrollHeight;
        setLoadingOlder(true);

        try {
          const nextPage = page + 1;
          const { items } = await fetchPage(nextPage);

          if (!items.length) {
            setHasMore(false);
          } else {
            // we are loading older messages => they should appear ABOVE,
            // so prepend them to the start (all ascending)
            setMessages((prev) => [...items, ...prev]);

            // maintain the visual position after DOM updates
            requestAnimationFrame(() => {
              const newScrollHeight = container.scrollHeight;
              container.scrollTop = newScrollHeight - prevScrollHeight;
            });

            setPage(nextPage);
          }
        } catch (e) {
          console.error("❌ Loading older failed:", e);
        } finally {
          setLoadingOlder(false);
          lastLoadTime.current = Date.now();
        }
      },
      { root: container, rootMargin: TOP_TRIGGER_ROOT_MARGIN, threshold: 0 }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [messages.length, hasMore, loadingOlder, page, fetchPage]);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    // optimistic user message (newest goes to bottom => push at the end)
    const newUserMsg: Message = {
      user_id: localStorage.getItem("_id"),
      sent_By: "user",
      message_content: message,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => sortAscending([...prev, newUserMsg]));
    setMessage("");
    // keep user pinned to bottom on send
    scrollToBottom("smooth");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/createNewMessage`,
        newUserMsg,
        {
          headers: { Authorization: localStorage.getItem("token") },
          withCredentials: true,
        }
      );

      // append gemini response (also newest) and keep bottom pinned
      const geminiMsg = res.data as Message;
      setMessages((prev) => sortAscending([...prev, geminiMsg]));
      scrollToBottom("smooth");
    } catch (e) {
      console.error("❌ Sending message failed:", e);
    }
  };

  // Group by date for dividers (optional, keeps order)
  const groupedByDate = messages.reduce((acc: Record<string, Message[]>, m) => {
    const key = new Date(m.createdAt).toLocaleDateString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  const dateKeys = Object.keys(groupedByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Scroll container */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 min-h-0">
        {/* Top sentinel to trigger older loads only when truly near top */}
        <div ref={topSentinelRef} style={{ height: 1 }} />

        {dateKeys.map((date) => (
          <div key={date}>
            <div className="flex justify-center my-4">
              <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
                {date}
              </div>
            </div>

            {groupedByDate[date].map((msg, idx) => {
              const isUser = msg.sent_By === "user";
              return (
                <motion.div
                  key={msg._id || `${date}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex items-end gap-2 mb-4 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <img
                      src={BotPic}
                      alt="Bot"
                      className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                    />
                  )}

                  <div
                    className={`max-w-xs sm:max-w-md md:max-w-lg p-3 rounded-2xl shadow-sm ${
                      isUser
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                    }`}
                  >
                    <ReactMarkdown className="prose prose-sm text-inherit">
                      {msg.message_content}
                    </ReactMarkdown>
                    <div
                      className={`text-[10px] mt-1 ${
                        isUser ? "text-green-100 text-right" : "text-gray-400"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {isUser && (
                    <img
                      src={(user && user.image) || ""}
                      alt="User"
                      className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}

        {loadingOlder && (
          <div className="text-center text-xs text-gray-400 py-2">
            Loading older messages…
          </div>
        )}

        {/* Bottom anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-200 bg-white py-3 px-4 flex items-center gap-3 shadow-sm flex-none">
        <Input
          type="text"
          placeholder="Type your message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="flex-grow bg-gray-50 border border-gray-200 rounded-xl focus-visible:ring-green-600 h-11"
        />
        <button
          onClick={handleSubmit}
          className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition-all text-white shadow-sm flex-none"
        >
          <IoIosSend size={22} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
