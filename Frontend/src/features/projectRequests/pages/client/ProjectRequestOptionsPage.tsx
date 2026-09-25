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
    <>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-800 sm:text-2xl">
          Materials & Color Themes
        </h1>

        <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
          Choose the materials and color themes you prefer.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
        <span className="text-gray-400">1. Category</span>

        <span className="text-gray-300">→</span>

        <span className="text-gray-400">2. Design</span>

        <span className="text-gray-300">→</span>

        <span className="font-medium text-[#8B5E3C]">
          3. Options
        </span>

        <span className="text-gray-300">→</span>

        <span className="text-gray-400">4. Requirements</span>

        <span className="text-gray-300">→</span>

        <span className="text-gray-400">5. Review</span>
      </div>

      {/* Main Content */}
      <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
        {/* Materials */}
        <section>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
              Materials
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Select one or more materials.
            </p>
          </div>

          {materialsLoading && (
            <div className="rounded-lg bg-[#F8F6F2] p-5 text-center">
              <p className="text-xs text-gray-500 sm:text-sm">
                Loading materials...
              </p>
            </div>
          )}

          {materialsError && (
            <div className="rounded-lg bg-red-50 p-5 text-center">
              <p className="text-xs text-red-500 sm:text-sm">
                Failed to load materials.
              </p>
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

        {/* Divider */}
        <div className="my-6 border-t border-[#EDE7E1]" />

        {/* Color Themes */}
        <section>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
              Color Themes
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Select one or more color themes.
            </p>
          </div>

          {colorThemesLoading && (
            <div className="rounded-lg bg-[#F8F6F2] p-5 text-center">
              <p className="text-xs text-gray-500 sm:text-sm">
                Loading color themes...
              </p>
            </div>
          )}

          {colorThemesError && (
            <div className="rounded-lg bg-red-50 p-5 text-center">
              <p className="text-xs text-red-500 sm:text-sm">
                Failed to load color themes.
              </p>
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
    

<div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6">
  <button
    type="button"
    onClick={onBack}
    className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
  >
    Back
  </button>

  <button
    type="button"
    onClick={onContinue}
    className="rounded-lg bg-[#8B5E3C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#70482F]"
  >
    Continue
  </button>
</div>
      </div>
    </>
  );
};

export default ProjectRequestOptionsPage;