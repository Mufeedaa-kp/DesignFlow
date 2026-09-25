import type {
  FieldErrors,
  UseFormRegister,
  UseFieldArrayReturn,
  Control,
} from "react-hook-form";

import { useWatch } from "react-hook-form";

import type {
  QuotationFormValues,
} from "../schema/quotation.schema";

interface QuotationItemsProps {
  fieldArray: UseFieldArrayReturn<
    QuotationFormValues,
    "items",
    "id"
  >;
  register: UseFormRegister<QuotationFormValues>;
  errors: FieldErrors<QuotationFormValues>;
  control: Control<QuotationFormValues>;
}

const QuotationItems = ({
  fieldArray,
  register,
  errors,
  control,
}: QuotationItemsProps) => {
  const { fields, append, remove } = fieldArray;

  const items = useWatch({
    control,
    name: "items",
  });

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#3F332A]">
          Quotation Items
        </h3>

        <button
          type="button"
          onClick={() =>
            append({
              description: "",
              quantity: 1,
              unitPrice: 0,
            })
          }
          className="rounded-md border border-[#8B5E3C] px-3 py-1.5 text-xs font-medium text-[#8B5E3C] transition hover:bg-[#8B5E3C] hover:text-white"
        >
          + Add Item
        </button>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {fields.map((field, index) => {
          const price = Number(
            items?.[index]?.unitPrice ?? 0
          );

          const quantity = Number(
            items?.[index]?.quantity ?? 0
          );

          const value = price * quantity;

          return (
            <div
              key={field.id}
              className="rounded-lg border border-[#E5DDD5] bg-white p-4"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                
                <div className="md:col-span-4">
                  <label className="mb-1 block text-xs font-medium text-[#6B5A4A]">
                    Description
                  </label>

                  <input
                    {...register(
                      `items.${index}.description`
                    )}
                    placeholder="Item description"
                    className="w-full rounded-md border border-[#D9C7A3] px-3 py-2 text-sm outline-none focus:border-[#8B5E3C]"
                  />

                  {errors.items?.[index]?.description && (
                    <p className="mt-1 text-xs text-red-500">
                      {
                        errors.items[index]?.description
                          ?.message
                      }
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-[#6B5A4A]">
                    Price
                  </label>

                  <input
                    type="number"
                    min={0}
                    {...register(
                      `items.${index}.unitPrice`,
                      {
                        valueAsNumber: true,
                      }
                    )}
                    placeholder="0"
                    className="w-full rounded-md border border-[#D9C7A3] px-3 py-2 text-sm outline-none focus:border-[#8B5E3C]"
                  />

                  {errors.items?.[index]?.unitPrice && (
                    <p className="mt-1 text-xs text-red-500">
                      {
                        errors.items[index]?.unitPrice
                          ?.message
                      }
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-[#6B5A4A]">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min={1}
                    {...register(
                      `items.${index}.quantity`,
                      {
                        valueAsNumber: true,
                      }
                    )}
                    className="w-full rounded-md border border-[#D9C7A3] px-3 py-2 text-sm outline-none focus:border-[#8B5E3C]"
                  />

                  {errors.items?.[index]?.quantity && (
                    <p className="mt-1 text-xs text-red-500">
                      {
                        errors.items[index]?.quantity
                          ?.message
                      }
                    </p>
                  )}
                </div>

                {/* Value */}
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-[#6B5A4A]">
                    Value
                  </label>

                  <div className="flex h- 9.5 items-center rounded-md border border-[#E5DDD5] bg-[#F8F6F2] px-3 text-sm font-medium text-[#3F332A]">
                    {formatCurrency(value)}
                  </div>
                </div>

                {/* Remove */}
                <div className="flex items-end md:col-span-2">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="w-full rounded-md border border-red-200 px-3 py-2 text-xs text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {errors.items?.root?.message && (
        <p className="text-xs text-red-500">
          {errors.items.root.message}
        </p>
      )}
    </div>
  );
};

export default QuotationItems;