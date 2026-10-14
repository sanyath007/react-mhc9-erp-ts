import type { TaxVoucherAttachmentViewModel } from "../../views/Budget/Expense/print/TaxVoucherAttachment/models/taxVoucherAttachment.viewmodel";

interface Props {
    data: TaxVoucherAttachmentViewModel;
}

export function AttachmentHeader({ data }: Props) {
    const isJuristic = data.taxpayerEntityType === "JURISTIC_PERSON";
    const isIndividual = data.taxpayerEntityType === "INDIVIDUAL";

    return (
        <header className="mt-8">
            {/* Form code */}
            <div className="flex justify-end">
                <div className="text-[14pt]">
                    แบบ {data.formCode}
                </div>
            </div>

            {/* Main title */}
            <h1 className="mt-[-2mm] text-center text-[18pt] font-semibold">
                แบบแนบฎีกาแสดงรายการเสียภาษี
            </h1>

            {/* Taxpayer type + CGD */}
            <div className="relative mt-[3mm] grid grid-cols-[20%_50%_25%] gap-x-4 text-[16pt]">
                {/* Left */}
                <div></div>
                {/* Center */}
                <div className="space-y-1">
                    <div className="flex justify-center">
                        <span className="mr-2">สำหรับ</span>
                        <div className="flex flex-col items-start gap-2">
                            <div className="flex items-center gap-2">
                                <Checkbox checked={isJuristic} />
                                <span>บริษัท ห้างหุ้นส่วนนิติบุคคล</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox checked={isIndividual} />
                                <span>บุคคลธรรมดา</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="absolute right-[0mm] top-[-5mm] w-[55mm] border">
                    <div className="text-center border-b">
                        สำหรับกรมบัญชีกลาง
                    </div>
                    <div className="flex items-end justify-center border-b px-2">
                        <span className="whitespace-nowrap">เลขที่รับ</span>
                    </div>
                    <div className="flex items-end">
                        &nbsp;
                    </div>
                </div>
            </div>

            {/* Payment request */}
            <div className="mt-[3mm] flex items-end justify-center gap-2 text-[16pt]">
                <span>เลขที่ขอเบิก</span>
                <UnderlineValue value={data.paymentRequestNo} className="w-[20mm]" />/
                <UnderlineValue value={"2569"} className="w-[18mm]" />

                <span className="ml-4">เดือน</span>
                <UnderlineValue value={data.month} className="w-[28mm]" />

                <span>พ.ศ.</span>
                <UnderlineValue value={data.buddhistYearText} className="w-[18mm]" />
            </div>

            {/* Agency */}
            <div className="mt-[3mm] flex flex-col items-center justify-center text-[16pt]">
                <div>
                    ที่ตั้งส่วนราชการ{" "}
                    <span className="font-medium">{data.agency.name}</span>
                    <span className="ml-2">{data.agency.address}</span>
                </div>

                <div className="flex gap-5">
                    {data.agency.postalCode && (
                        <span>รหัสไปรษณีย์{" "}{data.agency.postalCode}</span>
                    )}

                    {data.agency.telephone && (
                        <span>โทรศัพท์{" "}{data.agency.telephone}</span>
                    )}

                    {data.agency.fax && (
                        <span>โทรสาร{" "}{data.agency.fax}</span>
                    )}
                </div>
            </div>
        </header >
    );
}

interface CheckboxProps {
    checked: boolean;
}

function Checkbox({ checked }: CheckboxProps) {
    return (
        <span className="inline-flex h-[4mm] w-[4mm] items-center justify-center border border-black text-[12px] leading-none">
            {checked ? "✓" : ""}
        </span>
    );
}

interface UnderlineValueProps {
    value?: string;
    className?: string;
}

function UnderlineValue({ value, className = "" }: UnderlineValueProps) {
    return (
        <span className={`inline-block border-b border-dotted border-black px-2 text-center ${className}`}>
            {value || "\u00A0"}
        </span>
    );
}