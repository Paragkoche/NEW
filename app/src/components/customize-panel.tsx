"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, X } from "lucide-react";
import { useConfig } from "@/context/configure-ctx";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

const CustomizePanel = () => {
  const [open, setOpen] = useState(false);
  const {
    Config,
    model,
    setEnv,
    setBg,
    setModel,
    setSelectedVariants,
    selectedVariants,
    setSelectedFabrics,
    deselectFabric,
    selectedFabrics,
    bg,
  } = useConfig();

  const togglePanel = () => setOpen(!open);

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
    Config && (
      <>
        {/* Button to open the panel */}
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

        {/* Panel and overlay */}
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
                className="fixed top-1/2 right-0 transform -translate-y-1/2 h-[80%] max-w-[90vw] w-[350px] bg-red-600/60 rounded-l-3xl backdrop-blur-2xl p-5 z-50 shadow-2xl overflow-y-auto"
              >
                <div className="flex justify-between items-center text-white mb-4">
                  <h2 className="text-xl font-semibold">Customize</h2>
                  <X
                    className="cursor-pointer"
                    size={24}
                    onClick={togglePanel}
                  />
                </div>

                {/* Model Selection (Dropdown) */}
                {Config.model.length > 1 && (
                  <div className="mb-6">
                    <h3 className="text-white text-sm font-medium mb-2">
                      Models
                    </h3>
                    <select
                      className="w-full p-2 rounded bg-white text-black"
                      value={model?.id || ""}
                      onChange={(e) =>
                        setModel(
                          Config.model.find(
                            (v) => v.id === parseInt(e.target.value)
                          )
                        )
                      }
                    >
                      {Config.model.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Environment Selection (Dropdown) */}
                {Config.Env.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white text-sm font-medium mb-2">
                      Environment
                    </h3>
                    <select
                      className="w-full p-2 rounded bg-white text-black"
                      value={model?.id || ""}
                      onChange={(e) =>
                        setEnv(
                          Config.Env.find(
                            (env) => env.id === parseInt(e.target.value)
                          )
                        )
                      }
                    >
                      {Config.Env.map((env) => (
                        <option key={env.id} value={env.id}>
                          {env.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Background Selection (Dropdown) */}
                {Config.bgs.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white text-sm font-medium mb-2">
                      Background
                    </h3>
                    <select
                      className="w-full p-2 rounded bg-white text-black"
                      value={bg?.id || ""}
                      onChange={(e) =>
                        setBg(
                          Config.bgs.find(
                            (bg) => bg.id === parseInt(e.target.value)
                          )
                        )
                      }
                    >
                      {Config.bgs.map((bg) => (
                        <option key={bg.id} value={bg.id}>
                          {bg.color}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Mesh Variants */}
                {model && model?.mash?.length > 1 && (
                  <>
                    {model.mash.map((mesh, i) =>
                      mesh.variants.length > 0 ? (
                        <div key={i} className="mb-6">
                          <h3 className="text-white text-sm font-medium mb-2">
                            {mesh.name}
                          </h3>
                          <select
                            className="w-full p-2 rounded bg-white text-black"
                            value={selectedVariants[mesh.name] || ""}
                            onChange={(e) =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [mesh.name]: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select a variant</option>
                            {mesh.variants.map((variant) => (
                              <option
                                key={variant.id}
                                value={variant.url || ""}
                              >
                                {variant.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : null
                    )}
                    {/* {Object.keys(selectedVariants).length > 0 && (
                      <div className="mb-6">
                        <button
                          onClick={() => setSelectedVariants({})}
                          className="bg-white text-black px-3 py-1 rounded hover:bg-gray-100"
                        >
                          Reset Variants
                        </button>
                      </div>
                    )} */}
                  </>
                )}

                {/* Fabrics */}
                {model && model?.mash?.length > 0 && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-white text-sm font-medium mb-2">
                        Fabrics
                      </h3>
                      {model.mash.map((mesh) =>
                        mesh.textures.length > 0 ? (
                          <div key={mesh.id} className="mb-4">
                            <h4 className="text-white mb-2">
                              {mesh.name} Fabrics
                            </h4>
                            <select
                              className="w-full p-2 rounded bg-white text-black"
                              value={selectedFabrics[mesh.name]?.id || ""}
                              onChange={(e) =>
                                setSelectedFabrics((prev) => ({
                                  ...prev,
                                  [mesh.name]:
                                    mesh.textures.find(
                                      (fabric) =>
                                        fabric.id === parseInt(e.target.value)
                                    ) || null,
                                }))
                              }
                            >
                              <option value="">Select a fabric</option>
                              {mesh.textures.map((fabric) => (
                                <option key={fabric.id} value={fabric.id}>
                                  {fabric.name}
                                </option>
                              ))}
                            </select>
                            {selectedFabrics[mesh.name] && (
                              <button
                                onClick={() => deselectFabric(mesh.name)}
                                className="mt-2 text-white text-xs px-2 py-1 border border-white rounded hover:bg-white hover:text-black"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        ) : null
                      )}
                    </div>
                  </>
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
