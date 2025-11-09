import { motion } from "framer-motion"
import { FaGoogle } from "react-icons/fa"
import { signInWithPopup } from "firebase/auth"
import { googleProvider, auth } from "../helpers/firebase"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { Authenticated, User } from "@/atom"
import toast from "react-hot-toast"
import { Leaf } from "lucide-react"

const Auth = () => {
  const navigate = useNavigate()
  const setAuthenticated = useSetRecoilState(Authenticated)
  const setUser = useSetRecoilState(User)

  interface UserData {
    email: string
  }

  const sendUserData = async (data: UserData) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/getUserByEmailAuth/${data.email}`
      )

      if (response.data) {
        const { token, user } = response.data
        localStorage.setItem("token", token)
        localStorage.setItem("_id", user._id)
        localStorage.setItem("email", user.email)
        setAuthenticated(true)
        setUser(user)
        toast.success("Welcome back!")
        navigate("/plants")
        window.location.reload()
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        localStorage.setItem("email", data.email)
        toast("Let's get you started 🌱")
        navigate("/onboarding")
      } else {
        console.error(error)
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const email = result.user.email
      if (email) sendUserData({ email })
    } catch (error) {
      console.error(error)
      toast.error("Google sign-in failed. Please try again.")
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-white to-green-50">
      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-md p-10 w-[22rem] text-center border border-green-100"
      >
        {/* Logo + Heading */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Leaf className="h-9 w-9 text-green-600"/>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Aarchid
          </h1>
        </div>

        <p className="text-gray-600 mb-8 text-sm leading-relaxed">
          Sign in to continue caring for your plants with{" "}
          <span className="text-green-700 font-medium">Aarchid AI</span>.
        </p>

        {/* Google Sign-In Button */}
        <button
          onClick={signInWithGoogle}
          className="flex items-center justify-center gap-3 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
        >
          <FaGoogle className="text-white text-lg" />
          Sign in with Google
        </button>
      </motion.div>
    </div>
  )
}

export default Auth
