"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, X } from "lucide-react";
import { useConfig } from "@/context/configure-ctx";
import Image from "next/image";
import { Fabric } from "@/types/type";
import { Mash } from "@/types/type";

const CustomizePanel = () => {
  const [open, setOpen] = useState(false);
  const {
    selectedModel,
    selectedVariants,
    selectedFabrics,
    changeSelectedModel,
    selectedEnv,
    changeSelectedEnv,
    changeSelectedBg,
    changeSelectedFabrics,
    changeSelectedVariants,
    selectedBg,
    bgs,
    setBgs,
    envs,
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
    const selectedVariant = mash.variants?.mash.find(
      (variantMash) => variantMash.name === selectedVariantName
    );
    console.log("sspss::", selectedVariant);

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
            className="bg-red-600/60 h-[55px] w-[55px] fixed right-0 top-1/2 transform -translate-y-1/2 cursor-pointer flex justify-center items-center text-white rounded-l-3xl z-50"
            onClick={togglePanel}
          >
            <Pencil />
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
                  <h2 className="text-xl font-semibold">Customize</h2>
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

                {/* Environment Selection */}
                {envs && envs.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white text-sm font-medium mb-2">
                      Environment
                    </h3>
                    <select
                      className="w-full p-2 rounded bg-white text-black"
                      value={selectedEnv?.id || ""}
                      onChange={(e) =>
                        changeSelectedEnv(
                          envs.find(
                            (env) => env.id === parseInt(e.target.value)
                          ) ?? null
                        )
                      }
                    >
                      {envs.map((env) => (
                        <option key={env.id} value={env.id}>
                          {env.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Background Selection */}
                {bgs && bgs.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white text-sm font-medium mb-2">
                      Background
                    </h3>
                    <select
                      className="w-full p-2 rounded bg-white text-black"
                      value={selectedBg?.id || ""}
                      onChange={(e) =>
                        changeSelectedBg(
                          bgs.find(
                            (bg) => bg.id === parseInt(e.target.value)
                          ) ?? null
                        )
                      }
                    >
                      {bgs.map((bg) => (
                        <option key={bg.id} value={bg.id}>
                          {bg.color}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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
                {Models.map((mash) =>
                  mash.mash.map(
                    (mash) =>
                      mash.variants && (
                        <div key={mash.id} className="mb-6">
                          <label
                            htmlFor={`variant-select-${mash.id}`}
                            className="text-white text-sm font-medium mb-2"
                          >
                            {mash.name}:
                          </label>
                          <select
                            id={`variant-select-${mash.id}`}
                            className="w-full p-2 rounded bg-white text-black mb-2"
                            value={selectedVariants?.name || ""}
                            onChange={(event) =>
                              handleVariantChange(event, mash)
                            }
                          >
                            <option value="">Default</option>
                            {mash?.variants?.mash.map((variant) => (
                              <option key={variant.id} value={variant.name}>
                                {variant.name}
                              </option>
                            ))}
                          </select>

                          {/* Display available textures for the selected variant */}
                          {selectedVariants &&
                            selectedVariants.Mash &&
                            selectedVariants.Mash?.textures && (
                              <div>
                                <h3>Textures</h3>
                                {selectedVariants.Mash?.textures.map(
                                  (texture, index) => (
                                    <button
                                      key={index}
                                      onClick={() => {
                                        // When a texture is selected, update the fabric for this mash
                                        // changeSelectedFabrics((prevFabrics) => ({
                                        //   ...prevFabrics,
                                        //   [mash.mashName]: texture, // Store the selected texture in the context
                                        // }));
                                      }}
                                    >
                                      {texture.name}{" "}
                                      {/* Assuming each texture has a 'name' property */}
                                    </button>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      )
                  )
                )}

                {/* Fabric Selection by FabricRage */}
                {selectedModel && selectedModel?.mash?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white text-sm font-medium mb-2">
                      Fabrics
                    </h3>
                    {selectedModel.mash.map((mesh) =>
                      mesh.textureEnable && mesh.textures.length > 0 ? (
                        <div key={mesh.id} className="mb-5">
                          <h4 className="text-white mb-1">{mesh.name}</h4>

                          {/* Select Fabric Rage */}
                          <select
                            className="w-full p-2 rounded bg-white text-black mb-2"
                            value={fabricRageMap[mesh.id]?.id || ""}
                            onChange={(e) => {
                              const rage = mesh.textures.find(
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
                            {mesh.textures.map((rage) => (
                              <option key={rage.id} value={rage.id}>
                                {rage.name}
                              </option>
                            ))}
                          </select>

                          {/* Select Fabric from Selected Rage */}
                          {fabricRageMap[mesh.id] && (
                            <select
                              className="w-full p-2 rounded bg-white text-black"
                              value={selectedFabrics[mesh.mashName]?.id || ""}
                              onChange={(e) => {
                                const selected = fabricRageMap[
                                  mesh.id
                                ]?.fabrics.find(
                                  (f) => f.id === parseInt(e.target.value)
                                );
                                if (selected) {
                                  changeSelectedFabrics((prev) => ({
                                    ...prev,
                                    [mesh.mashName]: selected,
                                  }));
                                }
                              }}
                            >
                              <option value="">Select fabric</option>
                              {fabricRageMap[mesh.id]?.fabrics.map((fabric) => (
                                <option key={fabric.id} value={fabric.id}>
                                  {fabric.name}
                                </option>
                              ))}
                            </select>
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
