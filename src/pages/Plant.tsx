import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Input } from "@/components/ui/input"
import HealthLogCard from "@/components/elements/HealthLogCard"
import { motion } from "framer-motion"
import { FaLeaf } from "react-icons/fa"
import { IoIosCalendar } from "react-icons/io"

interface Plant {
  dateOfPlanting: string
  image: string
  name: string
  species: string
  comment: string
}

interface HealthLog {
  attachment: string
  name: string
  _id: string
  dateOfDiagnosis: string
  comment: string
}

const Plant = () => {
  const [plant, setPlant] = useState<Plant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [logs, setLogs] = useState<HealthLog[]>([])
  const location = useLocation()

  useEffect(() => {
    const parts = location.pathname.split("/")
    const _id = parts[parts.length - 1]

    const fetchData = async () => {
      try {
        const [plantRes, logsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/plant/getPlant/${_id}`, {
            headers: { Authorization: localStorage.getItem("token") },
            withCredentials: true,
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/healthlog/getHealthLogsByPlantId/${_id}`, {
            headers: { Authorization: localStorage.getItem("token") },
            withCredentials: true,
          }),
        ])

        setPlant(plantRes.data)
        setLogs(logsRes.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [location.pathname])

  if (isLoading || !plant) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-600">
        Loading...
      </div>
    )
  }

  const date = new Date(plant.dateOfPlanting)
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

  return (
    <div className="px-6 py-10 overflow-y-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          {plant.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Plant Overview & Health History</p>
      </div>

      {/* Plant Overview Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row items-start gap-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        {/* Plant Image */}
        <div className="flex-shrink-0">
          <img
            src={plant.image}
            alt={plant.name}
            className="w-48 h-48 rounded-xl object-cover border border-gray-200 shadow-sm"
          />
        </div>

        {/* Plant Info */}
        <div className="flex-1 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-gray-600">Plant Name</label>
              <Input
                disabled
                value={plant.name}
                className="mt-1 bg-gray-50 border-gray-200 focus-visible:ring-green-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Species</label>
              <Input
                disabled
                value={plant.species}
                className="mt-1 bg-gray-50 border-gray-200 focus-visible:ring-green-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Planting</label>
              <Input
                disabled
                value={formattedDate}
                className="mt-1 bg-gray-50 border-gray-200 focus-visible:ring-green-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Comment</label>
              <Input
                disabled
                value={plant.comment}
                className="mt-1 bg-gray-50 border-gray-200 focus-visible:ring-green-600"
              />
            </div>
          </div>

          {/* Icons Summary */}
          <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <FaLeaf className="text-green-600" />
              <span className="text-sm">{plant.species}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <IoIosCalendar className="text-green-600" />
              <span className="text-sm">Planted on {formattedDate}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Health Logs Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Health Logs</h2>

        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm italic ml-1">
            No health logs available for this plant yet.
          </p>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {logs.map((healthLog, i) => (
              <HealthLogCard
                key={healthLog._id || i}
                image={healthLog.attachment}
                name={healthLog.name}
                _id={healthLog._id}
                dateofDiagnosis={healthLog.dateOfDiagnosis}
                comment={healthLog.comment}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Plant
