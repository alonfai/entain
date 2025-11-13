import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { BrandSelector } from "./BrandSelector";
import { BrandProvider } from "@/context/brand";

describe("BrandSelector", () => {
  it("should render with default brand", async () => {
    const { getByText } = await render(
      <BrandProvider defaultBrand="light">
        <BrandSelector />
      </BrandProvider>
    );
    await expect.element(getByText("Select Theme")).toBeInTheDocument();
  });

  it("should display current brand value", async () => {
    const { getByText } = await render(
      <BrandProvider defaultBrand="dark">
        <BrandSelector />
      </BrandProvider>
    );
    await expect.element(getByText("Dark")).toBeInTheDocument();
  });

  it("should throw error when used outside BrandProvider", async () => {
    await expect(() => render(<BrandSelector />)).rejects.toThrow(
      "useBrand must be used within a BrandProvider"
    );
  });
});
