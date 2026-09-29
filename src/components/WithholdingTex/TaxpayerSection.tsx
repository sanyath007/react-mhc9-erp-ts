import type {
    ContractInfo,
    PaymentDocument,
    TaxPayee,
    TaxPayer,
} from "../../types";

import { formatThaiDate } from "../../utils/date-time";

interface TaxpayerSectionProps {
    payer: TaxPayer;
    payee: TaxPayee;

    paymentDocument: PaymentDocument;
    contract?: ContractInfo;
}

export function TaxpayerSection({
    payer,
    payee,
    paymentDocument,
    contract,
}: TaxpayerSectionProps) {
    return (
        <section>
            <div className="font-semibold">
                ผู้มีหน้าที่หักภาษี ณ ที่จ่าย :
            </div>

            <div className="mt-1 flex flex-wrap gap-x-3">
                <span>
                    ส่วนราชการ
                </span>

                <span>
                    {payer.organizationName}
                </span>

                <span className="ml-auto">
                    เลขประจำตัวผู้เสียภาษีอากร{" "}
                    {payer.taxId}
                </span>
            </div>

            <div>
                ที่อยู่ {payer.address}
            </div>

            <div className="mt-1 grid grid-cols-[1fr_auto] gap-x-4">
                <div>
                    ขอรับรองว่า ได้หักภาษี ณ ที่จ่าย
                    ตามเอกสารขอเบิกเงิน เลขที่{" "}
                    <DocumentValue
                        value={paymentDocument.documentNo}
                    />
                </div>

                <div className="whitespace-nowrap">
                    ลงวันที่{" "}
                    <DocumentValue
                        value={formatThaiDate(
                            paymentDocument.documentDate
                        )}
                    />
                </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-x-4">
                <div>
                    ตามสัญญาเลขที่{" "}
                    <DocumentValue
                        value={contract?.contractNo}
                    />
                </div>

                <div className="whitespace-nowrap">
                    ลงวันที่{" "}
                    <DocumentValue
                        value={formatThaiDate(
                            contract?.contractDate
                        )}
                    />
                </div>
            </div>

            <div className="mt-2 font-semibold">
                ผู้ถูกหักภาษี ณ ที่จ่าย :
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div>
                    ชื่อ{" "}
                    <span className="font-medium">
                        {payee.name}
                    </span>
                </div>

                <div>
                    เลขประจำตัวผู้เสียภาษีอากร{" "}
                    <span className="font-medium">
                        {payee.taxId}
                    </span>
                </div>
            </div>
        </section>
    );
}

interface DocumentValueProps {
    value?: string | null;
}

function DocumentValue({
    value,
}: DocumentValueProps) {
    if (value) {
        return (
            <span className="font-medium">
                {value}
            </span>
        );
    }

    return (
        <span className="inline-block min-w-28 border-b border-dotted border-black">
            &nbsp;
        </span>
    );
}