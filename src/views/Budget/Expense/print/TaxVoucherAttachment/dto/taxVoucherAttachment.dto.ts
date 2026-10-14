export type TaxpayerEntityTypeDto = "JURISTIC_PERSON" | "INDIVIDUAL";

export interface GovernmentAgencyDto {
    name: string;
    address: string;
    postalCode?: string;
    telephone?: string;
    fax?: string;
}

export interface TaxVoucherAttachmentItemDto {
    id: string;
    sequence: number;
    taxId: string;
    branchNo?: string;
    vendorName: string;
    vendorAddress?: string;
    incomeType?: string;
    voucherAmount: number;
    vatAmount: number;
    goodsServiceAmount: number;
    withholdingTaxAmount: number;
    penaltyAmount?: number;
    netAmount: number;
}

export interface TaxVoucherAttachmentResponseDto {
    id: string;
    formCode: string;
    taxpayerEntityType: TaxpayerEntityTypeDto;
    receiptNo?: string;
    paymentRequestNo?: string;
    month: string;
    buddhistYear: number;
    agency: GovernmentAgencyDto;
    items: TaxVoucherAttachmentItemDto[];
    totals: {
        voucherAmount: number;
        vatAmount: number;
        goodsServiceAmount: number;
        withholdingTaxAmount: number;
        penaltyAmount: number;
        netAmount: number;
    };
    signer?: {
        name?: string;
        position?: string;
    };
    status?: "DRAFT" | "APPROVED" | "PRINTED" | "CANCELLED";
}
