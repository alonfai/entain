import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { RaceTable } from "./RaceTable";
import { BrandProvider } from "@/context/brand";
import type { ColumnDef } from "@tanstack/react-table";

interface TestData {
  id: string;
  name: string;
  category_id: string;
}

describe("RaceTable", () => {
  const mockColumns: ColumnDef<TestData>[] = [
    {
      accessorKey: "category_id",
      header: "Category",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
  ];

  const mockData: TestData[] = [
    { id: "1", name: "Race 1", category_id: "cat-1" },
    { id: "2", name: "Race 2", category_id: "cat-2" },
    { id: "3", name: "Race 3", category_id: "cat-1" },
  ];

  const renderWithProvider = (ui: React.ReactElement) =>
    render(<BrandProvider defaultBrand="light">{ui}</BrandProvider>);

  it("should render table with data", async () => {
    const { getByText } = await renderWithProvider(
      <RaceTable columns={mockColumns} data={mockData} />
    );

    await expect.element(getByText("Race 1")).toBeInTheDocument();
    await expect.element(getByText("Race 2")).toBeInTheDocument();
    await expect.element(getByText("Race 3")).toBeInTheDocument();
  });

  it("should display empty message when no data", async () => {
    const { getByText } = await renderWithProvider(
      <RaceTable
        columns={mockColumns}
        data={[]}
        emptyDataText="No races available"
      />
    );

    await expect.element(getByText("No races available")).toBeInTheDocument();
  });

  it("should display default empty message", async () => {
    const { getByText } = await renderWithProvider(
      <RaceTable columns={mockColumns} data={[]} />
    );

    await expect
      .element(getByText("No Reace results found."))
      .toBeInTheDocument();
  });

  it("should limit displayed rows when limit is provided", async () => {
    const { container } = await renderWithProvider(
      <RaceTable columns={mockColumns} data={mockData} limit={2} />
    );

    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(2);
  });

  it("should render filter dropdown", async () => {
    const { getByText } = await renderWithProvider(
      <RaceTable columns={mockColumns} data={mockData} />
    );

    await expect.element(getByText("Filter by:")).toBeInTheDocument();
  });

  it("should apply sorting when sort function is provided", async () => {
    const sortFn = (a: TestData, b: TestData) =>
      a.name.localeCompare(b.name);

    const { container } = await renderWithProvider(
      <RaceTable columns={mockColumns} data={mockData} sort={sortFn} />
    );

    const rows = container.querySelectorAll("tbody tr");
    const firstRowText = rows[0]?.textContent || "";
    expect(firstRowText).toContain("Race 1");
  });
});
