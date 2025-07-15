function HomePageBackgroundLayout({ children }) {
  return (
    <>
      <div className="absolute inset-0 bg-[url('./citBackground.png')] bg-cover bg-center blur-[12px] opacity-[0.8] z-[-1]"></div>
      <div>{children}</div>
    </>
  );
}

export default HomePageBackgroundLayout;
