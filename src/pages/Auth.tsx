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
        toast.success(`Welcome back, ${user.name?.split(" ")[0] || "gardener"} 🌿`)
        navigate("/plants", { replace: true })
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
    <div className="h-screen w-screen flex flex-col md:flex-row bg-white">
      {/* Left Side – Auth Section */}
      <div className="flex flex-col justify-center items-center md:w-1/2 px-8 md:px-20 py-12 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-sm w-full"
        >
          {/* Brand */}
          <div className="flex items-center justify-center md:justify-start gap-2 mb-8">
            <Leaf className="h-9 w-9 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Aarchid
            </h1>
          </div>

          {/* Headline */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Sign in to your account
          </h2>
          <p className="text-gray-600 text-sm mb-10 leading-relaxed">
            Continue growing smarter with AI-powered insights and effortless plant care.
          </p>

          {/* Google Sign-In */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={signInWithGoogle}
            className="flex items-center justify-center gap-3 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
          >
            <FaGoogle className="text-white text-lg" />
            Sign in with Google
          </motion.button>

          {/* Secondary CTA */}
          <p className="text-xs text-gray-400 mt-8">
            By signing in, you agree to our{" "}
            <a href="#" className="text-green-700 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-green-700 hover:underline">
              Privacy Policy
            </a>.
          </p>
        </motion.div>
      </div>

      {/* Right Side – Visual / Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden md:flex md:w-1/2 h-full relative bg-green-50 overflow-hidden"
      >
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=2000"
          alt="Plant aesthetic"
          className="object-cover w-full h-full"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-white/70 to-transparent" />

        {/* Overlay text or tagline */}
        <div className="absolute left-10 bottom-16 max-w-xs">
          <h3 className="text-3xl font-bold text-gray-900 leading-snug">
            Nature meets intelligence.
          </h3>
          <p className="text-gray-700 text-sm mt-2">
           Helping you care, detect, and grow with precision.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Auth
