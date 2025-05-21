import React from "react";

const Header = () => {
  return (
    <div>
      {/* Google Docs-like header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-md flex items-center justify-center mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <input
              type="text"
              placeholder="Untitled document"
              className="text-lg focus:outline-none focus:border-b-2 focus:border-blue-500 pb-0.5 w-72"
              defaultValue="Untitled document"
            />
            <div className="flex space-x-5 text-sm text-gray-600 mt-1">
              <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                File
              </span>
              <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                Edit
              </span>
              <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                View
              </span>
              <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                Insert
              </span>
              <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                Format
              </span>
              <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                Tools
              </span>
              <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                Help
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-md hover:bg-blue-200 font-medium text-sm">
            Share
          </button>
          <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center text-sm font-bold">
            U
          </div>
        </div>
      </div>
      ;
    </div>
  );
};

export default Header;
