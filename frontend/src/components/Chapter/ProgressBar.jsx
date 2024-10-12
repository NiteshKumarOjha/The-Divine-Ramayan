import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProgressBar = () => {
  const totalChapters = 51; // Total number of chapters
  const { completedChapters, loading, error } = useContext(AuthContext);

  // Calculate the progress percentage
  const progress = (completedChapters / totalChapters) * 100;

  return (
    <div className="mt-6">
      {loading ? (
        <div className="text-white text-center">Loading progress...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="relative w-full bg-gray-300 rounded-full h-6">
          <div
            className="bg-green-500 h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-lg text-black font-semibold">
            {Math.round(progress)}%
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
