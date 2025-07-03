import { Link, useLocation } from "react-router-dom";
import CollapsibleNavBar from "./CollapsibleNavBar";
import { useState } from "react";
function BackgroundLayout({ children }) {
  const location = useLocation();
  const navLocation = useLocation();
  const [navIsOpen, setNavIsOpen] = useState(false);

  function handleClick() {
    setNavIsOpen((prev) => !prev);
  }
  function handleCloseSidebar() {
    setNavIsOpen(false);
  }
  return (
    <>
      <div className="absolute inset-0 bg-[url('./citBackground.png')] bg-cover bg-center blur-[12px] opacity-[0.8] z-[-1]"></div>{" "}
      <header className="fixed top-0 left-0 w-full bg-[#FFCC00] h-[60px] flex items-center justify-between z-50 shadow-md">
        {(navLocation.pathname === "/HomePage" ||
          navLocation.pathname === "/AboutUsPage") && (
          <CollapsibleNavBar isOpen={navIsOpen} />
        )}
        <div className="pl-5">
          <div className="flex flex-col items-center justify-center">
            {(navLocation.pathname === "/HomePage" ||
              navLocation.pathname === "/AboutUsPage") && (
              <button
                onClick={handleClick}
                className="group p-2 rounded hover:bg-yellow-300 transition-colors"
                aria-label="Open navigation menu"
              >
                <svg
                  className="w-6 h-6 text-gray-800 group-hover:text-yellow-800 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div>
          <img src="/navbarCitLogo.png" alt="CIT Logo" className="h-[50px]" />
        </div>
        <div className="right-[20px] top-[10px] flex items-center gap-[8px] pr-5">
          <div className="flex flex-col items-center justify-center">
            {location.pathname === "/LoginPage" ||
            location.pathname === "/RegisterPage" ? null : (
              <>
                <Link to={"/LoginPage"}>
                  <div className="flex items-center justify-center">
                    <img src="/user-logo.png" alt="User" className="h-[24px]" />
                  </div>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      {navIsOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={handleCloseSidebar}
        ></div>
      )}
      <div className="pt-[60px]">{children}</div>
    </>
  );
}

export default BackgroundLayout;
