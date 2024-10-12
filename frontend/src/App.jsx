import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

import ChapterList from "./components/Chapter/ChapterList"; // Import ChapterList
import ChapterPage from "./components/Chapter/ChapterPage"; // Import ChapterPage
import LandingPage from "./pages/HomePage";
import SignupPage from "./pages/SignUpPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chapters"
            element={
              <ProtectedRoute>
                <ChapterList /> {/* Add ChapterList Route */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/chapters/:chapter" // Dynamic route for chapters
            element={
              <ProtectedRoute>
                <ChapterPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
