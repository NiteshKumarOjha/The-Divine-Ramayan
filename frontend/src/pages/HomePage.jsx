import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Adjust the import based on your project structure
import { useNavigate } from "react-router-dom";
import LordRam1 from "../assets/lord_ram_image.jpg"; // Ensure this path is correct

const LandingPage = () => {
  const { token } = useContext(AuthContext); // Get the token from context to check if logged in
  const navigate = useNavigate(); // Initialize navigate

  const handleStartReading = () => {
    if (token) {
      navigate("/dashboard"); // Redirect to dashboard if logged in
    } else {
      navigate("/login"); // Otherwise, go to login page
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500">
      {/* Full screen border */}
      <div className="absolute inset-0 border-[14px] border-[#151515] pointer-events-none" />

      {/* Left side with Lord Ram's image - hidden on mobile, 40% width on large screens, full height */}
      <div
        className="hidden md:flex md:w-2/5 items-center justify-center"
        style={{
          backgroundImage: `url(${LordRam1})`,
          backgroundPosition: "center",
          backgroundSize: "cover", // Ensure the image covers the full height
          backgroundRepeat: "no-repeat",
          height: "100vh", // Full height of the viewport
        }}
      ></div>

      {/* Right side with text content - 60% width on large screens */}
      <div className="flex-1 border-l-[14px] border-[#151515] md:w-3/5 flex flex-col items-center justify-center p-5 md:p-10 text-white">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-extrabold mb-4 md:mb-8 text-center text-orange-900">
          The Divine Ramayan
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl mb-6 md:mb-10 text-center text-orange-800">
          Explore the epic tale of Ramayana through beautifully crafted
          chapters.
        </p>
        <button
          onClick={handleStartReading}
          className="bg-orange-600 text-white text-lg md:text-2xl rounded-lg px-6 md:px-8 py-3 md:py-4 font-semibold 
                      transition-all duration-300 
                     transform hover:scale-125 shadow-lg hover:shadow-xl"
        >
          Start Reading
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
