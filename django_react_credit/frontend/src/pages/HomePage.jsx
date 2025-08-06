"use client";

"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, User, GraduationCap, Upload } from "lucide-react";
import { Button } from "../components/ui/button";
import SidebarDropdown from "../components/SidebarDropdown";
import ImagePreviewModal from "../components/ImagePreviewModal";
import { centerCrop, makeAspectCrop } from "react-image-crop";
import html2canvas from "html2canvas";
import "react-image-crop/dist/ReactCrop.css";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [percentCrop, setPercentCrop] = useState(null);
  const imgRef = useRef(null);
  const previewRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [verticalPerspective, setVerticalPerspective] = useState(0);
  const [horizontalPerspective, setHorizontalPerspective] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(url);
      setOriginalPreviewUrl(url);
    } else {
      alert("Please select a JPEG or PNG image file.");
    }
  };

  const handleContinueClick = () => {
    if (!selectedFile) {
      alert("Please upload an image first.");
      return;
    }
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setCrop(undefined);
    setCompletedCrop(null);
    setPercentCrop(null);
    setScale(1);
    setRotate(0);
    setVerticalPerspective(0);
    setHorizontalPerspective(0);
    if (originalPreviewUrl) {
      setPreviewUrl(originalPreviewUrl);
    }
  };

  const handleDialogContinue = () => {
    console.log("Proceeding with file:", selectedFile);
    setIsDialogOpen(false);
  };

  const handleDoneEditing = () => {
    if (!previewRef.current) return;

    html2canvas(previewRef.current, {
      useCORS: true,
      backgroundColor: null,
      scale: 2,
    }).then((canvas) => {
      const dataUrl = canvas.toDataURL("image/png");
      setPreviewUrl(dataUrl);
      setIsEditing(false);
    });
  };

  const handleViewImage = () => {
    if (previewUrl) {
      const newWindow = window.open("", "_blank");
      newWindow.document.write(`
        <title>Image Preview</title>
        <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background-color:#2e2e2e;">
          <img src="${previewUrl}" alt="Preview" style="max-width:95%; max-height:95vh; object-fit:contain;" />
        </body>
      `);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const defaultCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        undefined,
        width,
        height
      ),
      width,
      height
    );
    setCrop(defaultCrop);
    setPercentCrop(defaultCrop);
  };

  const imageTransformStyle = {
    transform: `rotateX(${verticalPerspective}deg) rotateY(${horizontalPerspective}deg) rotate(${rotate}deg)`,
    transition: "transform 0.15s ease-out",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between relative z-30">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                CRED<span className="text-blue-600">-IT</span>
              </h1>
              <p className="text-xs text-gray-500">Credit Evaluation System</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <User className="w-5 h-5" />
          <span className="text-sm font-medium">
            {userName ? userName : "(name)"}
          </span>
        </div>
      </header>

      {/* Sidebar */}
      <SidebarDropdown sidebarOpen={sidebarOpen} />
      {sidebarOpen && (
        <div
          className="fixed top-[80px] left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <main
        className={`flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 relative z-10 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            CRED<span className="text-blue-600">-IT</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Upload an image of your TOR (Transcript of Records)
          </p>
        </div>

        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-gray-900 font-semibold text-xl mb-6 text-center">
              Upload Document
            </h2>
            <div
              className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center mb-6 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
              onClick={handleUploadAreaClick}
            >
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4 transition-colors" />
              <p className="text-gray-600 group-hover:text-blue-600 transition-colors">
                Click or drag image to this area to upload
              </p>
              {selectedFile && (
                <p className="text-green-600 mt-3 font-medium">
                  ✓ File selected: {selectedFile.name}
                </p>
              )}
            </div>
            <p className="text-gray-500 text-sm mb-8 text-center">
              Supported formats: JPEG, PNG
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-blue-600 text-white" onClick={handleContinueClick}>
                Continue
              </Button>
            </div>
          </div>
        </div>

        {/* Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <ImagePreviewModal
              previewUrl={previewUrl}
              onClose={handleDialogClose}
              onContinue={handleDialogContinue}
              onEdit={() => setIsEditing(true)}
              onViewImage={handleViewImage}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              previewRef={previewRef}
              onImageLoad={onImageLoad}
              crop={crop}
              setCrop={setCrop}
              percentCrop={percentCrop}
              setPercentCrop={setPercentCrop}
              completedCrop={completedCrop}
              setCompletedCrop={setCompletedCrop}
              imgRef={imgRef}
              imageTransformStyle={imageTransformStyle}
              scale={scale}
              setScale={setScale}
              rotate={rotate}
              setRotate={setRotate}
              verticalPerspective={verticalPerspective}
              setVerticalPerspective={setVerticalPerspective}
              horizontalPerspective={horizontalPerspective}
              setHorizontalPerspective={setHorizontalPerspective}
              onDoneEditing={handleDoneEditing}
            />
          </div>
        )}
      </main>
    </div>
  );
}
