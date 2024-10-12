import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Import the AuthContext
import { FaCheckCircle, FaBook } from "react-icons/fa"; // Import icons from react-icons

const ChapterList = () => {
  const [chapters, setChapters] = useState([]);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/chapter/all"
        );
        setChapters(response.data); // Ensure response.data has the correct structure
      } catch (error) {
        console.error("Error fetching chapters:", error);
        // Optionally set an error state to display in the UI
      }
    };

    fetchChapters();
  }, [user, location.pathname]); // Refetch if user or pathname changes

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="container mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-5xl font-serif text-center text-yellow-500 mb-8">
          Divine Chapters of Ramayana
        </h1>

        <Link
          to="/dashboard"
          className="bg-orange-600 text-white text-lg rounded-md px-4 py-2 font-semibold 
                     hover:bg-orange-700 transition-all duration-300 
                     transform hover:scale-105 shadow-lg hover:shadow-xl mb-6 block text-center"
        >
          Back to Dashboard
        </Link>

        <ul className="space-y-4">
          {chapters.length === 0 ? (
            <li className="text-yellow-300 text-center">
              No chapters available.
            </li>
          ) : (
            chapters.map((chapter) => (
              <li
                key={chapter.chapterNumber}
                className="p-4 rounded-lg shadow transition-all duration-500 
                           transform hover:scale-105 bg-gray-700 bg-opacity-60 hover:bg-opacity-80"
              >
                <Link
                  to={`/chapters/${chapter.chapterNumber}`}
                  className="flex justify-between items-center text-yellow-300 w-full h-full no-underline"
                >
                  <span className="text-xl">
                    Chapter {chapter.chapterNumber}
                  </span>
                  <span className="flex items-center text-gray-400">
                    {user && user.completed.includes(chapter.chapterNumber) ? (
                      <>
                        Completed
                        <FaCheckCircle className="ml-3 text-green-500" />
                      </>
                    ) : (
                      <>
                        Read Now
                        <FaBook className="text-yellow-400 ml-3" />
                      </>
                    )}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChapterList;
