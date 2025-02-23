import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Admin.css';

export const Admin = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();  // to redirect to another page

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      console.log("Selected file:", selectedFile);
      // Redirect to monitoring page with selected file as state
      navigate('/monitoring', { state: { video: selectedFile } });
    } else {
      console.log("Please select a file");
    }
  };

  return (
    <div className="app">
      <main>
        <section id="home" className="section">
          <h2>INPUT YOUR VIDEO HERE</h2>
          <div className="video-container">
            {selectedFile && (
              <video
                width="640"
                height="360"
                controls
                src={URL.createObjectURL(selectedFile)}
              />
            )}
          </div>
          <div className="file-upload">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
            />
            <button onClick={handleSubmit}>START</button>
          </div>
        </section>
      </main>
    </div>
  );
};
