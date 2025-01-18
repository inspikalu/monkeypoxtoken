// src/components/utils/collection-apis.ts
import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "./consts";
import {
  TokenFormData,
  CollectionFormData,
  NFTFormData,
} from "./launchpad-types";
import { SetStateAction } from "react";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createToken = async (
  data: TokenFormData,
  setIsLoading: (value: SetStateAction<boolean>) => void
) => {
  try {
    setIsLoading(true);
    const response = await api.post(API_ENDPOINTS.CREATE_TOKEN, {
      ...data,
      clientId: data.clientId || Date.now().toString(),
    });

    return { data: response.data, clientId: data.clientId };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Token Creation Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data?.message || "Failed to create token"
      );
    }
    throw error;
  }
};

export const createCollection = async (data: CollectionFormData) => {
  const clientId = Date.now().toString();

  try {
    const response = await api.post(API_ENDPOINTS.CREATE_COLLECTION, {
      ...data,
      clientId,
    });
    return { data: response.data, clientId };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Collection Creation Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data?.message || "Failed to create collection"
      );
    }
    throw error;
  }
};

// Add to collection-apis.ts

export const mintNFT = async (data: NFTFormData) => {
  const clientId = Date.now().toString();

  try {
    const response = await api.post(API_ENDPOINTS.MINT_NFT, {
      ...data,
      clientId,
    });
    return { data: response.data, clientId };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("NFT Minting Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(error.response?.data?.message || "Failed to mint NFT");
    }
    throw error;
  }
};
