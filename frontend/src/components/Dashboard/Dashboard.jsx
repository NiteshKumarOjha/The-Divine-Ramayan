import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import ProgressBar from "../Chapter/ProgressBar";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Dashboard = () => {
  const { user, logout, token } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserProfile(response.data);
        setEmail(response.data.email || "");
        setName(response.data.name || "");
        setBio(response.data.bio || "");
      } catch (error) {
        console.error(
          "Error fetching user profile:",
          error.response ? error.response.data : error.message
        );
        setError(
          error.response ? error.response.data : { message: error.message }
        );
      }
    };

    fetchUserProfile();
  }, [token]);

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      console.log("Updating profile with data:", { email, name, bio });
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        { email, name, bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Profile updated successfully:", response.data);
      setUserProfile(response.data);
      setMessage("Profile updated successfully!");
      setError(null);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response ? error.response.data : error.message
      );
      setMessage("Failed to update profile.");
      setError(
        error.response ? error.response.data : { message: error.message }
      );
    }
  };

  // Handle routing to chapters
  const handleStartReading = () => {
    navigate("/chapters");
    window.location.reload();
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 min-h-screen p-8">
      <div className="container mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-yellow-300 mb-6">
          Welcome {name}
        </h1>

        <h2 className="text-3xl text-center text-white mb-6">Your Profile</h2>
        {userProfile ? (
          <div>
            <div className="mb-4">
              <label className="block mb-1 text-white">Email:</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-white">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-white">Bio:</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-between mb-4">
              <button
                onClick={handleProfileUpdate}
                className="bg-blue-500 text-white p-2 rounded transition hover:bg-blue-600 w-32 max-w-xs"
              >
                Update Profile
              </button>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded transition hover:bg-red-600 w-32 max-w-xs"
              >
                Logout
              </button>
            </div>

            {message && <p className="mt-4 text-green-500">{message}</p>}
            {error && (
              <div className="mt-4 text-red-500">
                <p>Error: {error.message}</p>
                {error.error && <p>Details: {error.error}</p>}
              </div>
            )}
          </div>
        ) : (
          <p className="text-white">Loading...</p>
        )}

        <div className="mt-8 mb-10">
          <h2 className="text-3xl text-center text-yellow-300 mb-4">
            Your Reading Progress
          </h2>
          <ProgressBar />
        </div>

        {/* Start Reading Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleStartReading}
            className="bg-orange-600 text-white text-2xl rounded-lg px-8 py-4 font-semibold 
                     hover:bg-orange-700 transition-all duration-300 
                     transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Reading
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
