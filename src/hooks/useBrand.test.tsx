import { describe, it, expect } from "vitest";
import { renderHook } from "vitest-browser-react";
import { BrandProvider } from "@/context/brand";
import { useBrand } from "./useBrand";

describe("useBrand", () => {
  it("should return brand context value", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BrandProvider defaultBrand="light">{children}</BrandProvider>
    );

    const { result } = await renderHook(() => useBrand(), { wrapper });

    expect(result.current.brand).toBe("light");
    expect(typeof result.current.setBrand).toBe("function");
  });

  it("should throw error when used outside BrandProvider", async () => {
    await expect(renderHook(() => useBrand())).rejects.toThrow(
      "useBrand must be used within a BrandProvider"
    );
  });
});
