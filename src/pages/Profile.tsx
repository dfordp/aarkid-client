import { User, UserI } from "@/atom"
import { Input } from "@/components/ui/input"
import { useRecoilValue } from "recoil"
import { motion } from "framer-motion"

const Profile = () => {
  const user = useRecoilValue<UserI | null>(User)

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-600">
        Loading...
      </div>
    )
  }

  const date = new Date(user.createdAt)
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

  return (
    <div className="px-6 py-10 bg-gray-50 min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          My Profile
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          View and manage your account details
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-10 items-center"
      >
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={user.image}
            alt={user.name}
            className="w-40 h-40 rounded-full object-cover border-4 border-green-100 shadow-sm"
          />
        </div>

        {/* Info Section */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 font-medium">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <Input
              disabled
              value={user.name}
              className="mt-1 bg-gray-50 border-gray-200 focus-visible:ring-green-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <Input
              disabled
              value={user.email}
              className="mt-1 bg-gray-50 border-gray-200 focus-visible:ring-green-600"
            />
          </div>

          {/* Join Date */}
          <div>
            <label className="text-sm text-gray-600">Member Since</label>
            <Input
              disabled
              value={formattedDate}
              className="mt-1 bg-gray-50 border-gray-200 focus-visible:ring-green-600"
            />
          </div>

          {/* Plant Species */}
          <div>
            <label className="text-sm text-gray-600">Plant Species</label>
            <Input
              disabled
              value={
                user.plantSpecies.length > 0
                  ? user.plantSpecies.join(", ")
                  : "No species added yet"
              }
              className="mt-1 bg-gray-50 border-gray-200 focus-visible:ring-green-600"
            />
          </div>
        </div>
      </motion.div>

      {/* Optional - Footer Section */}
      <div className="mt-10 text-center text-gray-500 text-sm">
        <p>
          Built with 🌿 by{" "}
          <span className="font-semibold text-green-700">
            Dilpreet Grover & Dhruv Singhal
          </span>
        </p>
      </div>
    </div>
  )
}

export default Profile
