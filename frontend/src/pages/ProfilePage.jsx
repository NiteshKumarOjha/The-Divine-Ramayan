import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ProfilePage = () => {
  const { token } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState(null);

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
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

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

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 min-h-screen p-8">
      <div className="container mx-auto bg-white bg-opacity-30 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-center text-white mb-6">
          User Profile
        </h1>
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
            <button
              onClick={handleProfileUpdate}
              className="bg-blue-500 text-white p-2 rounded transition hover:bg-blue-600"
            >
              Update Profile
            </button>
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
      </div>
    </div>
  );
};

export default ProfilePage;
