import React, { useState } from 'react';
import {
  LandingHeader,
  LandingFooter,
  WelcomeSection,
  InfoSection,
  FeaturesGrid,
} from '../features/landing';
import { DemoUploader, DemoResults, useDemoOcr } from '../features/demo';
import { BackgroundLayout } from '../components/layout';

export default function LandingPage() {
  const [showResults, setShowResults] = useState(false);
  const { processImages, loading, error, results, reset } = useDemoOcr();

  const handleProcess = async (images) => {
    const result = await processImages(images);
    if (result) {
      setShowResults(true);
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    reset();
  };

  const handleRetry = async (images) => {
    reset();
    await handleProcess(images);
  };

  return (
    <BackgroundLayout blur={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <LandingHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <WelcomeSection />
            <InfoSection />

            <div className="mt-12">
              <DemoUploader onProcess={handleProcess} />
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <FeaturesGrid />
            </div>
          </div>
        </main>

        <LandingFooter />

        <DemoResults
          isOpen={showResults}
          onClose={handleCloseResults}
          results={results}
          loading={loading}
          error={error}
          onRetry={() => handleRetry(results)}
        />
      </div>
    </BackgroundLayout>
  );
}