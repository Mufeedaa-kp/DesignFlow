import mongoose, {
  Document,
  Schema,
  Types,
} from "mongoose";

export interface IQuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IQuotation extends Document {
  project: Types.ObjectId;
  client: Types.ObjectId;
  designer: Types.ObjectId;

  items: IQuotationItem[];

  subtotal: number;
  discount: number;
  tax: number;
  total: number;

  notes?: string;

  // Signatures
  designerSignature?: string;
  designerSignedAt?: Date;

  adminSignature?: string;
  adminSignedAt?: Date;

  clientSignature?: string;
  clientSignedAt?: Date;

  status:
    | "draft"
    | "pending_admin_approval"
    | "admin_rejected"
    | "sent"
    | "client_accepted"
    | "client_rejected"
    | "expired";

  adminRejectionReason?: string | null;
  clientRejectionReason?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

const quotationItemSchema =
  new Schema<IQuotationItem>(
    {
      description: {
        type: String,
        required: true,
        trim: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      total: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    { _id: false }
  );

const quotationSchema =
  new Schema<IQuotation>(
    {
      project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        unique: true,
      },

      client: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      designer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      items: {
        type: [quotationItemSchema],
        required: true,
        validate: {
          validator: (items: IQuotationItem[]) =>
            items.length > 0,
          message:
            "Quotation must contain at least one item",
        },
      },

      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },

      discount: {
        type: Number,
        default: 0,
        min: 0,
      },

      tax: {
        type: Number,
        default: 0,
        min: 0,
      },

      total: {
        type: Number,
        required: true,
        min: 0,
      },

      notes: {
        type: String,
        trim: true,
        maxlength: 2000,
      },

      // Designer signature
      designerSignature: {
        type: String,
        default: undefined,
      },

      designerSignedAt: {
        type: Date,
        default: undefined,
      },

      // Admin signature
      adminSignature: {
        type: String,
        default: undefined,
      },

      adminSignedAt: {
        type: Date,
        default: undefined,
      },

      // Client signature
      clientSignature: {
        type: String,
        default: undefined,
      },

      clientSignedAt: {
        type: Date,
        default: undefined,
      },

      status: {
        type: String,
        enum: [
          "draft",
          "pending_admin_approval",
          "admin_rejected",
          "sent",
          "client_accepted",
          "client_rejected",
          "expired",
        ],
        default: "draft",
      },

      adminRejectionReason: {
        type: String,
        trim: true,
        default: null,
      },

      clientRejectionReason: {
        type: String,
        trim: true,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

export const Quotation =
  mongoose.model<IQuotation>(
    "Quotation",
    quotationSchema
  );