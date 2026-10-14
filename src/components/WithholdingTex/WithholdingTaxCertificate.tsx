import { CertificateNotes } from "./CertificateNotes";
import { SignatureSection } from "./SignatureSection";
import { TaxpayerSection } from "./TaxpayerSection";
import { TaxTable } from "./TaxTable";
import type { WithholdingTaxViewModel } from "../../views/Budget/Expense/print/WithholdingTax/models/withholdingTax.viewmodel";

interface WithholdingTaxCertificateProps {
    data: WithholdingTaxViewModel;
}

export function WithholdingTaxCertificate({ data }: WithholdingTaxCertificateProps) {
    return (
        <article
            id="withholding-tax-print-area"
            className="print-document mx-auto min-h-[297mm] w-[210mm] bg-white px-[20mm] py-[15mm] font-sarabun text-[14px] leading-[1.6] text-black shadow-xl"
        >
            <header className="mb-[6mm] mt-8">
                <h1 className="text-center text-[18pt] font-semibold">
                    หนังสือรับรองการหักภาษี ณ ที่จ่าย
                </h1>
            </header>

            <TaxpayerSection
                payer={data.payer}
                payee={data.payee}
                paymentDocument={data.paymentDocument}
                contract={data.contract}
            />

            <TaxTable
                items={data.taxItems}
                totalIncomeFormatted={data.totalIncomeFormatted}
                totalTaxFormatted={data.totalTaxFormatted}
            />

            <section className="mt-[4mm] print:mt-[4mm] grid grid-cols-[35mm_1fr] items-center gap-3 text-[16pt]">
                <div>
                    เงินภาษี (ตัวอักษร)
                </div>

                <div className="border border-black px-3 py-0.5 text-center">
                    {data.totalTaxText}
                </div>
            </section>

            <SignatureSection signer={data.signer} />

            <CertificateNotes />
        </article>
    );
}