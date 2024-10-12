import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext"; // Ensure AuthContext is imported
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";

const ChapterPage = () => {
  const { token, markChapterAsRead } = useContext(AuthContext); // Get markChapterAsRead function
  const { chapter } = useParams();
  const [title, setTitle] = useState("");
  const [chapterContent, setChapterContent] = useState([]);
  const [illustrations, setIllustrations] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [isRead, setIsRead] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapterContent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chapter/${chapter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTitle(response.data.title);
        setChapterContent(response.data.content);
        setIllustrations(response.data.illustrations || []);
        setMessage("");
      } catch (error) {
        console.error("Error fetching chapter content:", error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const profileResponse = await axios.get(
          `http://localhost:5000/api/profile/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (profileResponse.data.completed.includes(Number(chapter))) {
          setIsRead(true);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchChapterContent();
    fetchUserProfile();
  }, [chapter, token]);

  // Automatic Carousel logic
  useEffect(() => {
    if (illustrations.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === illustrations.length - 1 ? 0 : prevIndex + 1
        );
      }, 10000); // Change image every 10 seconds

      return () => clearInterval(interval);
    }
  }, [illustrations]);

  const handlePrevious = () => {
    const prevChapter = Number(chapter) - 1;
    if (prevChapter > 0) navigate(`/chapter/${prevChapter}`);
  };

  const handleNext = () => {
    const nextChapter = Number(chapter) + 1;
    if (nextChapter <= 10) navigate(`/chapter/${nextChapter}`);
  };

  const handleMarkAsRead = async () => {
    setIsMarking(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/profile/user/markRead/${chapter}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsRead(true); // Update UI to reflect that the chapter is now read
      setMessage(response.data.message); // Optional: Show success message
      markChapterAsRead(); // Update completed chapters instantly
    } catch (error) {
      console.error("Error marking chapter as read:", error);
      setMessage("Failed to mark as read.");
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="container mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-5xl font-serif text-center mb-6">
          Chapter {chapter} - {title}
        </h1>
        {/* Automatic Carousel for Illustrations */}
        {illustrations.length > 0 && (
          <div className="mb-6 flex justify-center">
            <div className="relative w-96 h-96 overflow-hidden rounded-lg shadow-md">
              {illustrations.map((illustration, index) => (
                <img
                  key={index}
                  src={illustration}
                  alt={`Illustration ${index + 1} for Chapter ${chapter}`}
                  className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out transform ${
                    index === currentImageIndex
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-full"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        {/* Chapter Content */}
        <div className="mb-14">
          {chapterContent.slice(0, -1).map((paragraph, index) => (
            <p key={index} className="text-xl font-light leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
          <blockquote className="text-xl italic font-semibold text-orange-500 bg-gray-700 p-4 rounded-lg shadow-inner mt-6">
            {chapterContent[chapterContent.length - 1]}
          </blockquote>
        </div>
        {/* Progress Bar */}
        <ProgressBar /> {/* Display ProgressBar component here */}
        {/* Navigation and Mark as Read Buttons */}
        <div className="flex justify-between items-center mt-6 mb-4">
          <button
            onClick={handlePrevious}
            disabled={Number(chapter) === 1}
            className={`${
              Number(chapter) === 1 ? "bg-gray-600" : "bg-blue-600"
            } text-white font-semibold p-2 rounded hover:bg-blue-500 transition`}
          >
            Previous Chapter
          </button>

          <button
            onClick={handleMarkAsRead}
            disabled={isRead || isMarking}
            className={`${
              isRead ? "bg-gray-600" : "bg-green-600 hover:bg-green-500"
            } text-white font-semibold p-2 rounded transition`}
          >
            {isRead
              ? "Already Read"
              : isMarking
              ? "Marking..."
              : "Mark as Read"}
          </button>

          <button
            onClick={handleNext}
            disabled={Number(chapter) === 10}
            className={`${
              Number(chapter) === 10 ? "bg-gray-600" : "bg-blue-600"
            } text-white font-semibold p-2 rounded hover:bg-blue-500 transition`}
          >
            Next Chapter
          </button>
        </div>
        {/* Error or Success Message */}
        {message && (
          <p className="text-center text-yellow-400 font-bold mt-4">
            {message}
          </p>
        )}
        <div>
          <Link
            to="/chapters"
            className="bg-yellow-300 text-black text-lg rounded-md px-4 py-2 font-semibold 
                     hover:bg-yellow-400 transition-all duration-300 
                     transform  shadow-lg  block text-center mt-8"
          >
            Back to Chapters
          </Link>
          <Link
            to="/dashboard"
            className="bg-orange-600 text-white text-lg rounded-md px-4 py-2 font-semibold 
                     hover:bg-orange-700 transition-all duration-300 
                     transform shadow-lg mb-6 block text-center mt-4 "
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
