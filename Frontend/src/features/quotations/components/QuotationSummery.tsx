interface QuotationSummeryProps {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

const formatCurrency = (value: number) => {
  return `₹${value.toLocaleString("en-IN")}`;
};

const QuotationSummery = ({
  subtotal,
  discount,
  tax,
  total,
}: QuotationSummeryProps) => {
  return (
    <div className="rounded-lg border border-[#E5DDD5] bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold text-[#3F332A]">
        Quotation Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#6B5A4A]">
            Subtotal
          </span>

          <span className="font-medium text-[#3F332A]">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#6B5A4A]">
            Discount
          </span>

          <span className="font-medium text-[#3F332A]">
            - {formatCurrency(discount)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#6B5A4A]">
            Tax
          </span>

          <span className="font-medium text-[#3F332A]">
            {formatCurrency(tax)}
          </span>
        </div>

        <div className="border-t border-[#E5DDD5] pt-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#3F332A]">
              Total
            </span>

            <span className="text-base font-semibold text-[#8B5E3C]">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationSummery;