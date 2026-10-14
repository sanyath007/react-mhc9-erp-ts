export interface TaxItemViewModel {
    id: string;
    taxType: string;
    taxTypeLabel: string;
    incomeType: string;
    paymentDateFormatted: string;
    amountFormatted: string;
    taxAmountFormatted: string;
    rawAmount: number;
    rawTaxAmount: number;
}

export interface WithholdingTaxViewModel {
    id: string;
    certificateNo: string;
    fiscalYearText: string;
    payer: {
        organizationName: string;
        taxId: string;
        address: string;
    };
    paymentDocument: {
        documentNo: string;
        documentDateFormatted: string;
    };
    contract?: {
        contractNo: string;
        contractDateFormatted: string;
    };
    payee: {
        name: string;
        taxId: string;
        address: string;
    };
    taxItems: TaxItemViewModel[];
    totalIncomeFormatted: string;
    totalTaxFormatted: string;
    totalTaxText: string;
    signer?: {
        name: string;
        position: string;
    };
    status?: string;
}
