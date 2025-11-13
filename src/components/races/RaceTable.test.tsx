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
      <RaceTable columns={mockColumns} data={mockData} />,
    );

    await expect.element(getByText("Race 1")).toBeInTheDocument();
    await expect.element(getByText("Race 2")).toBeInTheDocument();
    await expect.element(getByText("Race 3")).toBeInTheDocument();
  });

  it("should display empty message when no data", async () => {
    const { getByText } = await renderWithProvider(
      <RaceTable columns={mockColumns} data={[]} emptyDataText="No races available" />,
    );

    await expect.element(getByText("No races available")).toBeInTheDocument();
  });

  it("should display default empty message", async () => {
    const { getByText } = await renderWithProvider(<RaceTable columns={mockColumns} data={[]} />);

    await expect.element(getByText("No Reace results found.")).toBeInTheDocument();
  });

  it("should limit displayed rows when limit is provided", async () => {
    const { container } = await renderWithProvider(
      <RaceTable columns={mockColumns} data={mockData} limit={2} />,
    );

    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(2);
  });

  it("should render filter dropdown", async () => {
    const { getByText } = await renderWithProvider(
      <RaceTable columns={mockColumns} data={mockData} />,
    );

    await expect.element(getByText("Filter by:")).toBeInTheDocument();
  });

  it("should apply sorting when sort function is provided", async () => {
    const sortFn = (a: TestData, b: TestData) => a.name.localeCompare(b.name);

    const { container } = await renderWithProvider(
      <RaceTable columns={mockColumns} data={mockData} sort={sortFn} />,
    );

    const rows = container.querySelectorAll("tbody tr");
    const firstRowText = rows[0]?.textContent || "";
    expect(firstRowText).toContain("Race 1");
  });

  it("should apply initialCategoryFilter to useState hooks", async () => {
    // Create test data with different category IDs that match the constants
    const testDataWithCategories: TestData[] = [
      { id: "1", name: "Greyhound Race", category_id: "9daef0d7-bf3c-4f50-921d-8e818c60fe61" },
      { id: "2", name: "Horse Race", category_id: "4a2788f8-e825-4d36-9894-efd4baf1cfae" },
      { id: "3", name: "Harness Race", category_id: "161d9be2-e909-4326-8c2c-35ed71fb460b" },
    ];

    const { container } = await renderWithProvider(
      <RaceTable
        columns={mockColumns}
        data={testDataWithCategories}
        initialCategoryFilter="GREYHOUND"
      />,
    );

    // Check that only greyhound races are shown (filtered by the initial category filter)
    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(1);

    // Verify the correct race is displayed
    const rowText = rows[0]?.textContent || "";
    expect(rowText).toContain("Greyhound Race");
    expect(rowText).not.toContain("Horse Race");
    expect(rowText).not.toContain("Harness Race");

    // Check that the filter dropdown shows the selected category
    const selectTrigger = container.querySelector('[role="combobox"]');
    expect(selectTrigger).toBeTruthy();
    expect(selectTrigger?.textContent).toContain("greyhound");
  });

  it("should handle onValueChange method correctly for category filtering", async () => {
    // Create test data with different category IDs that match the constants
    const testDataWithCategories: TestData[] = [
      { id: "1", name: "Greyhound Race", category_id: "9daef0d7-bf3c-4f50-921d-8e818c60fe61" },
      { id: "2", name: "Horse Race", category_id: "4a2788f8-e825-4d36-9894-efd4baf1cfae" },
      { id: "3", name: "Harness Race", category_id: "161d9be2-e909-4326-8c2c-35ed71fb460b" },
    ];

    const { container, getByRole } = await renderWithProvider(
      <RaceTable columns={mockColumns} data={testDataWithCategories} />,
    );

    // Initially, all races should be shown
    let rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(3);

    // Click on the select dropdown
    const selectTrigger = getByRole("combobox");
    await expect.element(selectTrigger).toBeInTheDocument();
    await selectTrigger.click();

    // Wait for options to appear and click on "horse" option
    const horseOption = getByRole("option", { name: "horse" });
    await expect.element(horseOption).toBeInTheDocument();
    await horseOption.click();

    // After filtering by horse category, only horse race should be shown
    rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(1);

    // Verify the correct race is displayed
    const rowText = rows[0]?.textContent || "";
    expect(rowText).toContain("Horse Race");
    expect(rowText).not.toContain("Greyhound Race");
    expect(rowText).not.toContain("Harness Race");

    // Open the dropdown again and select "All Categories"
    await selectTrigger.click();
    const allCategoriesOption = getByRole("option", { name: "All Categories" });
    await expect.element(allCategoriesOption).toBeInTheDocument();
    await allCategoriesOption.click();

    // After selecting "All Categories", all races should be shown again
    rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(3);
  });
});
