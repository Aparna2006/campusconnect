import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApplicationProvider } from "./context/ApplicationContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./utils/ProtectedRoute";
import Opportunities from "./pages/Opportunities";
import Skills from "./pages/Skills";
import Applications from "./pages/Applications";
import AIHelper from "./pages/AIHelper";
import Events from "./pages/Events";
import Settings from "./pages/Settings";
import Clubs from "./pages/Clubs";
import Hackathons from "./pages/Hackathons";
import HackathonDetails from "./pages/HackathonDetails";
import ApplyHackathon from "./pages/ApplyHackathon";
import Jobs from "./pages/Jobs";
import Support from "./pages/Support";
import Profile from "./pages/Profile";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import ClubDetails from "./pages/ClubDetails";

function App() {
  return (
    <ApplicationProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/clubs/:id" element={<ClubDetails />} />
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <Skills />
              </ProtectedRoute>
            }
          />

          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-helper"
            element={
              <ProtectedRoute>
                <AIHelper />
              </ProtectedRoute>
            }
          />

          <Route
            path="/opportunities"
            element={
              <ProtectedRoute>
                <Opportunities />
              </ProtectedRoute>
            }
          />

          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/clubs"
            element={
              <ProtectedRoute>
                <Clubs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hackathons"
            element={
              <ProtectedRoute>
                <Hackathons />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hackathons/:id"
            element={
              <ProtectedRoute>
                <HackathonDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hackathons/:id/apply"
            element={
              <ProtectedRoute>
                <ApplyHackathon />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <JobDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id/apply"
            element={
              <ProtectedRoute>
                <ApplyJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </ApplicationProvider>
  );
}

export default App;
