import { useContext } from "react";
import { BrandContext, type BrandProviderState } from "../context/brand";

export const useBrand: () => BrandProviderState = () => {
  const context = useContext(BrandContext);

  if (context === null)
    throw new Error("useBrand must be used within a BrandProvider");

  return context;
};
