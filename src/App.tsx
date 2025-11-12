import { BrandProvider } from "./context/brand";
import { QueryProvider } from "./context/QueryProvider";
import { BrandSelector } from "./components/brand/BrandSelector";
import { Races } from "./components/races/Races";

function App() {
  return (
    <QueryProvider>
      <BrandProvider defaultBrand="light">
        <div className="w-full container mx-auto flex flex-col p-4">
          <header className="flex items-center gap-2 justify-end">
            <BrandSelector />
          </header>
          <main>
            <Races />
          </main>
        </div>
      </BrandProvider>
    </QueryProvider>
  );
}

export default App;
