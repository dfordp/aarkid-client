import TopBar from "@/components/Topbar"
import { motion } from "framer-motion"
import { Leaf, Brain, Activity, Sparkles } from "lucide-react"

const features = [
  {
    icon: <Leaf className="h-6 w-6 text-green-600" />,
    title: "Personalized Plant Care",
    desc: "Receive tailored care routines for each plant from watering schedules to pruning reminders, all personalized to your environment."
  },
  {
    icon: <Activity className="h-6 w-6 text-green-600" />,
    title: "Lifecycle Insights",
    desc: "Track growth milestones, monitor health changes, and visualize your plant’s journey through clear, data-driven insights."
  },
  {
    icon: <Brain className="h-6 w-6 text-green-600" />,
    title: "AI-Powered Health Detection",
    desc: "Instantly detect signs of disease, nutrient deficiency, or stress through Google Gemini Pro’s advanced vision capabilities."
  },
  {
    icon: <Sparkles className="h-6 w-6 text-green-600" />,
    title: "Smart Chat Support",
    desc: "Ask Aarchid anything from diagnosing leaf discoloration to finding ideal soil conditions and get precise, AI-driven answers."
  },
]

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-green-50 text-gray-800 font-sans">
      <TopBar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center mt-40 px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center space-x-2 mb-3"
        >
          <Leaf className="h-9 w-9 text-green-600" />
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
            Aarchid
          </h1>
        </motion.div>

        <p className="mt-4 text-lg md:text-xl max-w-2xl text-gray-600 leading-relaxed">
          Helping you understand your plants on a deeper level, blending technology and nature into effortless growth.
        </p>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8 md:px-20 mt-28 mb-20"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center mb-3 space-x-2">
              {f.icon}
              <h3 className="font-semibold text-lg text-gray-800">{f.title}</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 text-sm border-t border-gray-100 mt-auto">
        <p>
          Built with 🌱 by{" "}
          <a
            href="https://www.dilpreetgrover.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-700 hover:text-green-700 transition-colors"
          >
            Dilpreet Grover
          </a>{" "}
          &{" "}
          <a
            href="https://www.linkedin.com/in/dhruv-singhal-992554257/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-700 hover:text-green-700 transition-colors"
          >
            Dhruv Singhal
          </a>
        </p>
      </footer>
    </div>
  )
}

export default LandingPage
