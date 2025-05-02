import { useConfig } from "@/context/configure-ctx";
import { Camera, Download, MoreHorizontal } from "lucide-react";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
const savedImageUrls = ["IMAGE BANK.zip"];

const MoreOptions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<null | HTMLDivElement>(null);
  const { showDimensions, setShowDimensions, canvasRef } = useConfig();
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //   const takeScreenshot = () => {
  //     const dataURL = gl.domElement.toDataURL("image/png");
  //     const link = document.createElement("a");
  //     link.href = dataURL;
  //     link.download = "three-screenshot.png";
  //     link.click();
  //   };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    console.log("ref", canvasRef);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  }, []);
  const captureScreenshot = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "current_model_screenshot.png";
    link.click();
  };

  const downloadSavedImages = () => {
    savedImageUrls.forEach((url, index) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = `saved-image-${index + 1}.png`; // You can customize the extension/filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={togglePopup}
        className="px-4 py-2 text-black  rounded-md "
      >
        <MoreHorizontal />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md  z-10">
          <div className="py-1">
            <p
              onClick={() => setShowDimensions((prv) => !prv)}
              className={`flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                showDimensions ? "!text-blue-300" : null
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-ruler-dimension-line-icon lucide-ruler-dimension-line"
              >
                <path d="M12 15v-3.014" />
                <path d="M16 15v-3.014" />
                <path d="M20 6H4" />
                <path d="M20 8V4" />
                <path d="M4 8V4" />
                <path d="M8 15v-3.014" />
                <rect x="3" y="12" width="18" height="7" rx="1" />
              </svg>{" "}
              {showDimensions ? "Hide" : "Show"} dimensions
            </p>
            <p
              onClick={captureScreenshot}
              className={`flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer `}
            >
              <Camera /> Screenshot
            </p>
            <p
              onClick={downloadSavedImages}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <Download /> Image Bank
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreOptions;
