import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { User, Authenticated } from "@/atom"
import { useNavigate, useLocation } from "react-router-dom"
import { Leaf, Menu } from "lucide-react"
import SidebarMenu from "./SidebarMenu"

const TopBar = () => {
  const [pic, setPic] = useState("")
  const user = useRecoilValue(User)
  const isAuthenticated = useRecoilValue(Authenticated)
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (user?.image) setPic(user.image)
  }, [user])

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".dropdown-container")) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const isLandingPage = location.pathname === "/"

  return (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 relative">
        {/* Left - Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => {
            navigate("/")
          }}
        >
          <Leaf className="h-8 w-8 text-green-600" />
          <span className="text-lg font-semibold text-green-700 tracking-tight hidden sm:inline">
            Aarchid
          </span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Landing Page Buttons */}
          {isLandingPage && (
            <>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate("/plants")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    Go to Dashboard
                  </button>
                  {pic && (
                    <img
                      src={pic}
                      alt="Profile"
                      className="hidden sm:block w-9 h-9 rounded-full border border-green-200 object-cover"
                    />
                  )}
                </>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Login
                </button>
              )}
            </>
          )}

          {/* Authenticated view (in-app) */}
          {isAuthenticated && !isLandingPage && (
            <div className="dropdown-container relative flex items-center gap-3">
              {/* Profile picture (desktop) */}
              {pic && (
                <img
                  src={pic}
                  alt="Profile"
                  className="hidden sm:block w-9 h-9 rounded-full border border-green-200 object-cover"
                />
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpen((prev) => !prev)
                }}
                className="sm:hidden text-gray-600 hover:text-green-700 transition-all"
              >
                <Menu size={24} />
              </button>

              {/* Mobile dropdown menu */}
              {menuOpen && <SidebarMenu onClose={() => setMenuOpen(false)} />}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar
