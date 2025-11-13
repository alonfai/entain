import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { QueryProvider } from "./QueryProvider";
import { useQueryClient } from "@tanstack/react-query";

describe("QueryProvider", () => {
  it("should render children", async () => {
    const { getByText } = await render(
      <QueryProvider>
        <div>Test Child</div>
      </QueryProvider>,
    );

    await expect.element(getByText("Test Child")).toBeInTheDocument();
  });

  it("should provide query client to children", async () => {
    const TestingComponent = () => {
      const queryClient = useQueryClient();
      return <div>{queryClient ? "Client Available" : "No Client"}</div>;
    };

    const { getByText } = await render(
      <QueryProvider>
        <TestingComponent />
      </QueryProvider>,
    );

    await expect.element(getByText("Client Available")).toBeInTheDocument();
  });
});
