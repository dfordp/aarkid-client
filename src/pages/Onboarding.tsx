import { useState } from "react"
import { motion } from "framer-motion"
import { FaPlus, FaTimes } from "react-icons/fa"
import { InputDisabled } from "@/components/ui/inputdisabled"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { Authenticated } from "@/atom"
import toast from "react-hot-toast"

const Onboarding = () => {
  const navigate = useNavigate()
  const setAuthenticated = useSetRecoilState(Authenticated)

  const email = localStorage.getItem("email")
  const [name, setName] = useState("")
  const [plantSpecies, setPlantSpecies] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [speciesInput, setSpeciesInput] = useState("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files && event.target.files.length > 0 ? event.target.files[0] : null)
  }

  const handleAddPlantSpecies = () => {
    if (!speciesInput.trim()) return
    setPlantSpecies([...plantSpecies, speciesInput.trim()])
    setSpeciesInput("")
    toast.success("Plant species added 🌿")
  }

  const handleRemovePlantSpecies = (index: number) => {
    setPlantSpecies(plantSpecies.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    try {
      if (!name.trim()) {
        toast.error("Please enter your name.")
        return
      }

      const formData = new FormData()
      formData.append("email", email ?? "")
      formData.append("name", name)
      plantSpecies.forEach((species) => formData.append("plantSpecies", species))
      if (selectedFile) formData.append("selectedFile", selectedFile)

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )

      const { token, newUser } = res.data
      localStorage.setItem("token", token)
      localStorage.setItem("_id", newUser._id)
      setAuthenticated(true)
      toast.success("Welcome to Aarchid 🌱")
      navigate("/plants")
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-b from-white to-green-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-md border border-green-100 w-full max-w-3xl p-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Aarchid</h1>
          <p className="text-gray-600 text-sm max-w-md text-center">
            Let’s personalize your experience. Add your details and tell us about the plants you care for.
          </p>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold text-gray-700 text-sm">Email</label>
            <InputDisabled value={email} className="my-2" />
          </div>

          <div>
            <label className="font-semibold text-gray-700 text-sm">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="my-2"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 text-sm">Profile Image</label>
            <Input type="file" className="my-2" onChange={handleFileChange} />
          </div>

          <div>
            <label className="font-semibold text-gray-700 text-sm">Your Plant Species</label>
            <div className="flex items-center gap-2 my-2">
              <Input
                type="text"
                value={speciesInput}
                onChange={(e) => setSpeciesInput(e.target.value)}
                placeholder="E.g. Fiddle Leaf Fig"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddPlantSpecies}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                <FaPlus />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {plantSpecies.map((species, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-full px-3 py-1 text-sm"
                >
                  <span>{species}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePlantSpecies(index)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Submit */}
        <div className="flex justify-end mt-10">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg transition-all"
          >
            Get Started
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default Onboarding
