import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import ErrorPage from "../../pages/Error";

const ChapterPage = () => {
  const { token, markChapterAsRead } = useContext(AuthContext);
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
          "http://localhost:5000/api/profile/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (profileResponse.data.completed.includes(Number(chapter))) {
          setIsRead(true);
        } else {
          setIsRead(false);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchChapterContent();
    fetchUserProfile();
  }, [chapter, token]);

  useEffect(() => {
    if (illustrations.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === illustrations.length - 1 ? 0 : prevIndex + 1
        );
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [illustrations]);

  const handlePrevious = () => {
    const prevChapter = Number(chapter) - 1;
    if (prevChapter >= 0) navigate(`/chapters/${prevChapter}`);
  };

  const handleNext = () => {
    const nextChapter = Number(chapter) + 1;
    if (nextChapter <= 51) navigate(`/chapters/${nextChapter}`);
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
      setIsRead(true);
      setMessage(response.data.message);
      markChapterAsRead();
    } catch (error) {
      console.error("Error marking chapter as read:", error);
      setMessage("Failed to mark as read.");
    } finally {
      setIsMarking(false);
    }
  };

  const handleBackToChapters = () => {
    navigate("/chapters");
    window.location.reload(); // Reload the page after navigation
  };

  if (Number(chapter) > 51) {
    return <ErrorPage />; // Or you can return a message or redirect as needed
  }
  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="container mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-5xl font-serif text-center mb-6">
          Chapter {chapter} - {title}
        </h1>
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
        <div className="mb-14">
          {chapterContent.slice(0, -1).map((paragraph, index) => (
            <p key={index} className="text-2xl font-light leading-relaxed mb-7">
              {paragraph}
            </p>
          ))}
          <blockquote className="text-xl italic font-semibold text-orange-500 bg-gray-700 p-4 rounded-lg shadow-inner mt-6">
            {chapterContent[chapterContent.length - 1]}
          </blockquote>
        </div>
        <ProgressBar />
        <div className="flex justify-between items-center mt-6 mb-4">
          <button
            onClick={handlePrevious}
            disabled={Number(chapter) === 0}
            className={`${
              Number(chapter) === 0 ? "bg-gray-600" : "bg-blue-600"
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
            disabled={Number(chapter) === 51}
            className={`${
              Number(chapter) === 51 ? "bg-gray-600" : "bg-blue-600"
            } text-white font-semibold p-2 rounded hover:bg-blue-500 transition`}
          >
            Next Chapter
          </button>
        </div>
        {message && (
          <p className="text-center text-yellow-400 font-bold mt-4">
            {message}
          </p>
        )}
        <div className="flex mt-6">
          <button
            onClick={handleBackToChapters}
            className="bg-yellow-300 text-black text-lg rounded-none px-8 py-2 font-semibold 
      hover:bg-yellow-400 transition-all duration-300 
      transform rounded-l-full shadow-lg w-[50%] text-center"
          >
            Back to Chapters
          </button>
          <Link
            to="/dashboard"
            className="bg-orange-600 text-white text-lg rounded-none px-8 py-2 font-semibold 
      hover:bg-orange-700 transition-all duration-300 
      transform rounded-r-full shadow-lg w-[50%] text-center -ml-1" // negative margin to make them stick
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
