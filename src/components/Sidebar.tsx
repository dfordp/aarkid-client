import {
  IoLeafOutline,
  IoPersonOutline,
  IoLogOutOutline,
} from "react-icons/io5"
import { MdOutlineMedicalServices } from "react-icons/md"
import { FiMessageSquare } from "react-icons/fi"
import { BsListTask } from "react-icons/bs"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { Authenticated } from "@/atom"
import toast from "react-hot-toast"

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuthenticated = useSetRecoilState(Authenticated)

  const menuItems = [
    { name: "Plants", icon: IoLeafOutline, path: "/plants" },
    { name: "Checkups", icon: MdOutlineMedicalServices, path: "/healthlogs" },
    { name: "Tasks", icon: BsListTask, path: "/tasks" },
    { name: "Chat", icon: FiMessageSquare, path: "/chat" },
    { name: "Profile", icon: IoPersonOutline, path: "/profile" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("_id")
    setAuthenticated(false)
    navigate("/")
    toast.success("Logged out successfully 🌿")
  }

  return (
    <aside
      className="
        hidden md:flex 
        fixed top-16 left-0 z-20 
        h-[60vh] w-20 
        bg-white/90 backdrop-blur-lg 
        border-r border-gray-100 
        shadow-lg rounded-tr-2xl rounded-br-2xl
        flex-col justify-between items-center py-6
      "
    >
      {/* Navigation */}
      <nav className="flex flex-col items-center gap-6 mt-4">
        {menuItems.map((item) => {
          const IconComponent = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.name}
              to={item.path}
              title={item.name}
              className={`relative group flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-all ${
                isActive
                  ? "bg-green-50 text-green-700 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-green-700"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 w-[3px] h-5 bg-green-600 rounded-r-md" />
              )}
              <IconComponent size={22} />
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="flex flex-col items-center justify-center mb-4">
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <IoLogOutOutline size={22} />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
