import { Link, useLocation } from "react-router-dom";
function BackgroundLayout({ children }) {
  const location = useLocation();
  const navLocation = useLocation();
  return (
    <>
      <div className="absolute inset-0 bg-[url('./citBackground.png')] bg-cover bg-center blur-[12px] opacity-[0.8] z-[-1]"></div>{" "}
      {/* Blurred background layer */}
      <header className="bg-[#FFCC00] h-[60px] flex items-center justify-between relative">
        <div></div>

        <div>
          <img src="/navbarCitLogo.png" alt="CIT Logo" className="h-[50px]" />
        </div>
        <div className="right-[20px] top-[10px] flex items-center gap-[8px] pr-5">
          <div className="flex flex-col items-center justify-center">
            {location.pathname === "/LoginPage" ||
            location.pathname === "/RegisterPage" ? null : (
              <>
                <div>
                  <img src="/user-logo.png" alt="User" className="h-[24px]" />
                </div>
                <Link to={"./LoginPage"}>Sign In</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <div>{children}</div>
    </>
  );
}

export default BackgroundLayout;
