// src/constants/api.ts
export const API_ENDPOINTS = {
  CREATE_TOKEN: "/create/token",
  CREATE_COLLECTION: "/create/collection",
  MINT_NFT: "/mint/nft",
} as const;

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const TOAST_STYLE = {
  backgroundColor: "rgb(31 41 55 / 0.8)",
  color: "rgb(250 204 21)",
  border: "1px solid",
  borderColor: "rgb(250 204 21 / 0.2)",
  borderRadius: "0.5rem",
} as const;

export const SonnerStyle = {
  backgroundColor: "rgb(31 41 55)",
  // backgroundColor: "rgb(31 41 55 / 0.5)",
  color: "rgb(250 204 21 )",
  border: "1px solid",
  borderColor: "rgb(250 204 21 / 0.2)",
};

