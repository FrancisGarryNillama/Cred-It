import React from "react";

// Accept isOpen as a prop from the parent
export default function CollapsibleNavBar({ isOpen, onClose }) {
  // No internal state or toggle button needed
  return (
    <>
      {/* Sidebar controlled by isOpen prop */}
      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform dark:bg-[#800000] px-3 py-4 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full">
          <ul className="space-y-5 font-medium">
            <li>
              <div className="flex flex-row justify-between">
                <button
                  type="button"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  X
                </button>
              </div>
            </li>
            <li>
              <button
                type="button"
                className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-1 whitespace-nowrap">Home</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-1 whitespace-nowrap">Profile</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-1 whitespace-nowrap">Upload Image</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-1 whitespace-nowrap">About Us</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-1 whitespace-nowrap">Sign Out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
