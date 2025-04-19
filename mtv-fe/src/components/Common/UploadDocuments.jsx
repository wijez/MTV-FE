import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const UploadDocuments = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleZipAndUpload = async () => {
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.name, file);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'documents.zip'); 
    alert('Tài liệu đã được nén thành file ZIP!');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tải Tài Liệu</h2>
      <input type="file" multiple onChange={handleFileChange} />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleZipAndUpload}
      >
        Nén và Tải Lên
      </button>
    </div>
  );
};

export default UploadDocuments;