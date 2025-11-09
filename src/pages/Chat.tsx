import { useEffect, useRef, useState } from "react"
import { IoIosSend } from "react-icons/io"
import { Input } from "@/components/ui/input"
import { useRecoilValue } from "recoil"
import { User as UserAtom } from "@/atom"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import BotPic from "../assets/chatbotpic.jpg"
import { motion } from "framer-motion"

interface Message {
  user_id: string | null
  sent_By: string
  message_content: string
  createdAt: string
}

interface User {
  image: string
}

const Chat = () => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const user = useRecoilValue(UserAtom) as User

  useEffect(() => {
    const fetchMessages = async () => {
      const _id = localStorage.getItem("_id")
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/getMessagesByUserId/${_id}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
          withCredentials: true,
        }
      )
      setMessages(res.data)
    }
    fetchMessages()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async () => {
    if (!message.trim()) return
    const newMessage: Message = {
      user_id: localStorage.getItem("_id"),
      sent_By: "user",
      message_content: message,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newMessage])
    setMessage("")

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/message/createNewMessage`,
      newMessage,
      {
        headers: { Authorization: localStorage.getItem("token") },
        withCredentials: true,
      }
    )
    setMessages((prev) => [...prev, res.data as Message])
  }

  // Group messages by date
  const grouped = messages.reduce((acc: Record<string, Message[]>, msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString()
    acc[date] = acc[date] || []
    acc[date].push(msg)
    return acc
  }, {})

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 overflow-hidden">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 min-h-0">
        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            {/* Date Divider */}
            <div className="flex justify-center mb-4">
              <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
                {date}
              </div>
            </div>

            {/* Message Bubbles */}
            {msgs.map((msg, idx) => {
              const isUser = msg.sent_By === "user"
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
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
                    <ReactMarkdown
                      className="prose prose-sm text-inherit"
                      components={{
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        p: ({ node, ...props }) => <p {...props} className="m-0" />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        strong: ({ node, ...props }) => (
                          <strong className="font-semibold text-green-700" {...props} />
                        ),
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        code: ({ node, ...props }) => (
                          <code
                            className="bg-gray-100 px-1 py-0.5 rounded text-sm"
                            {...props}
                          />
                        ),
                      }}
                    >
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
                      src={user?.image}
                      alt="User"
                      className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Section */}
       <div className="border-t border-gray-200 bg-white py-3 px-4 flex items-center gap-3 shadow-sm flex-none">
        <Input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow bg-gray-50 border border-gray-200 rounded-xl focus-visible:ring-green-600 h-11 min-h-0"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{ resize: "none" }}
        />
        <button
          onClick={handleSubmit}
          className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition-all text-white shadow-sm flex-none"
        >
          <IoIosSend size={22} />
        </button>
      </div>
    </div>
  )
}

export default Chat
