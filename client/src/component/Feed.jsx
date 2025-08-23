import React from "react";

const Feed = () => {
  return (
    <main className="bg-gray-950 min-h-screen flex justify-center items-center">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src="https://ui-avatars.com/api/?name=John+Doe&background=333&color=fff&size=128"
            alt="User Avatar"
            className="rounded-full mb-4 border-4 border-blue-700 shadow"
            width={100}
            height={100}
          />
          {/* Name */}
          <h2 className="text-2xl font-semibold text-white mb-2">John Doe</h2>
          {/* Dummy Info */}
          <p className="text-gray-400 mb-2">Web Developer</p>
          <p className="text-gray-400 mb-2">
            Email: <span className="text-gray-300">john.doe@example.com</span>
          </p>
          <p className="text-gray-400 mb-2">
            Location: <span className="text-gray-300">Bangalore, India</span>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Feed;
