import { useLocation } from "react-router-dom";
import './Monitoring.css';

export const Monitoring = () => {
  const location = useLocation();
  const videoFile = location.state?.video;

  return (
    <div className="monitoring-container">
      <div className="video-container">
        {videoFile && (
          <video
            controls
            src={URL.createObjectURL(videoFile)}
          />
        )}
      </div>
    </div>
  );
};
