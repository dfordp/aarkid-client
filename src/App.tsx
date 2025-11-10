import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { Authenticated } from "./atom"

// Public Pages
import LandingPage from "./pages/LandingPage"
import Auth from "./pages/Auth"
import Onboarding from "./pages/Onboarding"

// Authenticated Layout
import TopBar from "./components/Topbar"
import Sidebar from "./components/Sidebar"

// Authenticated Pages
import Plants from "./pages/Plants"
import Plant from "./pages/Plant"
import Tasks from "./pages/Tasks"
import HealthLogs from "./pages/HealthLogs"
import HealthLog from "./pages/HealthLog"
import Profile from "./pages/Profile"
import Chat from "./pages/Chat"

const AppRoutes = () => {
  const isAuthenticated = useRecoilValue(Authenticated)
  const location = useLocation()

  // --- ✅ Redirect root path based on auth state
  if (location.pathname === "/") {
    if (isAuthenticated) {
      return <Navigate to="/plants" replace />
    } else {
      return (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      )
    }
  }

  // --- 🧭 Public routes (unauthenticated only)
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // --- 🔒 Authenticated layout
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <TopBar />
      <div className="flex flex-row sm:mt-16 lg:mt-0">
        <Sidebar />
        <div className="md:ml-20 flex-1 bg-gray-50 min-h-[calc(100vh-4rem)] overflow-y-auto">
          <Routes>
            <Route path="/plants" element={<Plants />} />
            <Route path="/plant/:id" element={<Plant />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/healthlogs" element={<HealthLogs />} />
            <Route path="/healthlog/:id" element={<HealthLog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
            {/* Default route */}
            <Route path="*" element={<Navigate to="/plants" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
)

export default App
