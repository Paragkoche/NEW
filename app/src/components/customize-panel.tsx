"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, X } from "lucide-react";
import { useConfig } from "@/context/configure-ctx";
import Image from "next/image";
import { Fabric, Model } from "@/types/type";
import { Mash } from "@/types/type";
const API_BASE_URL = process.env.NEXT_PUBLIC_API;

const CustomSelectWithImages = ({ options, value, onChange, size }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<null | HTMLDivElement>(null);
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleDropdown}
        className="w-full p-2 rounded bg-white text-black flex items-center"
      >
        {value ? (
          <div className="flex items-center">
            <img
              src={`${API_BASE_URL}${value.thumbnailUrl}`}
              alt={value.name}
              className="w-6 h-6 mr-2"
            />
            {value.name}
          </div>
        ) : (
          "Select Variant"
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 w-full bg-white border rounded shadow-lg z-10 overflow-auto h-72">
          {options.map((option: any) => (
            <div
              key={option.id}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
            >
              <img
                src={`${API_BASE_URL}${option.thumbnailUrl}`}
                alt={option.name}
                height={size}
                width={size}
                className="mr-2"
              />
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const CustomizePanel = () => {
  const [open, setOpen] = useState(false);
  const {
    selectedModel,
    selectedVariants,
    selectedFabrics,
    changeSelectedModel,

    changeSelectedFabrics,
    changeSelectedVariants,
    SetRotation,
    rotation,
    Models,
    fabricRageMap,
    setFabricRageForVariant,
  } = useConfig();
  const handleVariantChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    mash: Mash
  ) => {
    const selectedVariantName = event.target.value;

    // Find the correct variant by searching through the mash array inside mash.variants
    const selectedVariant = mash.mashVariants?.mash.find(
      (variantMash) => variantMash.name === selectedVariantName
    );

    if (selectedVariant) {
      // Update the selected variant context or state
      changeSelectedVariants(selectedVariant);

      // Handle selecting the correct fabric for the selected variant
      // if (selectedVariant.textures && selectedVariant.textures.length > 0) {
      //   const selectedFabric = selectedVariant.textures[0]; // Assuming the first texture is the one we want to select
      //   setFabricRageForVariant((prevFabrics) => ({
      //     ...prevFabrics,
      //     [mash.mashName]: selectedFabric, // Update fabric for this particular mash
      //   }));
      // }
    } else {
      changeSelectedVariants(null);
    }
  };

  const togglePanel = () => setOpen(!open);
  console.log("s");

  const panelVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    Models && (
      <>
        {/* Toggle Button */}
        {!open && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-red-600/60  h-[150px] w-[50px] px-3.5 fixed right-0 top-1/2 transform -translate-y-1/2 cursor-pointer flex justify-center items-center text-white rounded-l-3xl z-50 select-none"
            onClick={togglePanel}
          >
            <span className="rotate-90">customization</span>
          </motion.div>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={togglePanel}
            >
              <div className="absolute inset-0 bg-opacity-40" />
              <motion.div
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                className="fixed top-1/2 right-0 transform -translate-y-1/2 h-[90%] max-w-[90vw] w-[380px] bg-red-600/60 rounded-l-3xl backdrop-blur-2xl p-5 z-50 shadow-2xl overflow-y-auto"
              >
                <div className="flex justify-between items-center text-white mb-4">
                  <h2
                    className="text-xl font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: selectedModel?.name || "",
                    }}
                  ></h2>
                  <X
                    className="cursor-pointer"
                    size={24}
                    onClick={togglePanel}
                  />
                </div>

                {/* Model Selection */}
                {Models?.length > 1 && (
                  <div className="mb-6">
                    <h3 className="text-white text-sm font-medium mb-2">
                      Models
                    </h3>
                    <select
                      className="w-full p-2 rounded bg-white text-black"
                      value={selectedModel?.id || ""}
                      onChange={(e) =>
                        changeSelectedModel(
                          Models.find(
                            (v) => v.id === parseInt(e.target.value)
                          ) ?? null
                        )
                      }
                    >
                      {Models.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Auto Rotation Toggle */}
                <div className="mb-6">
                  <h3 className="text-white text-sm font-medium mb-2">
                    Auto Rotation
                  </h3>
                  <div className="flex items-center">
                    <label className="text-white mr-2">Enable Rotation:</label>
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      checked={rotation || false}
                      onChange={(e) => SetRotation((prv) => !prv)}
                    />
                  </div>
                </div>

                {/* Environment Selection */}

                {/* Background Selection */}

                {/* Variants Selection */}
                {/* {selectedModel && (
                  <div className="mb-6">
                    <h3 className="text-white text-sm font-medium mb-2">Variants</h3>
                    {selectedModel.mash.map((mesh) =>
                      mesh.variants?.mash?.length ? (
                        <div key={mesh.id} className="mb-4">
                          <h4 className="text-white">{mesh.name}</h4>
                          <select
                            className="w-full p-2 rounded bg-white text-black"
                            value={selectedVariants?.id || ""}
                            onChange={(e) =>
                              changeSelectedVariants(mesh.variants.)
                            }
                          >
                            <option value="">Select variant</option>
                            {mesh.variants.mash.map((variant) => (
                              <option key={variant.id} value={variant.url || ""}>
                                {variant.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : null
                    )}
                  </div>
                )} */}

                {Models.map((model) =>
                  model.mash.map((mash) =>
                    mash.mashVariants?.mash?.length ? (
                      <div key={mash.id} className="mb-6">
                        <label className="text-white text-sm font-medium mb-2 block">
                          {mash.mashVariants.name} Variant:
                        </label>
                        <CustomSelectWithImages
                          options={mash.mashVariants.mash}
                          size={42}
                          value={
                            selectedVariants?.id &&
                            mash.mashVariants.mash.find(
                              (v) => v.id === selectedVariants.id
                            )
                              ? selectedVariants
                              : null
                          }
                          onChange={(variant: Mash) => {
                            changeSelectedVariants(variant);

                            // Optionally reset fabric or textures if needed
                          }}
                        />
                      </div>
                    ) : null
                  )
                )}

                {/* Fabric Selection by FabricRage */}
                {selectedModel && selectedModel?.mash?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white text-sm font-medium mb-2">
                      Fabrics
                    </h3>
                    {selectedModel.mash.map((mesh) =>
                      mesh.textureEnable && mesh.fabricRange.length > 0 ? (
                        <div key={mesh.id} className="mb-5">
                          <h4 className="text-white mb-1">{mesh.name}</h4>

                          {/* Select Fabric Rage */}
                          <select
                            className="w-full p-2 rounded bg-white text-black mb-2"
                            value={fabricRageMap[mesh.id]?.id || ""}
                            onChange={(e) => {
                              const rage = mesh.fabricRange.find(
                                (r) => r.id === parseInt(e.target.value)
                              );
                              setFabricRageForVariant(mesh.id, rage || null);
                              // Optionally reset selected fabric when rage changes
                              changeSelectedFabrics((prev) => ({
                                ...prev,
                                [mesh.mashName]: {} as Fabric,
                              }));
                            }}
                          >
                            <option value="">Select Fabric Range</option>
                            {mesh.fabricRange.map((rage) => (
                              <option key={rage.id} value={rage.id}>
                                {rage.name}
                              </option>
                            ))}
                          </select>

                          {/* Select Fabric from Selected Rage */}
                          {fabricRageMap[mesh.id] && (
                            <CustomSelectWithImages
                              options={fabricRageMap[mesh.id]?.fabric}
                              size={32}
                              value={
                                selectedFabrics[mesh.mashName]?.id
                                  ? fabricRageMap[mesh.id]?.fabric.find(
                                      (f) =>
                                        f.id ===
                                        selectedFabrics[mesh.mashName]?.id
                                    )
                                  : null
                              }
                              onChange={(selected: Fabric) => {
                                changeSelectedFabrics((prev) => ({
                                  ...prev,
                                  [mesh.mashName]: selected,
                                }));
                              }}
                            />
                          )}

                          {/* Reset Fabric */}
                          {selectedFabrics[mesh.name] && (
                            <button
                              onClick={() => {
                                changeSelectedFabrics((prev) => ({
                                  ...prev,
                                  [mesh.name]: {} as Fabric,
                                }));
                                setFabricRageForVariant(mesh.id, null);
                              }}
                              className="mt-2 text-white text-xs px-2 py-1 border border-white rounded hover:bg-white hover:text-black"
                            >
                              Reset Fabric
                            </button>
                          )}
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  );
};

export default CustomizePanel;
