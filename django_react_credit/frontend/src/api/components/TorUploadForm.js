import React, { useState } from 'react';
import { uploadPreview } from '../api/torApi';

function TorUploadForm({ onPreviewResult }) {
  const [file, setFile] = useState(null);

  const handleChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please upload a file.');
    try {
      const res = await uploadPreview(file);
      onPreviewResult(res.data); // Let parent handle preview result
    } catch (err) {
      alert('Invalid TOR or error during preview.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button type="submit">Upload Preview</button>
    </form>
  );
}
export default TorUploadForm;
