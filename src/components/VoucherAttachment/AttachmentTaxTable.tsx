import type { TaxVoucherItemViewModel, TaxVoucherTotalsViewModel } from "../../views/Budget/Expense/print/TaxVoucherAttachment/models/taxVoucherAttachment.viewmodel";

interface Props {
    items: TaxVoucherItemViewModel[];
    totals: TaxVoucherTotalsViewModel;
}

export function AttachmentTaxTable({ items, totals }: Props) {
    return (
        <section className="mt-[5mm]">
            <table className="w-full table-fixed border-collapse text-[16pt] leading-[1.25]">
                <thead>
                    {/* Header row 1 */}
                    <tr>
                        <HeaderCell rowSpan={2} className="w-[12mm]">ลำดับ<br />ที่</HeaderCell>
                        <HeaderCell rowSpan={2} className="w-[52mm]">เลขประจำตัวผู้เสียภาษีอากร<br />ชื่อและที่อยู่ของผู้ประกอบการ</HeaderCell>
                        <HeaderCell rowSpan={2} className="w-[14mm]">สาขาที่</HeaderCell>
                        <HeaderCell rowSpan={2} className="w-[29mm]">ประเภทเงินได้<br />พึงประเมิน</HeaderCell>
                        <HeaderCell rowSpan={2} className="w-[25mm]">จำนวนเงินที่<br />เบิกตามฎีกา</HeaderCell>
                        <HeaderCell rowSpan={2} className="w-[23mm]">ภาษีมูลค่าเพิ่ม</HeaderCell>
                        <HeaderCell rowSpan={2} className="w-[27mm]">มูลค่าสินค้า<br />หรือบริการ</HeaderCell>
                        <HeaderCell colSpan={2}>เงินหักผลักส่ง</HeaderCell>
                        <HeaderCell rowSpan={2} className="w-[25mm]">จำนวนเงิน<br />ขอรับ</HeaderCell>
                    </tr>

                    {/* Header row 2 */}
                    <tr>
                        <HeaderCell className="w-[22mm]">ภาษีเงินได้</HeaderCell>
                        <HeaderCell className="w-[18mm]">ค่าปรับ</HeaderCell>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className="min-h-[13mm]">
                            <BodyCell align="center">{item.sequence}</BodyCell>
                            <BodyCell>
                                <div>{item.taxId}</div>
                                <div className="font-medium">{item.vendorName}</div>
                                {item.vendorAddress && <div>{item.vendorAddress}</div>}
                            </BodyCell>
                            <BodyCell align="center">{item.branchNo}</BodyCell>
                            <BodyCell>{item.incomeType}</BodyCell>
                            <MoneyCell value={item.voucherAmountFormatted} />
                            <MoneyCell value={item.vatAmountFormatted} />
                            <MoneyCell value={item.goodsServiceAmountFormatted} />
                            <MoneyCell value={item.withholdingTaxAmountFormatted} />
                            <MoneyCell value={item.penaltyAmountFormatted} />
                            <MoneyCell value={item.netAmountFormatted} />
                        </tr>
                    ))}

                    {/* Total */}
                    <tr className="font-medium">
                        <td colSpan={4} className="border border-black px-2 py-1.5 text-right">รวม</td>
                        <MoneyCell value={totals.voucherAmountFormatted} />
                        <MoneyCell value={totals.vatAmountFormatted} />
                        <MoneyCell value={totals.goodsServiceAmountFormatted} />
                        <MoneyCell value={totals.withholdingTaxAmountFormatted} />
                        <MoneyCell value={totals.penaltyAmountFormatted} />
                        <MoneyCell value={totals.netAmountFormatted} />
                    </tr>
                </tbody>
            </table>
        </section>
    );
}

interface HeaderCellProps {
    children: React.ReactNode;
    rowSpan?: number;
    colSpan?: number;
    className?: string;
}

function HeaderCell({
    children,
    rowSpan,
    colSpan,
    className = "",
}: HeaderCellProps) {
    return (
        <th rowSpan={rowSpan} colSpan={colSpan} className={`border border-black px-1 py-1.5 text-center align-middle font-normal ${className}`}>
            {children}
        </th>
    );
}

interface BodyCellProps {
    children?: React.ReactNode;
    align?: "left" | "center" | "right";
}

function BodyCell({ children, align = "left" }: BodyCellProps) {
    return (
        <td className={`border border-black px-1.5 py-1.5 align-top ${align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"}`}>
            {children}
        </td>
    );
}

interface MoneyCellProps {
    value?: string;
}

function MoneyCell({ value }: MoneyCellProps) {
    return (
        <td className="border border-black px-1.5 py-1.5 text-right align-top tabular-nums whitespace-nowrap">
            {value || ""}
        </td>
    );
}