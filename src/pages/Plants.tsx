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
import { useRecoilValue } from "recoil"
import { User, UserI } from "@/atom"
import PlantCard from "@/components/elements/PlantCard"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

interface Plant {
  species: string
  name: string
  image: string
  dateOfPlanting: string
  comment: string
  _id: string
}

const Plants = () => {
  const [plantSpecies, setPlantSpecies] = useState<string | null>(null)
  const [plants, setPlants] = useState<Plant[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [plantName, setPlantName] = useState("")
  const [relatedSpecies, setRelatedSpecies] = useState("")
  const [dateOfPlantation, setDateOfPlantation] = useState("")
  const [comment, setComment] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [species, setSpecies] = useState<string[]>([])
  const [newSpecies, setNewSpecies] = useState("")
  const user = useRecoilValue<UserI | null>(User)

  useEffect(() => {
    const fetchPlants = async () => {
      setIsLoading(true)
      try {
        if (user?.plantSpecies) setSpecies(user.plantSpecies)
        const _id = localStorage.getItem("_id")
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/plant/getPlantsByUserId/${_id}`,
          {
            headers: { Authorization: localStorage.getItem("token") },
            withCredentials: true,
          }
        )
        setPlants(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlants()
  }, [user])

  const filteredPlants = plantSpecies
    ? plants.filter((p) => p.species === plantSpecies)
    : plants

  const handleAddSpecies = async () => {
    if (!newSpecies.trim()) return toast.error("Please enter a valid species name")
    const newList = [...species, newSpecies.trim()]
    const id = localStorage.getItem("_id")
    await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/updateUser/${id}`,
      { plantSpecies: newList },
      {
        headers: { Authorization: localStorage.getItem("token") },
        withCredentials: true,
      }
    )
    toast.success("New species added successfully 🌱")
    setSpecies(newList)
    setRelatedSpecies(newSpecies.trim())
    setNewSpecies("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!plantName || !relatedSpecies || !file)
      return toast.error("Please fill in all required fields")

    const data = new FormData()
    data.append("user_id", localStorage.getItem("_id") || "")
    data.append("name", plantName)
    data.append("species", relatedSpecies)
    data.append("dateOfPlanting", dateOfPlantation)
    data.append("comment", comment)
    data.append("image", file)

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/plant/createNewPlant`,
      data,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    )
    toast.success("New Plant Added Successfully 🌿")
    setPlants((prev) => [...prev, res.data])
    setPlantName("")
    setRelatedSpecies("")
    setDateOfPlantation("")
    setComment("")
    setFile(null)
  }

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          My Plants
        </h1>

        {/* Species Filter + Add Button */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300"
              >
                <FaCaretDown /> {plantSpecies || "All Species"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {species.map((sp, i) => (
                <DropdownMenuItem key={i} onSelect={() => setPlantSpecies(sp)}>
                  {sp}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onSelect={() => setPlantSpecies(null)}>
                All Species
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Plant Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm transition-all">
                + New Plant
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md rounded-xl p-6 font-semibold bg-white shadow-lg border border-gray-100 space-y-4">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800">
                  Add a New Plant
                </DialogTitle>
                <p className="text-sm text-gray-500 font-normal">
                  Fill in the details below to add a new plant to your collection.
                </p>
              </DialogHeader>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Plant Name */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Plant Name
                  </label>
                  <Input
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    placeholder="e.g. Monstera"
                    className="border-gray-300 focus-visible:ring-green-600"
                  />
                </div>

                {/* Species */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Species
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-between gap-2 py-2 border border-gray-300 rounded-md px-3 text-sm text-gray-700 hover:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all">
                      <span>{relatedSpecies || "Select Species"}</span>
                      <FaCaretDown className="text-gray-500" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="rounded-md shadow-lg border border-gray-100">
                          {species.length > 0 ? (
                            species.map((sp, i) => (
                              <DropdownMenuItem
                                key={i}
                                onSelect={() => setRelatedSpecies(sp)}
                                className="text-sm text-gray-700 hover:text-green-700"
                              >
                                {sp}
                              </DropdownMenuItem>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-xs text-gray-500">
                              No species found yet.
                            </div>
                          )}

                          {/* Add new species */}
                          <div className="px-3 py-3 border-t border-gray-100 bg-gray-50 rounded-b-md space-y-2">
                            <p className="text-xs text-gray-500">Add a new species</p>
                            <div className="flex gap-2">
                              <Input
                                value={newSpecies}
                                onChange={(e) => setNewSpecies(e.target.value)}
                                placeholder="e.g. Ficus Lyrata"
                                className="text-sm flex-1 border-gray-300"
                              />
                              <Button
                                size="sm"
                                onClick={handleAddSpecies}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Date of Plantation */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Date of Plantation
                      </label>
                      <Input
                        type="date"
                        value={dateOfPlantation}
                        onChange={(e) => setDateOfPlantation(e.target.value)}
                        className="border-gray-300 focus-visible:ring-green-600"
                      />
                    </div>

                    {/* Comments */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Comment
                      </label>
                      <Input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Optional notes..."
                        className="border-gray-300 focus-visible:ring-green-600"
                      />
                    </div>

                    {/* Image */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Image
                      </label>
                      <Input
                        type="file"
                        onChange={(e) =>
                          setFile(e.target.files ? e.target.files[0] : null)
                        }
                        className="border-gray-300 focus-visible:ring-green-600"
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 flex justify-end">
                    <Button
                      onClick={handleSubmit}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm transition-all"
                    >
                      Add Plant
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-green-600 text-2xl" />
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
        >
          {filteredPlants.map((plant, i) => (
            <PlantCard
              key={plant._id || i}
              plantName={plant.name}
              plantimage={plant.image}
              species={plant.species}
              plantDop={plant.dateOfPlanting}
              plantcomment={plant.comment}
              plantId={plant._id}
            />
          ))}
          {filteredPlants.length === 0 && (
            <p className="text-gray-500 col-span-full text-center mt-10">
              No plants found for this species.
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default Plants
