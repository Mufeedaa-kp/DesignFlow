import puppeteer from "puppeteer";
import type { IQuotation } from "../models/quotation.model";

export interface PopulatedPerson {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface PopulatedProject {
  _id: string;
  projectName?: string;
}

export interface PopulatedQuotation
  extends Omit<IQuotation, "client" | "designer" | "project"> {
  client: PopulatedPerson;
  designer: PopulatedPerson;
  project: PopulatedProject;
}

const escapeHtml = (value: unknown): string => {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export const generateQuotationHtml = (
  quotation: PopulatedQuotation
): string => {
  const itemsHtml = quotation.items
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.description)}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.unitPrice)}</td>
          <td>${formatCurrency(item.total)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>

    <html>
      <head>
        <meta charset="UTF-8" />

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #3F332A;
            background: #ffffff;
            font-size: 12px;
          }

          .page {
            width: 100%;
            padding: 40px;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 24px;
            border-bottom: 2px solid #8B5E3C;
          }

          .brand {
            font-size: 28px;
            font-weight: 700;
            color: #8B5E3C;
            letter-spacing: 1px;
          }

          .subtitle {
            margin-top: 5px;
            color: #8A7A6B;
            font-size: 11px;
          }

          .quotation-title {
            text-align: right;
          }

          .quotation-title h1 {
            margin: 0;
            font-size: 24px;
            color: #3F332A;
          }

          .quotation-title p {
            margin: 6px 0 0;
            color: #8A7A6B;
          }

          .section {
            margin-top: 26px;
          }

          .section-title {
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 700;
            color: #8B5E3C;
          }

          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .info-box {
            border: 1px solid #D9C7A3;
            border-radius: 6px;
            padding: 14px;
          }

          .label {
            margin-bottom: 4px;
            font-size: 10px;
            color: #8A7A6B;
            text-transform: uppercase;
          }

          .value {
            font-size: 12px;
            font-weight: 600;
            color: #3F332A;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th {
            background: #F8F6F2;
            color: #3F332A;
            font-weight: 700;
            text-align: left;
          }

          th,
          td {
            padding: 10px;
            border: 1px solid #D9C7A3;
          }

          th:nth-child(1),
          td:nth-child(1) {
            width: 40px;
            text-align: center;
          }

          th:nth-child(3),
          td:nth-child(3) {
            width: 60px;
            text-align: center;
          }

          th:nth-child(4),
          th:nth-child(5),
          td:nth-child(4),
          td:nth-child(5) {
            text-align: right;
          }

          .summary {
            width: 320px;
            margin-left: auto;
            margin-top: 18px;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
          }

          .summary-total {
            margin-top: 8px;
            padding-top: 10px;
            border-top: 2px solid #8B5E3C;
            font-size: 15px;
            font-weight: 700;
            color: #8B5E3C;
          }

          .notes {
            border: 1px solid #D9C7A3;
            border-radius: 6px;
            padding: 14px;
            min-height: 70px;
          }

          .signatures {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-top: 40px;
          }

          .signature-box {
            min-height: 130px;
            border-top: 1px solid #8A7A6B;
            padding-top: 8px;
          }

          .signature-image {
            width: 100%;
            height: 65px;
            object-fit: contain;
            object-position: left bottom;
            margin-bottom: 5px;
          }

          .signature-label {
            font-size: 11px;
            font-weight: 700;
          }

          .signature-date {
            margin-top: 3px;
            font-size: 9px;
            color: #8A7A6B;
          }

          .footer {
            margin-top: 40px;
            padding-top: 12px;
            border-top: 1px solid #D9C7A3;
            text-align: center;
            color: #8A7A6B;
            font-size: 9px;
          }
        </style>
      </head>

      <body>
        <div class="page">

          <div class="header">
            <div>
              <div class="brand">DESIGN FLOW</div>

              <div class="subtitle">
                Interior Design Management
              </div>
            </div>

            <div class="quotation-title">
              <h1>QUOTATION</h1>

              <p>
                Date: ${formatDate(quotation.createdAt)}
              </p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              Quotation Information
            </div>

            <div class="info-grid">

              <div class="info-box">
                <div class="label">
                  Client
                </div>

                <div class="value">
                  ${escapeHtml(quotation.client.fullName)}
                </div>

                <div>
                  ${escapeHtml(quotation.client.email)}
                </div>

                ${
                  quotation.client.phone
                    ? `<div>${escapeHtml(
                        quotation.client.phone
                      )}</div>`
                    : ""
                }
              </div>

              <div class="info-box">
                <div class="label">
                  Designer
                </div>

                <div class="value">
                  ${escapeHtml(
                    quotation.designer.fullName
                  )}
                </div>

                <div>
                  ${escapeHtml(
                    quotation.designer.email
                  )}
                </div>
              </div>

              <div class="info-box">
                <div class="label">
                  Project
                </div>

                <div class="value">
                  ${escapeHtml(
                    quotation.project.projectName ||
                      "Interior Design Project"
                  )}
                </div>
              </div>

              <div class="info-box">
                <div class="label">
                  Status
                </div>

                <div class="value">
                  Client Accepted
                </div>
              </div>

            </div>
          </div>

          <div class="section">
            <div class="section-title">
              Quotation Items
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <div class="summary">

            <div class="summary-row">
              <span>Subtotal</span>

              <span>
                ${formatCurrency(quotation.subtotal)}
              </span>
            </div>

            <div class="summary-row">
              <span>Discount</span>

              <span>
                -${formatCurrency(quotation.discount)}
              </span>
            </div>

            <div class="summary-row">
              <span>Tax</span>

              <span>
                ${formatCurrency(quotation.tax)}
              </span>
            </div>

            <div class="summary-row summary-total">
              <span>Total</span>

              <span>
                ${formatCurrency(quotation.total)}
              </span>
            </div>

          </div>

          ${
            quotation.notes
              ? `
                <div class="section">
                  <div class="section-title">
                    Notes
                  </div>

                  <div class="notes">
                    ${escapeHtml(quotation.notes)}
                  </div>
                </div>
              `
              : ""
          }

          <div class="section">

            <div class="section-title">
              Signatures
            </div>

            <div class="signatures">

              <div class="signature-box">

                ${
                  quotation.designerSignature
                    ? `
                      <img
                        class="signature-image"
                        src="${quotation.designerSignature}"
                      />
                    `
                    : ""
                }

                <div class="signature-label">
                  Designer
                </div>

                ${
                  quotation.designerSignedAt
                    ? `
                      <div class="signature-date">
                        Signed:
                        ${formatDate(
                          quotation.designerSignedAt
                        )}
                      </div>
                    `
                    : ""
                }

              </div>

              <div class="signature-box">

                ${
                  quotation.adminSignature
                    ? `
                      <img
                        class="signature-image"
                        src="${quotation.adminSignature}"
                      />
                    `
                    : ""
                }

                <div class="signature-label">
                  Admin
                </div>

                ${
                  quotation.adminSignedAt
                    ? `
                      <div class="signature-date">
                        Signed:
                        ${formatDate(
                          quotation.adminSignedAt
                        )}
                      </div>
                    `
                    : ""
                }

              </div>

              <div class="signature-box">

                ${
                  quotation.clientSignature
                    ? `
                      <img
                        class="signature-image"
                        src="${quotation.clientSignature}"
                      />
                    `
                    : ""
                }

                <div class="signature-label">
                  Client
                </div>

                ${
                  quotation.clientSignedAt
                    ? `
                      <div class="signature-date">
                        Signed:
                        ${formatDate(
                          quotation.clientSignedAt
                        )}
                      </div>
                    `
                    : ""
                }

              </div>

            </div>

          </div>

          <div class="footer">
            This quotation was generated by Design Flow.
          </div>

        </div>
      </body>
    </html>
  `;
};

export const generateQuotationPdf = async (
  quotation: PopulatedQuotation
): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    const html = generateQuotationHtml(quotation);

    await page.setContent(html, {
      waitUntil: "load",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
};