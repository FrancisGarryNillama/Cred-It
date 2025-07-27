import React from "react";
import { Link } from "react-router-dom";

export default function CollapsibleNavBar({ isOpen }) {
  return (
    <>
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
              <Link to={"/HomePage"}>
                <button
                  type="button"
                  className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <span className="whitespace-nowrap">Home</span>
                </button>
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className=" whitespace-nowrap">Profile</span>
              </button>
            </li>

            <li>
              <Link to={"/AboutUsPage"}>
                <button
                  type="button"
                  className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <span className="whitespace-nowrap">About Us</span>
                </button>
              </Link>
            </li>
            <li>
              <Link to={"/LoginPage"}>
                <button
                  type="button"
                  className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <span className="whitespace-nowrap">Sign Out</span>
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
