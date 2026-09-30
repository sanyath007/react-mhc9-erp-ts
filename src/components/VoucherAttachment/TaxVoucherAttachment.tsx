import { AttachmentHeader } from "./AttachmentHeader";
import { AttachmentTaxTable } from "./AttachmentTaxTable";
import { AttachmentSignature } from "./AttachmentSignature";
import type { TaxVoucherAttachment as TaxVoucherAttachmentModel } from "../../types";

interface Props {
    data: TaxVoucherAttachmentModel;
}

export function TaxVoucherAttachment({ data }: Props) {
    return (
        <article id="tax-voucher-attachment-print" className="tax-voucher-landscape mx-auto h-[210mm] w-[297mm] bg-white px-[10mm] py-[8mm] font-sarabun text-[12px] leading-[1.4] text-black shadow-xl">
            <AttachmentHeader data={data} />
            <AttachmentTaxTable items={data.items} totals={data.totals} />
            <AttachmentSignature signer={data.signer} />
        </article>
    );
}