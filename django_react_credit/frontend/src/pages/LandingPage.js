function LandingPage() {
  return (
    <>
      <div className="absolute inset-0 bg-[url('./citBackground.png')] bg-cover bg-center blur-[12px] opacity-[0.8] z-[-1]"></div>{" "}
      {/* Blurred background layer */}
      <header className="bg-color-[#FFCC00] h-[60px] flex items-center justify-center relative">
        <img src="/navbarCitLogo.png" alt="CIT Logo" className="h-[50px]" />
        <div className="absolute right-[20px] top-[10px] flex items-center gap-[8px]">
          <img src="/user-logo.png" alt="User" className="h-[24px]" />
          <button className="text-[14px] text-[#800000] font-bold">
            Sign In/Register
          </button>
        </div>
      </header>
      <main className="text-center mt-[60px]">
        <h1>
          Welcome to <span className="text-[#800000] font-bold">CRED-IT</span>
        </h1>
        <p className="mt-[1rem] text-[#333333]">
          A software that aims to ease the administrative burden <br />
          on department staff, improve decision-making accuracy, and <br />
          provide transferee students with faster and clearer results.
        </p>
        <p className="mt-[1rem] text-[#333333]">
          Our system simplifies and standardizes course comparison and credit
          accreditation between <br />
          institutions — improving efficiency, transparency, and academic
          advising. <br />
          Say goodbye to manual evaluations and hello to faster, smarter
          decisions for students and schools alike.
        </p>
        <p className="mt-[2rem] text-[#800000] text-[1.1rem]">
          <strong>Sign In or Register</strong> to begin <br /> using the
          software
        </p>
      </main>
    </>
  );
}

export default LandingPage;
