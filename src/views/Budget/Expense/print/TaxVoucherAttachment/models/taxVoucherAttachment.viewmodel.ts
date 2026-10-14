export interface TaxVoucherItemViewModel {
    id: string;
    sequence: number;
    taxId: string;
    branchNo: string;
    vendorName: string;
    vendorAddress: string;
    incomeType: string;
    voucherAmountFormatted: string;
    vatAmountFormatted: string;
    goodsServiceAmountFormatted: string;
    withholdingTaxAmountFormatted: string;
    penaltyAmountFormatted: string;
    netAmountFormatted: string;
}

export interface TaxVoucherTotalsViewModel {
    voucherAmountFormatted: string;
    vatAmountFormatted: string;
    goodsServiceAmountFormatted: string;
    withholdingTaxAmountFormatted: string;
    penaltyAmountFormatted: string;
    netAmountFormatted: string;
}

export interface TaxVoucherAttachmentViewModel {
    id: string;
    formCode: string;
    taxpayerEntityType: "JURISTIC_PERSON" | "INDIVIDUAL";
    receiptNo: string;
    paymentRequestNo: string;
    month: string;
    buddhistYearText: string;
    agency: {
        name: string;
        address: string;
        postalCode: string;
        telephone: string;
        fax: string;
    };
    items: TaxVoucherItemViewModel[];
    totals: TaxVoucherTotalsViewModel;
    signer?: {
        name: string;
        position: string;
    };
    status?: string;
}
