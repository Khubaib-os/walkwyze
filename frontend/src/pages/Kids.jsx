import React from "react";

const Kids = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        
        {/* Coming Soon Text - Mobile pe 1 line mein */}
        <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 whitespace-nowrap">
          COMING SOON
        </h1>

        {/* Short Description */}
        <p className="text-xl text-gray-300 max-w-md mx-auto">
          Premium collection launching soon. Stay tuned for updates.
        </p>

      </div>
    </div>
  );
};

export default Kids;