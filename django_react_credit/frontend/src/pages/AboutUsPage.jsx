import React from "react";
import BackgroundLayout from "../components/BackgroundLayout";

export default function AboutUsPage() {
  return (
    <>
      <BackgroundLayout>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center m-[5rem]">
            <h1 className="text-[3rem] mb-4">
              <span className="text-[#800000] font-bold">About Us</span>
            </h1>
            <p className="text-[1.2rem] text-center">
              Welcome to <span className="font-bold">CRED-IT</span>, your
              trusted partner in academic integrity and transparency. <br /> Our
              mission is to provide a reliable platform for verifying academic
              credentials, ensuring that your achievements are recognized and
              respected.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center m-[5rem]">
            <p className="text-[1.2rem] text-center mt-4">
              At <span className="font-bold">CRED-IT</span>, we understand the
              importance of trust in education. <br />
              Our platform is designed to help students, employers, and
              educational institutions verify academic records with ease and
              confidence.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center m-[5rem]">
            <p className="text-[1.2rem] text-center ">
              <span className="font-bold">CRED-IT</span> is committed to
              enhancing the credibility of academic qualifications through
              innovative technology and a user-friendly interface. <br />
              Join us in our mission to promote academic integrity and empower
              individuals to achieve their educational goals.
            </p>
          </div>
        </div>
      </BackgroundLayout>
    </>
  );
}
