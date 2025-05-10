import { useConfig } from "@/context/configure-ctx";
import { Camera, Download, FileDown, MoreHorizontal } from "lucide-react";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
const savedImageUrls = ["IMAGE BANK.zip"];
import { jsPDF } from "jspdf";
const MoreOptions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<null | HTMLDivElement>(null);
  const {
    showDimensions,
    setShowDimensions,
    canvasRef,
    selectedModel,
    pdfText,
  } = useConfig();
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
  const generatePDF = () => {
    const doc = new jsPDF();

    const text = pdfText || "";
    doc.text(text, 10, 10); // (text, x, y)

    doc.save(`${selectedModel?.name}.pdf`);
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
            <button
              onClick={generatePDF}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <FileDown /> Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreOptions;
