import { ArabicNumberToText, formatMoney } from "../../../../../../utils/currencyText";
import { formatThaiDate } from "../../../../../../utils/date-time";
import type { WithholdingTaxCertificateResponseDto, TaxItemDto } from "../dto/withholdingTax.dto";
import type { WithholdingTaxViewModel, TaxItemViewModel } from "../models/withholdingTax.viewmodel";

export function mapTaxItemDtoToViewModel(dto: TaxItemDto): TaxItemViewModel {
    return {
        id: dto.id ?? "",
        taxType: dto.tax_type,
        taxTypeLabel: dto.tax_type_label || getTaxTypeDefaultLabel(dto.tax_type),
        incomeType: dto.income_type ?? "",
        paymentDateFormatted: formatThaiDate(dto.payment_date),
        amountFormatted: formatMoney(dto.amount),
        taxAmountFormatted: formatMoney(dto.tax_amount),
        rawAmount: dto.amount,
        rawTaxAmount: dto.tax_amount,
    };
}

function getTaxTypeDefaultLabel(taxType: string): string {
    switch (taxType) {
        case "CORPORATE_INCOME_TAX":
            return "ภาษีเงินได้นิติบุคคล";
        case "PERSONAL_INCOME_TAX":
            return "ภาษีเงินได้บุคคลธรรมดา";
        case "PENALTY":
            return "ค่าปรับ";
        default:
            return "ภาษีอื่นๆ";
    }
}

export function mapWithholdingTaxDtoToViewModel(
    dto: WithholdingTaxCertificateResponseDto
): WithholdingTaxViewModel {
    const totalTaxText = dto.total_tax_text || ArabicNumberToText(dto?.total_tax ?? 0);
    console.log(dto);

    return {
        id: dto.id,
        certificateNo: dto.certificate_no ?? dto.id,
        fiscalYearText: dto.fiscal_year ? String(dto.fiscal_year) : "",
        payer: {
            organizationName: dto.payer.name,
            taxId: dto.payer.tax_id,
            address: dto.payer.address,
        },
        paymentDocument: {
            documentNo: dto.payment_document?.document_no ?? "-",
            documentDateFormatted: formatThaiDate(dto.payment_document?.document_date),
        },
        contract: dto.contract
            ? {
                contractNo: dto.contract.contract_no ?? "-",
                contractDateFormatted: formatThaiDate(dto.contract.contract_date),
            }
            : undefined,
        payee: {
            name: dto.payee.name,
            taxId: dto.payee.tax_id,
            address: dto.payee.address,
        },
        taxItems: (dto.tax_items ?? []).map(mapTaxItemDtoToViewModel),
        totalIncomeFormatted: formatMoney(dto.total_income),
        totalTaxFormatted: formatMoney(dto.total_tax),
        totalTaxText,
        signer: dto.signer
            ? {
                name: dto.signer.name ?? "",
                position: dto.signer.position ?? "",
            }
            : undefined,
        status: dto.status,
    };
}
