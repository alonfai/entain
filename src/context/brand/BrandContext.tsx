import { createContext } from "react";

/**
 *  Brand options available in the application
 */
export type Brand = "dark" | "light";

/**
 * State and updater function provided by the BrandContext for branding purposes
 */
export type BrandProviderState = {
  /** The selected active brand (or null) */
  brand: Brand | undefined;
  /**
   * Modify the current brand
   * @param brand - New brand to set
   * @returns void
   */
  setBrand: (brand: Brand) => void;
};

export const BrandContext = createContext<BrandProviderState | null>(
  null
);
