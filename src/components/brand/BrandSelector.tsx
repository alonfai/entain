import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrand } from "@/hooks/useBrand";

/**
 * A custom brand component that allows users to select/modify their brand.
 */
export function BrandSelector() {
  const { brand, setBrand } = useBrand();

  return (
    <div
      className="flex items-center gap-4 px-6 py-4 rounded-lg shadow-sm border transition-colors"
      style={{
        backgroundColor: "var(--custom-surface)",
        borderColor: "var(--custom-border)",
      }}
    >
      <h1
        className="text-lg font-semibold tracking-tight"
        style={{ color: "var(--custom-text-primary)" }}
      >
        Select Theme
      </h1>
      <Select onValueChange={setBrand} value={brand}>
        <SelectTrigger
          className="w-40 border-2 rounded-md shadow-sm transition-all hover:shadow-md focus:ring-2 focus:ring-offset-2"
          style={{
            borderColor: "var(--custom-border)",
            backgroundColor: "var(--custom-bg-primary)",
            color: "var(--custom-text-primary)",
          }}
        >
          <SelectValue placeholder="Choose a theme" />
        </SelectTrigger>
        <SelectContent
          className="rounded-md shadow-lg border-2 z-50"
          style={{
            backgroundColor: "var(--custom-surface)",
            borderColor: "var(--custom-border)",
          }}
        >
          <SelectItem
            value="light"
            className="cursor-pointer transition-colors rounded-sm"
            style={{
              color: "var(--custom-text-primary)",
            }}
          >
            Light
          </SelectItem>
          <SelectItem
            value="dark"
            className="cursor-pointer transition-colors rounded-sm"
            style={{
              color: "var(--custom-text-primary)",
            }}
          >
            Dark
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
