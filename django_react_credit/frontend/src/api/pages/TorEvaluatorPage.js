import React, { useState } from 'react';
import TorUploadForm from '../components/TorUploadForm';
import TorPreview from '../components/TorPreview';
import TorResults from '../components/TorResults';

function TorEvaluatorPage() {
  const [previewData, setPreviewData] = useState(null);
  const [finalResult, setFinalResult] = useState(null);

  return (
    <div>
      <h2>Transcript Evaluator</h2>
      <TorUploadForm onPreviewResult={setPreviewData} />
      {previewData && <TorPreview data={previewData} />}
      {/* Later: allow confirmation and trigger uploadFull for final match */}
    </div>
  );
}
export default TorEvaluatorPage;
