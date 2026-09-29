import type {
    WithholdingTaxCertificate as WithholdingTaxCertificateModel,
} from "../../types";

import { CertificateNotes } from "./CertificateNotes";
import { SignatureSection } from "./SignatureSection";
import { TaxpayerSection } from "./TaxpayerSection";
import { TaxTable } from "./TaxTable";

interface WithholdingTaxCertificateProps {
    data: WithholdingTaxCertificateModel;
}

export function WithholdingTaxCertificate({
    data,
}: WithholdingTaxCertificateProps) {
    return (
        <article
            id="withholding-tax-print-area"
            className="
        print-document
        mx-auto
        min-h-[297mm]
        w-[210mm]
        bg-white
        px-[15mm]
        py-[12mm]
        font-sarabun
        text-[14px]
        leading-[1.6]
        text-black
        shadow-xl
      "
        >
            <header className="mb-[6mm]">
                <h1
                    className="
            text-center
            text-[18px]
            font-semibold
          "
                >
                    หนังสือรับรองการหักภาษี ณ ที่จ่าย
                </h1>
            </header>

            <TaxpayerSection
                payer={data.payer}
                payee={data.payee}
                paymentDocument={
                    data.paymentDocument
                }
                contract={data.contract}
            />

            <TaxTable
                items={data.taxItems}
                totalIncome={data.totalIncome}
                totalTax={data.totalTax}
            />

            <section
                className="
          mt-[8mm]
          grid
          grid-cols-[35mm_1fr]
          items-center
          gap-3
        "
            >
                <div>
                    เงินภาษี (ตัวอักษร)
                </div>

                <div
                    className="
            border
            border-black
            px-3
            py-2
            text-center
          "
                >
                    {data.totalTaxText}
                </div>
            </section>

            <SignatureSection
                signer={data.signer}
            />

            <CertificateNotes />
        </article>
    );
}