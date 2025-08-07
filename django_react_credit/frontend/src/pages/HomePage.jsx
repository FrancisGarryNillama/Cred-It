  "use client"

  import { useState, useRef, useEffect } from "react"
  import { Menu, User, Upload, X, GraduationCap, Home, UserCircle, FileImage, Info } from "lucide-react"
  import { Button } from "../components/ui/button"
  import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
  import 'react-image-crop/dist/ReactCrop.css';
  import html2canvas from 'html2canvas';
  import SidebarDropdown from "../components/SidebarDropdown";
  import ImageUploader from "../components/ImageUploader";
  import ImagePreviewModal from "../components/ImagePreviewModal";

  export default function HomePage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [originalPreviewUrl, setOriginalPreviewUrl] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const fileInputRef = useRef(null)
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
    const [previewScale, setPreviewScale] = useState(1);

    const [ocrData, setOcrData] = useState(null); // Add state

    useEffect(() => {
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        setUserName(storedName);
      }
    }, []);
  
    
  const handleDialogContinue = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/api/ocr/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("OCR failed");
      }

      const data = await response.json();
      console.log("✅ OCR Response:", data);
      alert("Data extracted and saved!");

    } catch (error) {
      console.error("OCR Error:", error);
      alert("Failed to process image.");
    }
  };

    function onImageLoad(e) {
      const { width, height } = e.currentTarget;
      const defaultCrop = centerCrop(
        makeAspectCrop({ unit: "%", width: 90 }, undefined, width, height),
        width,
        height
      );
      setCrop(defaultCrop);
      setPercentCrop(defaultCrop);
    }

    const handleDownloadImage = () => {
      if (!previewUrl) return;

      const link = document.createElement("a");
      link.href = previewUrl;
      link.download = "edited_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };


    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        if (file.type === "image/jpeg" || file.type === "image/png") {
          setSelectedFile(file);
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
          setOriginalPreviewUrl(url);
        } else {
          alert("Please select a JPEG or PNG image file.");
          setSelectedFile(null);
          setPreviewUrl(null);
          event.target.value = "";
        }
      }
    };

    const handleContinueClick = () => {
      if (selectedFile) {
        setIsDialogOpen(true);
      } else {
        alert("Please upload an image first.");
      }
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

    

    const handleUploadAreaClick = () => {
      fileInputRef.current.click();
    };

    const handleDoneEditing = () => {
      if (!previewRef.current) {
        console.error("Preview element not found to capture.");
        return;
      }
      html2canvas(previewRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2
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
            <img src="${previewUrl}" alt="Preview" style="max-width:95%; max-height:95vh; object-fit:contain;">
          </body>
        `);
      }
    };

    const clipStyle = percentCrop ? {
      clipPath: (() => {
        const rad = Math.PI * rotate / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const centerX = percentCrop.x + percentCrop.width / 2;
        const centerY = percentCrop.y + percentCrop.height / 2;

        const originalX = centerX * cos + centerY * sin;
        const originalY = centerX * sin + centerY * cos;

        const originalTop = originalY - percentCrop.height / 2;
        const originalLeft = originalX - percentCrop.width / 2;

        return `inset(${originalTop}% ${100 - (originalLeft + percentCrop.width)}% ${100 - (originalTop + percentCrop.height)}% ${originalLeft}%)`;
      })()
    } : { clipPath: 'none' };

    const imageTransformStyle = {
      transform: `rotateX(${verticalPerspective}deg) rotateY(${horizontalPerspective}deg) rotate(${rotate}deg)`,
      transition: 'transform 0.15s ease-out'
    };
    {/*-------------------------------------------*/}
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
              {userName ? userName : "No name"}
            </span>
          </div>
        </header>

        <SidebarDropdown sidebarOpen={sidebarOpen} />
        {sidebarOpen && (
          <div
            className="fixed top-[80px] left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10"
            onClick={toggleSidebar}
          />
        )}

        <main
          className={`flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 relative z-10 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              CRED<span className="text-blue-600">-IT</span>
            </h1>
            <div className="space-y-2">
              <p className="text-gray-600 text-lg">
                To start scanning, upload an image of
              </p>
              <p className="text-gray-600 text-lg font-medium">
                your TOR (Transcript of Records)
              </p>
            </div>
          </div>

          <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-gray-900 font-semibold text-xl mb-6 text-center">
                Upload Document
              </h2>

              <ImageUploader
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                setPreviewUrl={setPreviewUrl}
              />

              <p className="text-gray-500 text-sm mb-8 text-center">
                Supported formats: JPEG, PNG
              </p>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" className="px-8 py-2">
                  Cancel
                </Button>
                <Button
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleContinueClick}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>

          {isDialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-[95vw] h-[90vh] mx-4 overflow-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Image Preview & Edit
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDialogClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="p-6">
                  {!isEditing && previewUrl && (
                    <div className="mb-6 text-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-md h-auto mx-auto rounded-lg border border-gray-200"
                      />
                    </div>
                  )}

                  {isEditing && previewUrl && (
                    <div className="flex flex-col md:flex-row gap-8 items-center h-[70vh]">
                      <div className="w-full md:w-1/2">
                        <h4 className="text-lg font-medium text-center mb-2">
                          Edit
                        </h4>
                        <div style={{ perspective: "1000px", height: '100%', position: 'relative' }}>
                          <div className="absolute inset-0 z-10 pointer-events-none grid grid-cols-12 grid-rows-12">
                            {[...Array(144)].map((_, i) => (
                              <div key={`v-${i}`} className="border border-gray-300"></div>
                            ))}
                          </div>
                          <ReactCrop
                            crop={crop}
                            onChange={(pixelCrop, percentageCrop) => {
                              setCrop(pixelCrop);
                              setPercentCrop(percentageCrop);
                            }}
                            onComplete={(c) => setCompletedCrop(c)}
                          >
                            <img
                              ref={imgRef}
                              alt="Edit"
                              src={previewUrl}
                              style={{
                                transform: `scale(${scale}) ${imageTransformStyle.transform}`,
                                maxHeight: '100%',
                                maxWidth: '100%',
                                objectFit: 'contain'
                              }}
                              onLoad={onImageLoad}
                            />
                          </ReactCrop>
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 text-center">
                        <h4 className="text-lg font-medium text-center mb-2">
                          Live Preview
                        </h4>
                        <div
                          ref={previewRef}
                          className="relative w-full h-[400px] mx-auto rounded-md overflow-hidden"
                          style={{
                            perspective: "1000px",
                            border: '1px solid #ccc',
                            background: '#f8f8f8',
                          }}
                        >
                          <div
                            style={{
                              ...imageTransformStyle,
                              transform: `scale(${scale}) ${imageTransformStyle.transform}`,
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <img
                              alt="Live Preview"
                              src={previewUrl}
                              style={{
                                objectFit: 'contain',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                clipPath: percentCrop
                                  ? `inset(${percentCrop.y}% ${100 - (percentCrop.x + percentCrop.width)}% ${100 - (percentCrop.y + percentCrop.height)}% ${percentCrop.x}%)`
                                  : "none",
                                transform: `scale(${previewScale})`,
                                transformOrigin: "center"
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-gray-600 text-sm my-6 text-center">
                    {isEditing
                      ? "Adjust controls and crop area."
                      : "Review the image before continuing."}
                  </p>

                  {isEditing && (
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                      <div className="w-full px-4 text-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vertical Perspective: <span className="font-bold">{verticalPerspective}°</span>
                        </label>
                        <input
                          type="range"
                          min="-45"
                          max="45"
                          value={verticalPerspective}
                          onChange={(e) => setVerticalPerspective(Number(e.target.value))}
                          className="w-[75%] mx-auto block accent-blue-500"
                        />
                      </div>

                      <div className="w-full px-4 text-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Horizontal Perspective: <span className="font-bold">{horizontalPerspective}°</span>
                        </label>
                        <input
                          type="range"
                          min="-45"
                          max="45"
                          value={horizontalPerspective}
                          onChange={(e) => setHorizontalPerspective(Number(e.target.value))}
                          className="w-[75%] mx-auto block accent-blue-500"
                        />
                      </div>

                      <div className="w-full px-4 text-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rotation: <span className="font-bold">{rotate}°</span>
                        </label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={rotate}
                          onChange={(e) => setRotate(Number(e.target.value))}
                          className="w-[75%] mx-auto block accent-blue-500"
                        />
                      </div>
                      <div className="w-full px-4 text-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preview Zoom: <span className="font-bold">{Math.round(previewScale * 100)}%</span>
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="2"
                          step="0.1"
                          value={previewScale}
                          onChange={(e) => setPreviewScale(Number(e.target.value))}
                          className="w-[75%] mx-auto block accent-blue-500"
                        />
                      </div>
                    </div>
                  )}


                  <div className="flex justify-end gap-4 mt-4">
                    {!isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          className="px-6 py-2"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="px-6 py-2"
                          onClick={handleViewImage}
                        >
                          View Image
                        </Button>
                        <Button 
                          variant="outline" 
                          className="px-6 py-2" 
                          onClick={handleDownloadImage}
                          >
                          Download
                        </Button>
                        <Button
                          className="px-6 py-2 bg-blue-600 text-white"
                          onClick={handleDialogContinue}
                        >
                          Continue
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="px-6 py-2 bg-blue-600 text-white"
                        onClick={handleDoneEditing}
                      >
                        Done Editing
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* 📊 OCR Result Display */}
        {ocrData && (
          <div className="mt-12 bg-white p-6 rounded-xl shadow-md max-w-5xl w-full">
            <h3 className="text-lg font-semibold mb-4">Extracted Information</h3>
            <p><strong>Student Name:</strong> {ocrData.student_name || "N/A"}</p>
            <p><strong>School Name:</strong> {ocrData.school_name || "N/A"}</p>
            <div className="overflow-x-auto">
              <table className="mt-4 w-full text-sm border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    {["Code","Description","Semester","School Year","Units","Grade","Remarks"].map((h) => (
                      <th key={h} className="border px-2 py-1">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ocrData.entries.map((e, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      <td className="border px-2 py-1">{e.subject_code}</td>
                      <td className="border px-2 py-1">{e.subject_description}</td>
                      <td className="border px-2 py-1">{e.semester}</td>
                      <td className="border px-2 py-1">{e.school_year_offered}</td>
                      <td className="border px-2 py-1">{e.total_academic_units}</td>
                      <td className="border px-2 py-1">{e.final_grade}</td>
                      <td className="border px-2 py-1">{e.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </main>
      </div>
    );
  }