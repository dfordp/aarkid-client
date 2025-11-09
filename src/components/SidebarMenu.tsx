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

interface SidebarMenuProps {
  onClose: () => void
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onClose }) => {
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
    onClose()
  }

  return (
    <div
      className="
        absolute right-0 top-10
        w-44 bg-white
        rounded-xl shadow-lg border border-gray-100 py-2 flex flex-col
        transition-all duration-150
        z-50
      "
    >
      {menuItems.map((item) => {
        const IconComponent = item.icon
        const isActive = location.pathname === item.path
        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? "bg-green-50 text-green-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
            }`}
          >
            <IconComponent size={18} />
            <span>{item.name}</span>
          </Link>
        )
      })}

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
      >
        <IoLogOutOutline size={18} />
        Logout
      </button>
    </div>
  )
}

export default SidebarMenu
