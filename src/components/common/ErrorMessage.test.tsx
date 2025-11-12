import { describe, it, expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import { ErrorMessage } from "./ErrorMessage";
import { BrandProvider } from "@/context/brand";

describe("ErrorMessage", () => {
  const renderWithProvider = (ui: React.ReactElement) =>
    render(<BrandProvider defaultBrand="light">{ui}</BrandProvider>);

  it("should render with default props", async () => {
    const { getByText } = await renderWithProvider(<ErrorMessage />);
    await expect.element(getByText("Error")).toBeInTheDocument();
    await expect
      .element(getByText("Something went wrong. Please try again."))
      .toBeInTheDocument();
  });

  it("should render custom title and message", async () => {
    const { getByText } = await renderWithProvider(
      <ErrorMessage title="Custom Error" message="Custom error message" />
    );
    await expect
      .element(getByText("Custom Error", { exact: true }))
      .toBeInTheDocument();
    await expect
      .element(getByText("Custom error message", { exact: true }))
      .toBeInTheDocument();
  });

  it("should call onRetry when retry button is clicked", async () => {
    const onRetry = vi.fn();
    const { getByRole } = await renderWithProvider(
      <ErrorMessage onRetry={onRetry} />
    );

    const retryButton = getByRole("button", { hasText: "Try Again" });
    await retryButton.click();

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("should not show retry button when showRetry is false", async () => {
    const { container } = await renderWithProvider(
      <ErrorMessage showRetry={false} />
    );
    const retryButton = container.querySelector("button");
    expect(retryButton).toBeNull();
  });

  it("should not show retry button when onRetry is not provided", async () => {
    const { getByRole } = await renderWithProvider(<ErrorMessage />);
    const retryButton = getByRole("button", { hasText: "Try Again" });
    expect(retryButton).not.toBeInTheDocument();
  });

  it("should apply custom className", async () => {
    const { container } = await renderWithProvider(
      <ErrorMessage className="custom-class" />
    );
    const errorDiv = container.querySelector(".custom-class");
    expect(errorDiv).not.toBeNull();
  });

  it("should apply className to the main container div with role alert", async () => {
    const { getByRole } = await renderWithProvider(
      <ErrorMessage className="my-custom-error-class" />
    );
    const alertElement = getByRole("alert");
    await expect.element(alertElement).toHaveClass("my-custom-error-class");
  });

  it("should have role alert for accessibility", async () => {
    const { container } = await renderWithProvider(<ErrorMessage />);
    const alertElement = container.querySelector('[role="alert"]');
    expect(alertElement).not.toBeNull();
  });
});
