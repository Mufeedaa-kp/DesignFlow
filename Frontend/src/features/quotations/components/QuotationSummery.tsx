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
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="mb-4 text-sm font-semibold text-charcoal">
        Quotation Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">
            Subtotal
          </span>

          <span className="font-medium text-charcoal">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted">
            Discount
          </span>

          <span className="font-medium text-charcoal">
            - {formatCurrency(discount)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted">
            Tax
          </span>

          <span className="font-medium text-charcoal">
            {formatCurrency(tax)}
          </span>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-charcoal">
              Total
            </span>

            <span className="text-base font-semibold text-clay">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationSummery;