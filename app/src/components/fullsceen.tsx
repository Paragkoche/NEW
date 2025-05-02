import { Fullscreen } from "lucide-react";
import { useEffect, useState } from "react";

const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return <Fullscreen className="cursor-pointer" onClick={toggleFullscreen} />;
};

export default FullscreenToggle;
