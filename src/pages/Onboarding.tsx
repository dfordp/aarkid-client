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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [speciesInput, setSpeciesInput] = useState("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
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

  const handleSubmit = async (event: React.FormEvent) => {
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
        { headers: { "Content-Type": "multipart/form-data" } }
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
    <div className="h-screen w-screen flex flex-col md:flex-row bg-white">
      {/* Left Section - Onboarding Form */}
      <div className="flex flex-col justify-center items-center md:w-1/2 px-8 md:px-20 py-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Aarchid</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Email</label>
              <InputDisabled
                value={email}
                className="rounded-lg border-none bg-gray-50 focus:ring-green-500 focus:border-green-500 shadow-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="rounded-lg border-none bg-gray-50 focus:ring-green-500 focus:border-green-500 shadow-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Profile Image</label>
              <div className="flex flex-col gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="rounded-lg border-none bg-gray-50 focus:ring-green-500 focus:border-green-500 shadow-none file:mr-0 file:rounded-md file:border-0 file:bg-green-600 file:text-white file:px-4 file:py-2 hover:file:bg-green-700 transition-all w-full"
                  style={{ paddingRight: 0 }}
                />
                {previewUrl && (
                  <div className="flex justify-start">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border border-green-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Plant Species Section */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Your Plant Species
              </label>
              <div className="flex items-center gap-2 mb-3">
                <Input
                  type="text"
                  value={speciesInput}
                  onChange={(e) => setSpeciesInput(e.target.value)}
                  placeholder="e.g. Fiddle Leaf Fig"
                  className="rounded-lg border-none bg-gray-50 focus:ring-green-500 focus:border-green-500 shadow-none"
                />
                <Button
                  type="button"
                  onClick={handleAddPlantSpecies}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                >
                  <FaPlus size={14} />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
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

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-base transition-all shadow-sm hover:shadow-md"
              >
                Continue
              </Button>
            </div>
          </form>

        </motion.div>
      </div>

      {/* Right Section - Image and Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden md:flex md:w-1/2 h-full relative bg-green-50 overflow-hidden"
      >
        {/* Image */}
        <img
          src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=2000"
          alt="Plants growing with light"
          className="object-cover w-full h-full"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-white/80 to-transparent" />

        {/* Motivational Tagline */}
        <div className="absolute left-10 bottom-16 max-w-xs">
          <h3 className="text-3xl font-bold text-gray-900 leading-snug">
            Every plant tells a story.
          </h3>
          <p className="text-gray-700 text-sm mt-2">
            Aarchid helps you listen monitor growth, predict needs, and act with precision.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Onboarding