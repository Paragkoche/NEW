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

                {/* Mesh Variants */}
                {model && model?.mash?.length > 1 && (
                  <>
                    {model.mash.map((mesh, i) =>
                      mesh.variants.length > 0 ? (
                        <div key={i} className="mb-6">
                          <h3 className="text-white text-sm font-medium mb-2">
                            {mesh.name}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {mesh.variants.map((variant) => (
                              <div
                                key={variant.id}
                                className={`cursor-pointer border-2 rounded p-1 ${
                                  selectedVariants[mesh.name] === variant.url
                                    ? "border-white"
                                    : "border-transparent"
                                }`}
                                onClick={() =>
                                  setSelectedVariants((prev) => ({
                                    ...prev,
                                    [mesh.name]: variant.url || "",
                                  }))
                                }
                              >
                                {variant.thumbnailUrl ? (
                                  <div className="relative w-12 h-12">
                                    <Image
                                      src={`${API_BASE_URL}/${variant.thumbnailUrl}`}
                                      alt={variant.name}
                                      fill
                                      className="rounded"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-sm text-white">
                                    {variant.name}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                    {Object.keys(selectedVariants).length > 0 && (
                      <div className="mb-6">
                        <button
                          onClick={() => setSelectedVariants({})}
                          className="bg-white text-black px-3 py-1 rounded hover:bg-gray-100"
                        >
                          Reset Variants
                        </button>
                      </div>
                    )}
                  </>
                )}

                {model && model?.mash?.length > 0 && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-white text-sm font-medium mb-2">
                        Fabrics
                      </h3>
                      <div className="flex flex-col gap-4">
                        {model.mash.map((mesh) =>
                          mesh.textures.length > 0 ? (
                            <div key={mesh.id}>
                              <h4 className="text-white mb-1">
                                {mesh.name} Fabrics
                              </h4>
                              <div className="flex gap-2 flex-wrap items-center">
                                {mesh.textures.map((fabric) => (
                                  <div
                                    key={fabric.id}
                                    className={`w-12 h-12 cursor-pointer rounded-lg border-2 ${
                                      selectedFabrics[mesh.name]?.url ===
                                      fabric.url
                                        ? "border-white"
                                        : "border-transparent"
                                    }`}
                                    onClick={() =>
                                      setSelectedFabrics((prev) => ({
                                        ...prev,
                                        [mesh.name]: fabric,
                                      }))
                                    }
                                    style={{
                                      backgroundImage: `url(${API_BASE_URL}/${fabric.thumbnailUrl})`,
                                      backgroundSize: "cover",
                                    }}
                                  />
                                ))}
                                {selectedFabrics[mesh.name] && (
                                  <button
                                    onClick={() => deselectFabric(mesh.name)}
                                    className="text-white text-xs px-2 py-1 border border-white rounded hover:bg-white hover:text-black"
                                  >
                                    Reset
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                    {/* {Object.keys(selectedFabrics).length > 0 && (
                      <div className="mb-6">
                        <button
                          onClick={resetFabrics}
                          className="bg-white text-black px-3 py-1 rounded hover:bg-gray-100"
                        >
                          Reset Fabrics
                        </button>
                      </div>
                    )} */}
                  </>
                )}

                {/* Model Switcher */}
                {Config.model.length > 1 && (
                  <div className="mb-6">
                    <h3 className="text-white text-sm font-medium mb-2">
                      Models
                    </h3>
                    <div className="flex gap-2">
                      {Config.model.map((v, i) => (
                        <div
                          key={i}
                          className="relative w-10 h-10 cursor-pointer rounded overflow-hidden border"
                          onClick={() => setModel(v)}
                        >
                          <Image
                            fill
                            src={`${API_BASE_URL}/${v.thumbnailUrl}`}
                            alt="model"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Environment Picker */}
                {Config.Env.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white text-sm font-medium mb-2">
                      Environment
                    </h3>
                    <div className="flex gap-2">
                      {Config.Env.map((env, i) => (
                        <div
                          key={i}
                          className="relative w-10 h-10 cursor-pointer rounded overflow-hidden border"
                          onClick={() => setEnv(env)}
                        >
                          <Image
                            fill
                            src={`${API_BASE_URL}/${env.thumbnailUrl}`}
                            alt="env"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Background Picker */}
                {Config.bgs.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white text-sm font-medium mb-2">
                      Background
                    </h3>
                    <div className="flex gap-2">
                      {Config.bgs.map((bg, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full cursor-pointer border border-white"
                          style={{ backgroundColor: bg.color }}
                          onClick={() => setBg(bg)}
                        />
                      ))}
                    </div>
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
