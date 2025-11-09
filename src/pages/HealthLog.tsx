import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Input } from "@/components/ui/input"
import ReactMarkdown from "react-markdown"
import { motion } from "framer-motion"
import { IoIosCalendar } from "react-icons/io"

interface Log {
  dateOfDiagnosis: string
  attachment: string
  name: string
  comment: string
  diagnosisByModel: string
}

const HealthLog = () => {
  const [log, setLog] = useState<Log | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const parts = location.pathname.split("/")
        const _id = parts[parts.length - 1]

        const logData = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/healthlog/getHealthLog/${_id}`,
          {
            headers: { Authorization: localStorage.getItem("token") },
            withCredentials: true,
          }
        )

        setLog(logData.data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLog()
  }, [location.pathname])

  if (isLoading || !log) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-600">
        Loading...
      </div>
    )
  }

  const date = new Date(log.dateOfDiagnosis)
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

  return (
    <div className="px-6 py-10 overflow-y-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Health Log
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Diagnosis details and model insights
        </p>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8"
      >
        {/* Image and Basic Info */}
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img
              src={log.attachment}
              alt={log.name}
              className="w-72 h-72 object-cover rounded-xl border border-gray-200 shadow-sm"
            />
          </div>

          {/* Log Info */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 font-medium">
            <div>
              <label className="text-sm text-gray-600">Log Name</label>
              <Input
                disabled
                value={log.name}
                className="mt-1 bg-gray-50 border-gray-200 focus-visible:ring-green-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Date of Diagnosis</label>
              <Input
                disabled
                value={formattedDate}
                className="mt-1 bg-gray-50 border-gray-200 focus-visible:ring-green-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Comment</label>
              <textarea
                disabled
                value={log.comment}
                className="mt-1 w-full min-h-[100px] bg-gray-50 border border-gray-200 rounded-md p-2 text-sm text-gray-700 resize-none focus-visible:ring-green-600"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-100" />

        {/* AI Diagnosis */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Diagnosis by Model
          </h2>
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            <ReactMarkdown>{log.diagnosisByModel}</ReactMarkdown>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 text-gray-600 text-sm">
          <IoIosCalendar className="text-green-600" />
          <span>Diagnosed on {formattedDate}</span>
        </div>
      </motion.div>
    </div>
  )
}

export default HealthLog
