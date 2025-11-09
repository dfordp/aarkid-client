import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
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

  // ✅ Public routes (no TopBar / Sidebar)
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
        {/* Redirect any authenticated-only routes back to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // ✅ Authenticated layout with TopBar + Sidebar
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <TopBar />
      <div className="flex flex-row mt-16">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="md:ml-20 flex-1 bg-gray-50 min-h-[calc(100vh-4rem)] overflow-y-auto">
          <Routes>
            <Route path="/plants" element={<Plants />} />
            <Route path="/plant/:id" element={<Plant />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/healthlogs" element={<HealthLogs />} />
            <Route path="/healthlog/:id" element={<HealthLog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
            {/* Redirect any non-existing routes to /plants */}
            <Route path="*" element={<Navigate to="/plants" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
