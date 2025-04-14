import { fileTypeFromBuffer } from "file-type";

export const getFileExtension = async (
  arrayBuffer: ArrayBuffer
): Promise<string> => {
  const buffer = Buffer.from(arrayBuffer); // Node.js-specific
  const result = await fileTypeFromBuffer(buffer);

  if (result?.ext) {
    return result.ext;
  }

  // Handle HDR files specifically
  const hdrSignature = Buffer.from([
    0x23, 0x3f, 0x52, 0x41, 0x44, 0x49, 0x41, 0x4e, 0x43, 0x45,
  ]); // "#?RADIANCE"
  if (buffer.slice(0, hdrSignature.length).equals(hdrSignature)) {
    return "hdr";
  }

  return "bin";
};
