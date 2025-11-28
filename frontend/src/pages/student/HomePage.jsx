import React, { useState, useEffect } from 'react';
import {
  Header,
  SidebarStudent,
  BackgroundLayout,
} from '../../components/layout';
import { ProfilePanel } from '../../features/profile';
import {
  MultiImageUploader,
  ImagePreviewPanel,
  ImageEditorWrapper,
  ExtractedPanel,
  TorInfo,
  useTorUpload,
} from '../../features/transcript';
import { ProgressTracker } from '../../features/tracking';
import { useModal } from '../../hooks';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [editingImage, setEditingImage] = useState(null);

  const profileModal = useModal();
  const previewModal = useModal();
  const editorModal = useModal();
  const resultsModal = useModal();

  const { uploadOcr, loading, ocrResults } = useTorUpload();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleContinue = (images) => {
    setUploadedImages(images);
    previewModal.open();
  };

  const handleEditImage = (image) => {
    setEditingImage(image);
    editorModal.open();
  };

  const handleSaveEdit = (updatedImage) => {
    const newImages = uploadedImages.map((img) =>
      img.id === updatedImage.id ? updatedImage : img
    );
    setUploadedImages(newImages);
  };

  const handleProcess = async () => {
    const result = await uploadOcr(uploadedImages, userName);
    if (result) {
      previewModal.close();
      resultsModal.open();
    }
  };

  const handleCloseResults = () => {
    resultsModal.close();
    setUploadedImages([]);
  };

  return (
    <BackgroundLayout>
      <div className="min-h-screen">
        <Header toggleSidebar={toggleSidebar} userName={userName} />
        <SidebarStudent
          sidebarOpen={sidebarOpen}
          onOpenProfile={profileModal.open}
        />

        {sidebarOpen && (
          <div
            className="fixed top-[80px] left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10"
            onClick={toggleSidebar}
          />
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mt-12">
            <TorInfo />
          </div>

          <ProgressTracker userName={userName} />

          <div className="mt-12">
            <MultiImageUploader onContinue={handleContinue} />
          </div>
        </main>

        {/* Image Preview Panel */}
        <ImagePreviewPanel
          isOpen={previewModal.isOpen}
          images={uploadedImages}
          onClose={previewModal.close}
          onProcess={handleProcess}
          onEditImage={handleEditImage}
          loading={loading}
        />

        {/* Image Editor */}
        <ImageEditorWrapper
          image={editingImage}
          isOpen={editorModal.isOpen}
          onClose={editorModal.close}
          onSave={handleSaveEdit}
        />

        {/* OCR Results */}
        <ExtractedPanel
          data={ocrResults}
          accountId={userName}
          isOpen={resultsModal.isOpen}
          onClose={handleCloseResults}
        />

        {/* Profile Panel */}
        <ProfilePanel
          userId={userName}
          isOpen={profileModal.isOpen}
          onClose={profileModal.close}
        />
      </div>
    </BackgroundLayout>
  );
}