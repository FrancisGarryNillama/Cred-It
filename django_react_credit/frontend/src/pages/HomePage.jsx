"use client"

import { useState, useRef } from "react"
import { Menu, User, Upload, X, GraduationCap, Home, UserCircle, FileImage, Info } from "lucide-react"
import { Button } from "../components/ui/button"
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
    const [originalPreviewUrl, setOriginalPreviewUrl] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const [crop, setCrop] = useState();
  const imgRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0); 
    const [verticalPerspective, setVerticalPerspective] = useState(0);
    const [horizontalPerspective, setHorizontalPerspective] = useState(0);


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setSelectedFile(file)
        setPreviewUrl(URL.createObjectURL(file))
                setOriginalPreviewUrl(URL.createObjectURL(file));
      } else {
        alert("Please select a JPEG or PNG image file.")
        setSelectedFile(null)
        setPreviewUrl(null)
        event.target.value = ""
      }
    }
  }

  const handleContinueClick = () => {
    if (selectedFile) {
      setIsDialogOpen(true)
    } else {
      alert("Please upload an image first.")
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setIsEditing(false);
    setCrop(undefined);
    setCompletedCrop(null);
    setRotate(0);
        setVerticalPerspective(0);
        setHorizontalPerspective(0);
  }

  const handleDialogContinue = () => {
    console.log("Proceeding with file:", selectedFile)
    setIsDialogOpen(false)
  }

  const handleUploadAreaClick = () => {
    fileInputRef.current.click()
  }

  const applyCropAndRotation = async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelCrop = {
      x: completedCrop.x * scaleX,
      y: completedCrop.y * scaleY,
      width: completedCrop.width * scaleX,
      height: completedCrop.height * scaleY,
    };

    const degree = rotate;
    const radians = degree * (Math.PI / 180);
    const absCos = Math.abs(Math.cos(radians));
    const absSin = Math.abs(Math.sin(radians));
    const newWidth = image.naturalWidth * absCos + image.naturalHeight * absSin;
    const newHeight = image.naturalHeight * absCos + image.naturalWidth * absSin;

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.save(); 
    const transformStyle = `scale(${scale}) rotate(${rotate}deg) perspective(500px) rotateY(${horizontalPerspective}deg) rotateX(${verticalPerspective}deg)`;
    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(radians);
    ctx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);

    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0, 
        image.naturalWidth,
        image.naturalHeight 
    );

    ctx.restore(); 
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');

    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;

    croppedCtx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    const rotatedCanvas = document.createElement('canvas');
    const rotatedCtx = rotatedCanvas.getContext('2d');

    rotatedCanvas.width = pixelCrop.width;
    rotatedCanvas.height = pixelCrop.height;

    rotatedCtx.save();
    rotatedCtx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
    rotatedCtx.rotate(radians);
    rotatedCtx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);

    const perspectiveHorizontal = horizontalPerspective / 100;
    const perspectiveVertical = verticalPerspective / 100;

    const sourceX = pixelCrop.width * perspectiveHorizontal;
    const sourceY = pixelCrop.height * perspectiveVertical;
    const sourceWidth = pixelCrop.width * (1 - 2 * Math.abs(perspectiveHorizontal));
    const sourceHeight = pixelCrop.height * (1 - 2 * Math.abs(perspectiveVertical));

    rotatedCtx.drawImage(
        croppedCanvas,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    rotatedCtx.restore();
    const base64Image = rotatedCanvas.toDataURL('image/jpeg');
    setPreviewUrl(base64Image);
    setIsEditing(false);
    setCrop(undefined);
    setCompletedCrop(null);
    setRotate(0);
    setVerticalPerspective(0);
    setHorizontalPerspective(0);
    console.log("Vertical Perspective:", verticalPerspective);
    console.log("Horizontal Perspective:", horizontalPerspective);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {}
      <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between relative z-30">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100" onClick={toggleSidebar}>
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
          <span className="text-sm font-medium">(name)</span>
        </div>
      </header>

      {}
      <div
        className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] bg-white border-r border-gray-200 shadow-lg z-20 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="pt-6 px-4">
          <nav className="space-y-2">
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              Home
            </a>
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <UserCircle className="w-5 h-5" />
              Profile
            </a>
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <FileImage className="w-5 h-5" />
              Upload Image
            </a>
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5" />
              About Us
            </a>
          </nav>
        </div>
      </div>

      {}
      {sidebarOpen && (
        <div className="fixed top-[80px] left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10" onClick={toggleSidebar} />
      )}

      {}
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
            <p className="text-gray-600 text-lg">To start scanning, upload an image of</p>
            <p className="text-gray-600 text-lg font-medium">your TOR (Transcript of Records)</p>
          </div>
        </div>

        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-gray-900 font-semibold text-xl mb-6 text-center">Upload Document</h2>

            {}
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
              {selectedFile && <p className="text-green-600 mt-3 font-medium">✓ File selected: {selectedFile.name}</p>}
            </div>

            <p className="text-gray-500 text-sm mb-8 text-center">Supported formats: JPEG, PNG</p>

            {}
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="px-8 py-2 border-gray-300 hover:bg-gray-50 bg-transparent">
                Cancel
              </Button>
              <Button className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleContinueClick}>
                Continue
              </Button>
            </div>
          </div>
        </div>

        {}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Image Preview</h3>
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
                  <div className="mb-6">
    <button onClick={() => {console.log("Button clicked!"); setIsExpanded(!isExpanded); console.log("isExpanded:", isExpanded);}} className="w-full bg-red-100">
      <img
        src={previewUrl || "/placeholder.svg"}
        alt="Preview"
        className={`max-w-full h-auto mx-auto rounded-lg border border-gray-200 ${isExpanded ? 'max-h-[90vh] max-w-full' : ''}`}
      />
    </button>
                  </div>
                )}

                {isEditing && previewUrl && (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={undefined}
                  >
                    <img
                      ref={imgRef}
                      alt="Edit"
                      src={previewUrl}
                      style={{ transform: `scale(${scale}) rotate(${rotate}deg) perspective(500px) rotateY(${horizontalPerspective}deg) rotateX(${verticalPerspective}deg)` }}
                      onLoad={(e) => {
                        const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
                        setCrop(centerCrop(
                          makeAspectCrop(
                            {
                              unit: '%',
                              width: 90,
                              height: 90,
                            },
                            width / height,
                            width,
                            height
                          ),
                          width,
                          height
                        ));
                      }}
                    />
                  </ReactCrop>
                )}

                <p className="text-gray-600 text-sm mb-6 text-center">
                  {isEditing ? "Adjust the crop area and use the controls below." : "Please ensure the image is high quality and clearly readable for accurate processing."}
                </p>

                {isEditing && (
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {}
                    <div className="flex flex-col items-center w-full mb-4">
                      <label htmlFor="verticalPerspective" className="block text-sm font-medium text-gray-700 mb-2">Vertical Perspective:</label>
                      <input
                        type="range"
                        id="verticalPerspective"
                        min="-100"
                        max="100"
                        value={verticalPerspective}
                        onChange={(e) => setVerticalPerspective(Number(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col items-center w-full mb-4">
                      <label htmlFor="horizontalPerspective" className="block text-sm font-medium text-gray-700 mb-2">Horizontal Perspective:</label>
                      <input
                        type="range"
                        id="horizontalPerspective"
                        min="-100"
                        max="100"
                        value={horizontalPerspective}
                        onChange={(e) => setHorizontalPerspective(Number(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                      <div className="flex flex-col items-center w-full mb-4">
                      <label htmlFor="rotate" className="block text-sm font-medium text-gray-700 mb-2">Rotation:</label>
                      <input
                        type="range"
                        id="rotate"
                        min="-180"
                        max="180"
                        value={rotate}
                        onChange={(e) => setRotate(Number(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  {!isEditing && (
                    <Button
                      variant="outline"
                      className="px-6 py-2 border-gray-300 hover:bg-gray-50 bg-transparent"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  )}
                  {!isEditing && (
                   <Button
                    variant="outline"
                    className="px-6 py-2 border-gray-300 hover:bg-gray-50 bg-transparent"
                    onClick={() => {
                      const newImg = new Image();
                      newImg.src = previewUrl;
                      const newWindow = window.open('', '_blank');
                      newWindow.document.write(newImg.outerHTML);
                    }}
                  >
                    View Image
                  </Button>
                   )}
                  {!isEditing && (
                    <Button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleDialogContinue}>
                      Continue
                    </Button>
                  )}
                   {isEditing && (
                     <Button
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                         applyCropAndRotation();
                         setIsEditing(false);
                      }}
                    >
                      Done Editing
                    </Button>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
