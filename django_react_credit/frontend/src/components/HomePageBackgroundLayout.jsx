import { Link, useLocation } from "react-router-dom";
import CollapsibleNavBar from "./CollapsibleNavBar";
import { useState } from "react";
function HomePageBackgroundLayout({ children }) {
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
      {}

      <div>{children}</div>
    </>
  );
}

export default HomePageBackgroundLayout;

