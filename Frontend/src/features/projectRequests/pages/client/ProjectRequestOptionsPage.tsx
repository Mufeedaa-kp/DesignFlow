import { useState } from "react";

import { useMaterials } from "../../../catalog/hooks/useMaterials";
import { useColorThemes } from "../../../catalog/hooks/useColorThemes";

import MaterialSelector from "../../components/MaterialSelector";
import ColorThemeSelector from "../../components/ColorThemeSelector";

import type {
  IColorTheme,
  IMaterial,
} from "../../../catalog/types/catalog.types";

const MATERIALS_PER_PAGE = 8;
const COLOR_THEMES_PER_PAGE = 12;

interface ProjectRequestOptionsPageProps {
  selectedMaterialIds: string[];
  selectedColorThemeIds: string[];

  onSelectMaterial: (material: IMaterial) => void;

  onSelectColorTheme: (colorTheme: IColorTheme) => void;

  onBack: () => void;
  onContinue: () => void;
}

const ProjectRequestOptionsPage = ({
  selectedMaterialIds,
  selectedColorThemeIds,
  onSelectMaterial,
  onSelectColorTheme,
  onBack,
  onContinue,
}: ProjectRequestOptionsPageProps) => {
  const [materialsPage, setMaterialsPage] = useState(1);
  const [colorThemesPage, setColorThemesPage] = useState(1);

  // -----------------------------
  // Materials
  // -----------------------------

  const {
    data: materialsData,
    isLoading: materialsLoading,
    isError: materialsError,
  } = useMaterials(materialsPage, MATERIALS_PER_PAGE);

  const materials: IMaterial[] = materialsData?.items ?? [];

  const materialsTotalPages =
    materialsData?.pagination?.totalPages ?? 1;

 

  const {
    data: colorThemesData,
    isLoading: colorThemesLoading,
    isError: colorThemesError,
  } = useColorThemes(colorThemesPage, COLOR_THEMES_PER_PAGE);

  const colorThemes: IColorTheme[] = colorThemesData?.items ?? [];

  const colorThemesTotalPages =
    colorThemesData?.pagination?.totalPages ?? 1;

  return (
    <div className="border border-border bg-white p-6 sm:p-8">
      {/* Materials */}
      <section>
        <h2 className="font-serif text-2xl text-charcoal">Materials</h2>
        <p className="mb-5 mt-1 text-sm text-muted">
          Select one or more materials.
        </p>

        {materialsLoading && (
          <div className="bg-panel p-5 text-center text-sm text-muted">
            Loading materials...
          </div>
        )}

        {materialsError && (
          <div className="bg-red-50 p-5 text-center text-sm text-red-500">
            Failed to load materials.
          </div>
        )}

        {!materialsLoading && !materialsError && (
          <MaterialSelector
            materials={materials}
            selectedMaterialIds={selectedMaterialIds}
            onSelect={onSelectMaterial}
            page={materialsPage}
            totalPages={materialsTotalPages}
            onPageChange={setMaterialsPage}
          />
        )}
      </section>

      <div className="my-8 border-t border-border" />

      {/* Color Themes */}
      <section>
        <h2 className="font-serif text-2xl text-charcoal">Color themes</h2>
        <p className="mb-5 mt-1 text-sm text-muted">
          Select one or more color themes.
        </p>

        {colorThemesLoading && (
          <div className="bg-panel p-5 text-center text-sm text-muted">
            Loading color themes...
          </div>
        )}

        {colorThemesError && (
          <div className="bg-red-50 p-5 text-center text-sm text-red-500">
            Failed to load color themes.
          </div>
        )}

        {!colorThemesLoading && !colorThemesError && (
          <ColorThemeSelector
            colorThemes={colorThemes}
            selectedColorThemeIds={selectedColorThemeIds}
            onSelect={onSelectColorTheme}
            page={colorThemesPage}
            totalPages={colorThemesTotalPages}
            onPageChange={setColorThemesPage}
          />
        )}
      </section>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <button
          type="button"
          onClick={onBack}
          className="border border-border px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-charcoal transition hover:bg-panel"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="border border-[var(--color-brown)] bg-[var(--color-brown)] px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-cream transition hover:brightness-110"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ProjectRequestOptionsPage;