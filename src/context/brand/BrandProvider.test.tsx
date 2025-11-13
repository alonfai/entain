import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render } from "vitest-browser-react";
import { BrandProvider } from "./BrandProvider";
import { useBrand } from "@/hooks/useBrand";

describe("BrandProvider", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("light", "dark");
  });

  afterEach(() => {
    document.documentElement.classList.remove("light", "dark");
  });

  it("should render children", async () => {
    const { getByText } = await render(
      <BrandProvider defaultBrand="light">
        <div>Test Child</div>
      </BrandProvider>,
    );

    await expect.element(getByText("Test Child")).toBeInTheDocument();
  });

  it("should apply default brand class to document root", async () => {
    await render(
      <BrandProvider defaultBrand="dark">
        <div>Test</div>
      </BrandProvider>,
    );

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should update document class when brand changes", async () => {
    const TestComponent = () => {
      const { setBrand } = useBrand();
      return <button onClick={() => setBrand("dark")}>Change Brand</button>;
    };

    const { getByText } = await render(
      <BrandProvider defaultBrand="light">
        <TestComponent />
      </BrandProvider>,
    );

    expect(document.documentElement.classList.contains("light")).toBe(true);

    const button = getByText("Change Brand");
    await button.click();

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });
});
