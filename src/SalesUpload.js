import React, { useState } from 'react';
import axios from 'axios';

const SalesUpload = ({ userId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('sales_data', file);

    try {
      const authToken = localStorage.getItem('authToken');
      await axios.post(`http://localhost:5000/upload-sales/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Optionally, you can fetch updated data or perform other actions after upload
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading file:', error.response.data.error);
    }
  };

  return (
    <div className="sales-upload">
      <h2>Upload Sales Data</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default SalesUpload;
