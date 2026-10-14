import { MONTH_TH_NAMES } from "../../../../../../constants/date-time";
import { formatMoney } from "../../../../../../utils/currencyText";
import type {
    TaxVoucherAttachmentResponseDto,
    TaxVoucherAttachmentItemDto,
} from "../dto/taxVoucherAttachment.dto";
import type {
    TaxVoucherAttachmentViewModel,
    TaxVoucherItemViewModel,
    TaxVoucherTotalsViewModel,
} from "../models/taxVoucherAttachment.viewmodel";

export function mapTaxVoucherItemDtoToViewModel(
    dto: TaxVoucherAttachmentItemDto
): TaxVoucherItemViewModel {
    return {
        id: dto.id,
        sequence: dto.sequence,
        taxId: dto.taxId,
        branchNo: dto.branchNo ?? "",
        vendorName: dto.vendorName,
        vendorAddress: dto.vendorAddress ?? "",
        incomeType: dto.incomeType ?? "",
        voucherAmountFormatted: formatMoney(dto.voucherAmount),
        vatAmountFormatted: formatMoney(dto.vatAmount),
        goodsServiceAmountFormatted: formatMoney(dto.goodsServiceAmount),
        withholdingTaxAmountFormatted: formatMoney(dto.withholdingTaxAmount),
        penaltyAmountFormatted: formatMoney(dto.penaltyAmount ?? 0),
        netAmountFormatted: formatMoney(dto.netAmount),
    };
}

export function mapTaxVoucherAttachmentDtoToViewModel(
    dto: TaxVoucherAttachmentResponseDto
): TaxVoucherAttachmentViewModel {
    const items = dto.items.map(mapTaxVoucherItemDtoToViewModel);

    const totals: TaxVoucherTotalsViewModel = {
        voucherAmountFormatted: formatMoney(dto.totals.voucherAmount),
        vatAmountFormatted: formatMoney(dto.totals.vatAmount),
        goodsServiceAmountFormatted: formatMoney(dto.totals.goodsServiceAmount),
        withholdingTaxAmountFormatted: formatMoney(dto.totals.withholdingTaxAmount),
        penaltyAmountFormatted: formatMoney(dto.totals.penaltyAmount),
        netAmountFormatted: formatMoney(dto.totals.netAmount),
    };

    return {
        id: dto.id,
        formCode: dto.formCode,
        taxpayerEntityType: dto.taxpayerEntityType,
        receiptNo: dto.receiptNo ?? "",
        paymentRequestNo: dto.paymentRequestNo ?? "",
        month: MONTH_TH_NAMES[Number(dto.month) - 1],
        buddhistYearText: String(dto.buddhistYear),
        agency: {
            name: dto.agency.name,
            address: dto.agency.address,
            postalCode: dto.agency.postalCode ?? "",
            telephone: dto.agency.telephone ?? "",
            fax: dto.agency.fax ?? "",
        },
        items,
        totals,
        signer: dto.signer
            ? {
                name: dto.signer.name ?? "",
                position: dto.signer.position ?? "",
            }
            : undefined,
        status: dto.status,
    };
}
