import { useState } from "react";
import toast from "react-hot-toast";

import {
  useCreateProjectRequest,
  useUploadProjectRequestImage,
} from "../../hooks/useClientProjectRequests";

import { useMyProfile } from "../../../profile/hooks/useProfile";

import ProjectRequestCategoryPage from "./ProjectRequestCategoryPage";
import ProjectRequestDesignPage from "./ProjectRequestDesignPage";
import ProjectRequestOptionsPage from "./ProjectRequestOptionsPage";
import ProjectRequestRequirementsPage from "./ProjectRequestRequirementsPage";
import ProjectRequestReviewPage from "./ProjectRequestReviewPage";

import type {
  ICatalogItem,
  IColorTheme,
  IMaterial,
} from "../../../catalog/types/catalog.types";

const CreateProjectRequestPage = () => {
  const [step, setStep] = useState(1);

  const { data: profileData } = useMyProfile();

const [formData, setFormData] = useState({
  projectName: "",

  category: "",

  catalogItem: "",

  materials: [] as string[],

  colorThemes: [] as string[],

  measurements: {
    height: 0,
    width: 0,
    unit: "ft" as "ft" | "cm",
    squareFeet: 0,
  },

  description: "",

  referenceImages: [] as string[],

  needBy: "",
});

  const [
    selectedCatalogItemDetails,
    setSelectedCatalogItemDetails,
  ] = useState<ICatalogItem | undefined>(
    undefined
  );

  const [
    selectedMaterialDetails,
    setSelectedMaterialDetails,
  ] = useState<IMaterial[]>([]);

  const [
    selectedColorThemeDetails,
    setSelectedColorThemeDetails,
  ] = useState<IColorTheme[]>([]);

  const createProjectRequestMutation =
    useCreateProjectRequest();

  const uploadProjectRequestImageMutation =
    useUploadProjectRequestImage();

  const handleCategorySelect = (
    categoryId: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      category: categoryId,
      catalogItem: "",
    }));

    setSelectedCatalogItemDetails(undefined);
  };

  const handleCatalogItemSelect = (
    item: ICatalogItem
  ) => {
    setFormData((previous) => ({
      ...previous,
      catalogItem: item._id,
    }));

    setSelectedCatalogItemDetails(item);
  };

  const handleMaterialSelect = (
    material: IMaterial
  ) => {
    setFormData((previous) => {
      const alreadySelected =
        previous.materials.includes(
          material._id
        );

      return {
        ...previous,
        materials: alreadySelected
          ? previous.materials.filter(
              (id) => id !== material._id
            )
          : [
              ...previous.materials,
              material._id,
            ],
      };
    });

    setSelectedMaterialDetails((previous) => {
      const alreadySelected =
        previous.some(
          (item) =>
            item._id === material._id
        );

      if (alreadySelected) {
        return previous.filter(
          (item) =>
            item._id !== material._id
        );
      }

      return [...previous, material];
    });
  };

  const handleColorThemeSelect = (
    colorTheme: IColorTheme
  ) => {
    setFormData((previous) => {
      const alreadySelected =
        previous.colorThemes.includes(
          colorTheme._id
        );

      return {
        ...previous,
        colorThemes: alreadySelected
          ? previous.colorThemes.filter(
              (id) =>
                id !== colorTheme._id
            )
          : [
              ...previous.colorThemes,
              colorTheme._id,
            ],
      };
    });

    setSelectedColorThemeDetails((previous) => {
      const alreadySelected =
        previous.some(
          (item) =>
            item._id === colorTheme._id
        );

      if (alreadySelected) {
        return previous.filter(
          (item) =>
            item._id !== colorTheme._id
        );
      }

      return [...previous, colorTheme];
    });
  };

  const handleReferenceImagesChange =
    async (files: File[]) => {
      if (!files.length) return;

      const remainingSlots =
        10 -
        formData.referenceImages.length;

      if (remainingSlots <= 0) {
        toast.error(
          "You can upload a maximum of 10 images."
        );
        return;
      }

      const filesToUpload =
        files.slice(
          0,
          remainingSlots
        );

      const uploadedImages: string[] = [];

      for (const file of filesToUpload) {
        try {
          const imageUrl =
            await uploadProjectRequestImageMutation.mutateAsync(
              file
            );

          uploadedImages.push(imageUrl);
        } catch (error) {
          console.error(
            "Failed to upload reference image:",
            error
          );
        }
      }

      if (uploadedImages.length > 0) {
        setFormData((previous) => ({
          ...previous,
          referenceImages: [
            ...previous.referenceImages,
            ...uploadedImages,
          ],
        }));

        toast.success(
          `${uploadedImages.length} image${
            uploadedImages.length > 1
              ? "s"
              : ""
          } uploaded successfully.`
        );
      }
    };

  const personalInfo = {
    fullName:
      profileData?.fullName ?? "",
    email:
      profileData?.email ?? "",
    phone:
      profileData?.phone ?? "",
    address:
      profileData?.address ?? "",
  };

  const handleSubmit = () => {
    if (
      createProjectRequestMutation.isPending
    ) {
      return;
    }

    createProjectRequestMutation.mutate(
      {
        personalInfo,
        ...formData,
      },
      {
        onSuccess: () => {
          toast.success(
            "Project request submitted successfully!"
          );

          setFormData({
            projectName: "",
            category: "",
            catalogItem: "",
            materials: [],
            colorThemes: [],
            measurements: {
              height: 0,
              width: 0,
              unit: "ft" as "ft" | "cm",
              squareFeet: 0,
            },
            description: "",
            referenceImages: [],
            needBy: "",
          });

          setSelectedCatalogItemDetails(
            undefined
          );

          setSelectedMaterialDetails([]);

          setSelectedColorThemeDetails([]);

          setStep(1);
        },

        onError: (error) => {
          console.error(
            "Failed to submit project request:",
            error
          );

          toast.error(
            "Failed to submit project request. Please try again."
          );
        },
      }
    );
  };



  const estimatedTotal =
    (selectedCatalogItemDetails?.startingPrice ??
      0) +
    selectedMaterialDetails.reduce(
      (total, material) =>
        total + material.price,
      0
    );

  return (
    <div className="min-h-screen bg-[#F8F6F2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {step === 1 && (
          <ProjectRequestCategoryPage
            selectedCategoryId={
              formData.category
            }
            onSelectCategory={
              handleCategorySelect
            }
            onContinue={() => {
              if (!formData.category) {
                return;
              }

              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <ProjectRequestDesignPage
            categoryId={
              formData.category
            }
            selectedCatalogItemId={
              formData.catalogItem
            }
            onSelectCatalogItem={
              handleCatalogItemSelect
            }
            onBack={() => setStep(1)}
            onContinue={() => {
              if (!formData.catalogItem) {
                return;
              }

              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <ProjectRequestOptionsPage
            selectedMaterialIds={
              formData.materials
            }
            selectedColorThemeIds={
              formData.colorThemes
            }
            onSelectMaterial={
              handleMaterialSelect
            }
            onSelectColorTheme={
              handleColorThemeSelect
            }
            onBack={() => setStep(2)}
            onContinue={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <ProjectRequestRequirementsPage
            projectName={
              formData.projectName
            }
            measurements={
              formData.measurements
            }
            description={
              formData.description
            }
            referenceImages={
              formData.referenceImages
            }
            needBy={
              formData.needBy
            }
            onRequirementsSubmit={(data) => {
              setFormData((previous) => ({
                ...previous,
                projectName:
                  data.projectName,
                measurements:
                  data.measurements,
                description:
                  data.description,
                needBy:
                  data.needBy ?? "",
              }));

              setStep(5);
            }}
            onReferenceImagesChange={
              handleReferenceImagesChange
            }
            onBack={() => setStep(3)}
          />
        )}

        {step === 5 && (
          <ProjectRequestReviewPage
          projectName={formData.projectName}
            categoryId={
              formData.category
            }
            catalogItem={
              selectedCatalogItemDetails
            }
            materials={
              selectedMaterialDetails
            }
            colorThemes={
              selectedColorThemeDetails
            }
            measurements={
              formData.measurements
            }
            description={
              formData.description
            }
            referenceImages={
              formData.referenceImages
            }
            needBy={
              formData.needBy
            }
            estimatedTotal={
              estimatedTotal
            }
            isSubmitting={
              createProjectRequestMutation.isPending
            }
            onBack={() => setStep(4)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default CreateProjectRequestPage;