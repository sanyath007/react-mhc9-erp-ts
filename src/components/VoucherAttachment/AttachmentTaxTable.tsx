import type { TaxVoucherAttachmentItem } from "../../types";
import { formatMoney } from "../../utils/currencyText";

interface Props {
    items: TaxVoucherAttachmentItem[];

    totals: {
        voucherAmount: number;
        vatAmount: number;
        goodsServiceAmount: number;
        withholdingTaxAmount: number;
        penaltyAmount: number;
        netAmount: number;
    };
}

export function AttachmentTaxTable({ items, totals }: Props) {
    return (
        <section className="mt-[5mm]">
            <table
                className="
          w-full
          table-fixed
          border-collapse
          text-[10px]
          leading-[1.25]
        "
            >
                <thead>
                    {/* Header row 1 */}
                    <tr>
                        <HeaderCell
                            rowSpan={2}
                            className="w-[7mm]"
                        >
                            ลำดับ
                            <br />
                            ที่
                        </HeaderCell>

                        <HeaderCell
                            rowSpan={2}
                            className="w-[52mm]"
                        >
                            เลขประจำตัว
                            ผู้เสียภาษีอากร
                            <br />
                            ชื่อและที่อยู่
                            ของผู้ประกอบการ
                        </HeaderCell>

                        <HeaderCell
                            rowSpan={2}
                            className="w-[14mm]"
                        >
                            สาขาที่
                        </HeaderCell>

                        <HeaderCell
                            rowSpan={2}
                            className="w-[29mm]"
                        >
                            ประเภทเงินได้
                            <br />
                            พึงประเมิน
                        </HeaderCell>

                        <HeaderCell
                            rowSpan={2}
                            className="w-[25mm]"
                        >
                            จำนวนเงินที่
                            <br />
                            เบิกตามฎีกา
                        </HeaderCell>

                        <HeaderCell
                            rowSpan={2}
                            className="w-[23mm]"
                        >
                            ภาษีมูลค่าเพิ่ม
                        </HeaderCell>

                        <HeaderCell
                            rowSpan={2}
                            className="w-[27mm]"
                        >
                            มูลค่าสินค้า
                            <br />
                            หรือบริการ
                        </HeaderCell>

                        <HeaderCell colSpan={2}>
                            เงินหักผลักส่ง
                        </HeaderCell>

                        <HeaderCell
                            rowSpan={2}
                            className="w-[25mm]"
                        >
                            จำนวนเงิน
                            <br />
                            ขอรับ
                        </HeaderCell>
                    </tr>

                    {/* Header row 2 */}
                    <tr>
                        <HeaderCell className="w-[22mm]">
                            ภาษีเงินได้
                        </HeaderCell>

                        <HeaderCell className="w-[18mm]">
                            ค่าปรับ
                        </HeaderCell>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item) => (
                        <tr
                            key={item.id}
                            className="min-h-[13mm]"
                        >
                            <BodyCell align="center">
                                {item.sequence}
                            </BodyCell>

                            <BodyCell>
                                <div>
                                    {item.taxId}
                                </div>

                                <div className="font-medium">
                                    {item.vendorName}
                                </div>

                                {item.vendorAddress && (
                                    <div>
                                        {item.vendorAddress}
                                    </div>
                                )}
                            </BodyCell>

                            <BodyCell align="center">
                                {item.branchNo ?? ""}
                            </BodyCell>

                            <BodyCell>
                                {item.incomeType}
                            </BodyCell>

                            <MoneyCell
                                value={item.voucherAmount}
                            />

                            <MoneyCell
                                value={item.vatAmount}
                            />

                            <MoneyCell
                                value={
                                    item.goodsServiceAmount
                                }
                            />

                            <MoneyCell
                                value={
                                    item.withholdingTaxAmount
                                }
                            />

                            <MoneyCell
                                value={
                                    item.penaltyAmount
                                }
                                hideZero
                            />

                            <MoneyCell
                                value={item.netAmount}
                            />
                        </tr>
                    ))}

                    {/* Total */}
                    <tr className="font-medium">
                        <td
                            colSpan={4}
                            className="
                border
                border-black
                px-2
                py-1.5
                text-right
              "
                        >
                            รวม
                        </td>

                        <MoneyCell
                            value={
                                totals.voucherAmount
                            }
                        />

                        <MoneyCell
                            value={totals.vatAmount}
                        />

                        <MoneyCell
                            value={
                                totals.goodsServiceAmount
                            }
                        />

                        <MoneyCell
                            value={
                                totals.withholdingTaxAmount
                            }
                        />

                        <MoneyCell
                            value={
                                totals.penaltyAmount
                            }
                            hideZero
                        />

                        <MoneyCell
                            value={totals.netAmount}
                        />
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
        <th
            rowSpan={rowSpan}
            colSpan={colSpan}
            className={`
        border
        border-black
        px-1
        py-1.5
        text-center
        align-middle
        font-normal
        ${className}
      `}
        >
            {children}
        </th>
    );
}

interface BodyCellProps {
    children?: React.ReactNode;
    align?: "left" | "center" | "right";
}

function BodyCell({
    children,
    align = "left",
}: BodyCellProps) {
    return (
        <td
            className={`
        border
        border-black
        px-1.5
        py-1.5
        align-top
        ${align === "center"
                    ? "text-center"
                    : align === "right"
                        ? "text-right"
                        : "text-left"
                }
      `}
        >
            {children}
        </td>
    );
}

interface MoneyCellProps {
    value?: number;
    hideZero?: boolean;
}

function MoneyCell({ value, hideZero = false }: MoneyCellProps) {
    const displayValue = hideZero && (!value || value === 0) ? "" : formatMoney(value ?? 0);
    return (
        <td className="border border-black px-1.5 py-1.5 text-right align-top tabular-nums whitespace-nowrap">
            {displayValue}
        </td>
    );
}