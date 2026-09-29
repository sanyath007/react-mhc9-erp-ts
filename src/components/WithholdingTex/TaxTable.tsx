import type {
    TaxItem,
    WithholdingTaxType,
} from "../../types";

import { formatMoney } from "../../utils/currencyText";
import { formatThaiDate } from "../../utils/date-time";

interface TaxTableProps {
    items: TaxItem[];
    totalIncome: number;
    totalTax: number;
}

interface TaxRow {
    taxType: WithholdingTaxType;
    label: string;
}

const defaultRows: TaxRow[] = [
    {
        taxType: "CORPORATE_INCOME_TAX",
        label: "ภาษีเงินได้นิติบุคคล",
    },
    {
        taxType: "PERSONAL_INCOME_TAX",
        label: "ภาษีเงินได้บุคคลธรรมดา",
    },
    {
        taxType: "PENALTY",
        label: "ค่าปรับ",
    },
];

export function TaxTable({
    items,
    totalIncome,
    totalTax,
}: TaxTableProps) {
    return (
        <section className="mt-[18mm]">
            <table className="w-full table-fixed border-collapse">
                <thead>
                    <tr>
                        <TableHeader className="w-[26%]">
                            ประเภทภาษี
                        </TableHeader>

                        <TableHeader className="w-[15%]">
                            ประเภท
                            <br />
                            เงินได้ที่จ่าย
                        </TableHeader>

                        <TableHeader className="w-[20%]">
                            วันเดือนปีที่จ่าย
                        </TableHeader>

                        <TableHeader className="w-[21%]">
                            จำนวนเงินที่ได้
                        </TableHeader>

                        <TableHeader className="w-[18%]">
                            ภาษี
                        </TableHeader>
                    </tr>
                </thead>

                <tbody>
                    {defaultRows.map((row) => {
                        const item = items.find(
                            (currentItem) =>
                                currentItem.taxType === row.taxType
                        );

                        return (
                            <tr
                                key={row.taxType}
                                className="h-[11mm]"
                            >
                                <TableCell>
                                    {item?.taxTypeLabel ||
                                        row.label}
                                </TableCell>

                                <TableCell align="center">
                                    {item?.incomeType ?? ""}
                                </TableCell>

                                <TableCell align="center">
                                    {formatThaiDate(
                                        item?.paymentDate
                                    )}
                                </TableCell>

                                <TableCell align="right">
                                    {item
                                        ? formatMoney(item.amount)
                                        : ""}
                                </TableCell>

                                <TableCell align="right">
                                    {item
                                        ? formatMoney(
                                            item.taxAmount
                                        )
                                        : ""}
                                </TableCell>
                            </tr>
                        );
                    })}

                    <tr className="h-[10mm]">
                        <td
                            colSpan={3}
                            className="
                border
                border-black
                px-2
                text-right
              "
                        >
                            รวม
                        </td>

                        <TableCell
                            align="right"
                            className="font-medium"
                        >
                            {formatMoney(totalIncome)}
                        </TableCell>

                        <TableCell
                            align="right"
                            className="font-medium"
                        >
                            {formatMoney(totalTax)}
                        </TableCell>
                    </tr>
                </tbody>
            </table>
        </section>
    );
}

interface TableHeaderProps {
    children: React.ReactNode;
    className?: string;
}

function TableHeader({
    children,
    className = "",
}: TableHeaderProps) {
    return (
        <th
            className={`
        border
        border-black
        px-2
        py-2
        text-center
        font-normal
        ${className}
      `}
        >
            {children}
        </th>
    );
}

interface TableCellProps {
    children?: React.ReactNode;
    align?: "left" | "center" | "right";
    className?: string;
}

function TableCell({
    children,
    align = "left",
    className = "",
}: TableCellProps) {
    const alignClass = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    }[align];

    return (
        <td
            className={`
        border
        border-black
        px-2
        py-1
        tabular-nums
        ${alignClass}
        ${className}
      `}
        >
            {children}
        </td>
    );
}