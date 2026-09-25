import type {
  FieldErrors,
  UseFormRegister,
  UseFieldArrayReturn,
  UseFormHandleSubmit,
  Control
} from "react-hook-form";

import type {
  QuotationFormValues,
} from "../schema/quotation.schema";

import QuotationItems from "./QuotationItems";

interface QuotationFormProps {
  register: UseFormRegister<QuotationFormValues>;


  errors: FieldErrors<QuotationFormValues>;

  control: Control<QuotationFormValues>;

  fieldArray: UseFieldArrayReturn<
    QuotationFormValues,
    "items"
  >;

  handleSubmit: UseFormHandleSubmit<QuotationFormValues>;

  isEditMode: boolean;

  isSubmitting: boolean;

  onSubmit: (
    data: QuotationFormValues
  ) => void | Promise<void>;
}

const QuotationForm = ({
  register,
  handleSubmit,
  control,
  errors,
  fieldArray,
  isEditMode,
  isSubmitting,
  onSubmit,
}: QuotationFormProps) => {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
     
      <QuotationItems
        fieldArray={fieldArray}
        register={register}
        errors={errors}
        control={control}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-[#6B5A4A]">
            Discount
          </label>

          <input
            type="number"
            min={0}
            {...register("discount", {
              valueAsNumber: true,
            })}
            className="w-full rounded-md border border-[#D9C7A3] px-3 py-2 text-sm outline-none focus:border-[#8B5E3C]"
            placeholder="0"
          />

          {errors.discount && (
            <p className="mt-1 text-xs text-red-500">
              {errors.discount.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[#6B5A4A]">
            Tax
          </label>

          <input
            type="number"
            min={0}
            {...register("tax", {
              valueAsNumber: true,
            })}
            className="w-full rounded-md border border-[#D9C7A3] px-3 py-2 text-sm outline-none focus:border-[#8B5E3C]"
            placeholder="0"
          />

          {errors.tax && (
            <p className="mt-1 text-xs text-red-500">
              {errors.tax.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-[#6B5A4A]">
          Notes
        </label>

        <textarea
          {...register("notes")}
          rows={4}
          placeholder="Add any additional notes..."
          className="w-full resize-none rounded-md border border-[#D9C7A3] px-3 py-2 text-sm outline-none focus:border-[#8B5E3C]"
        />
        {errors.notes && (
          <p className="mt-1 text-xs text-red-500">
            {errors.notes.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-[#8B5E3C] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#754B31] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Quotation"
              : "Create Quotation"}
        </button>
      </div>
    </form>
  );
};

export default QuotationForm;