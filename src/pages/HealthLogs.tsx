import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { FaCaretDown, FaSpinner } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import HealthLogCard from "@/components/elements/HealthLogCard"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

interface Plant {
  _id: string
  name: string
}

interface HealthLog {
  _id: string
  name: string
  attachment: string
  dateOfDiagnosis: string
  comment: string
  plant_id: string
}

const HealthLogs = () => {
  const [logType, setLogType] = useState<string | null>(null)
  const [logTypeId, setLogTypeId] = useState("")
  const [types, setTypes] = useState<Plant[]>([])
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Create Log States
  const [logName, setLogName] = useState("")
  const [relatedType, setRelatedType] = useState("")
  const [dateOfLog, setDateOfLog] = useState("")
  const [comment, setComment] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [logResult, setLogResult] = useState("")
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true)
      try {
        const userId = localStorage.getItem("_id")
        const [plantsRes, logsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/plant/getPlantsByUserId/${userId}`, {
            headers: { Authorization: localStorage.getItem("token") },
            withCredentials: true,
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/healthlog/getHealthLogsByUserId/${userId}`, {
            headers: { Authorization: localStorage.getItem("token") },
            withCredentials: true,
          }),
        ])

        setTypes(plantsRes.data.map((p: Plant) => ({ _id: p._id, name: p.name })))
        setHealthLogs(logsRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [])

  const filteredLogs = logType
    ? healthLogs.filter((log) => log.plant_id === logTypeId)
    : healthLogs

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setFile(event.target.files[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!logName || !relatedType || !file)
      return toast.error("Please fill in all required fields")

    const data = new FormData()
    data.append("user_id", localStorage.getItem("_id") || "")
    data.append("attachment", file)
    data.append("plant_id", relatedType)
    data.append("dateOfDiagnosis", dateOfLog)
    data.append("comment", comment)
    data.append("name", logName)

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/healthlog/createNewHealthLog/`,
      data,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    )

    toast.success("Health Log Created Successfully 🌿")
    setShowResult(true)
    setLogResult(res.data.diagnosisByModel)
  }

  const handleSave = () => {
    setLogName("")
    setRelatedType("")
    setDateOfLog("")
    setComment("")
    setFile(null)
    setLogResult("")
    setShowResult(false)
    toast.success("Log Saved Successfully")
  }

  return (
    <div className="px-6 py-10 bg-gray-50 min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Health Logs
        </h1>

        {/* Filter + Create */}
        <div className="flex items-center gap-3">
          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-gray-300">
                <FaCaretDown />
                {logType || "All Logs"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {types.map((type, i) => (
                <DropdownMenuItem
                  key={i}
                  onSelect={() => {
                    setLogType(type.name)
                    setLogTypeId(type._id)
                  }}
                >
                  {type.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onSelect={() => setLogType(null)}>
                All Logs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create New Log */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                + New Log
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md font-semibold space-y-4">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Create Health Log
                </DialogTitle>
              </DialogHeader>

              <label>Log Name</label>
              <Input
                value={logName}
                onChange={(e) => setLogName(e.target.value)}
                placeholder="e.g. Fungal Leaf Spot"
              />

              <label>Plant</label>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 py-2 border border-gray-300 rounded-md px-3 text-sm text-gray-600">
                  <FaCaretDown /> {relatedType || "Select Plant"}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {types.map((type, i) => (
                    <DropdownMenuItem
                      key={i}
                      onSelect={() => setRelatedType(type._id)}
                    >
                      {type.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <label>Date of Diagnosis</label>
              <Input
                type="date"
                value={dateOfLog}
                onChange={(e) => setDateOfLog(e.target.value)}
              />

              <label>Comments</label>
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Any observations..."
              />

              <label>Image</label>
              <Input type="file" onChange={handleFileChange} />

              <Button
                onClick={handleSubmit}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full"
              >
                Submit
              </Button>

              {/* Model Result */}
              {showResult && (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-700">Model Diagnosis</h3>
                  <textarea
                    disabled
                    value={logResult}
                    className="w-full h-32 p-2 border border-gray-200 rounded-md text-sm text-gray-700 resize-none bg-white"
                  />
                  <Button
                    onClick={handleSave}
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white w-full"
                  >
                    Save
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-gray-600">
          <FaSpinner className="animate-spin text-green-600 text-2xl" />
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
        >
          {filteredLogs.map((log, i) => (
            <HealthLogCard
              key={log._id || i}
              image={log.attachment}
              name={log.name}
              _id={log._id}
              dateofDiagnosis={log.dateOfDiagnosis}
              comment={log.comment}
            />
          ))}
          {filteredLogs.length === 0 && (
            <p className="text-gray-500 col-span-full text-center mt-10">
              No logs found for this plant.
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default HealthLogs
