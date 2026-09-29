export type WithholdingTaxType =
    | "CORPORATE_INCOME_TAX"
    | "PERSONAL_INCOME_TAX"
    | "PENALTY"
    | "OTHER";

export interface TaxPayer {
    organizationName: string;
    taxId: string;
    address: string;
}

export interface TaxPayee {
    name: string;
    taxId: string;
}

export interface PaymentDocument {
    documentNo?: string;
    documentDate?: string;
}

export interface ContractInfo {
    contractNo?: string;
    contractDate?: string;
}

export interface TaxItem {
    id?: string;

    taxType: WithholdingTaxType;
    taxTypeLabel: string;

    incomeType?: string;
    paymentDate?: string;

    amount: number;
    taxAmount: number;
}

export interface Signer {
    name?: string;
    position?: string;
}

export interface WithholdingTaxCertificate {
    id: string;
    certificateNo?: string;

    fiscalYear?: number;

    payer: TaxPayer;

    paymentDocument: PaymentDocument;

    contract?: ContractInfo;

    payee: TaxPayee;

    taxItems: TaxItem[];

    totalIncome: number;
    totalTax: number;

    /**
     * เช่น "ห้าสิบหกบาทเจ็ดสตางค์"
     * แนะนำให้ Backend เป็นผู้สร้างค่า
     */
    totalTaxText: string;

    signer?: Signer;

    status?: "DRAFT" | "APPROVED" | "PRINTED" | "CANCELLED";
}