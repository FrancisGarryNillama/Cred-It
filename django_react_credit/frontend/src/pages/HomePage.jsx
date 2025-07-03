import BackgroundLayout from "../components/BackgroundLayout";
import ImageDropzone from "../components/ImageDropzone";
function HomePage() {
  return (
    <BackgroundLayout>
      <>
        <main className="flex flex-col items-center justify-center m-[2rem]">
          <div>
            <h1 className="text-[2rem] mb">
              <span className="text-[#800000] font-bold">CRED-IT</span>
            </h1>
          </div>
          <div className="mt-[5rem]">
            <div>
              <h2>Image Upload</h2>
            </div>
            <div>
              <ImageDropzone />
            </div>
          </div>
        </main>
      </>
    </BackgroundLayout>
  );
}
export default HomePage;
