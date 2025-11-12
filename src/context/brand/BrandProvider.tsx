import { useEffect, useMemo, useState } from "react";
import { BrandContext, type Brand } from "./BrandContext";

export type BrandProviderProps = {
  children: React.ReactNode;
  /**
   * Default brand to use if none is set in localStorage (default: null)
   */
  defaultBrand: Brand;
};

/**
 * BrandProvider component to manage and provide brand context settings for the application
 */
export function BrandProvider({
  children,
  defaultBrand,
  ...props
}: BrandProviderProps) {
  const [brand, setBrand] = useState<Brand>(defaultBrand);

  // Apply theme class to document root when brand changes
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    switch (brand) {
      case "light":
        root.classList.add("light");
        break;
      case "dark":
        root.classList.add("dark");
        break;
    }
  }, [brand]);

  const value = useMemo(
    () => ({
      brand,
      setBrand,
    }),
    [brand]
  );

  return (
    <BrandContext.Provider {...props} value={value}>
      {children}
    </BrandContext.Provider>
  );
}
