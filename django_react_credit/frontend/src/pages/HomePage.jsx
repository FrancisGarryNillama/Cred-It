import BackgroundLayout from "../components/BackgroundLayout";
import ImageDropzone from "../components/ImageDropzone";
function HomePage() {
  return (
    <BackgroundLayout>
      <>
        <main className="flex flex-col items-center justify-center m-[5rem]">
          <div>
            <h1 className="text-[3rem] mb">
              <span className="text-[#800000] font-bold">CRED-IT</span>
            </h1>
          </div>
          <div className="mt-[2rem] ">
            <p className="text-[1.2rem] text-center">
              To start scanning upload an image of <br />
              your TOR
            </p>
          </div>
          <div className="mt-[5rem]">
            <div>
              <span className="text-[1.3rem] font-bold">Image Upload</span>
            </div>
            <div className="flex items-center justify-center w-[50rem] h-48">
              <ImageDropzone />
            </div>
          </div>
        </main>
      </>
    </BackgroundLayout>
  );
}
export default HomePage;
