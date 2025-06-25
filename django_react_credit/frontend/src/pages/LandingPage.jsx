import { Link } from "react-router-dom";
import BackgroundLayout from "../components/BackgroundLayout";

function LandingPage() {
  return (
    <BackgroundLayout>
      <main className="text-center mt-[60px]">
        <h1 className="text-[2rem] mb">
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
        <p className="mt-[2rem]">
          <Link to={"/LoginPage"}>
            <strong className="text-[#800000] text-[1.1rem]">Sign In</strong>{" "}
          </Link>
          or{""}
          <Link to={"/RegisterPage"}>
            <strong className="text-[#800000] text-[1.1rem]"> Register </strong>
          </Link>
          to begin <br /> using the software
        </p>
      </main>
    </BackgroundLayout>
  );
}

export default LandingPage;
