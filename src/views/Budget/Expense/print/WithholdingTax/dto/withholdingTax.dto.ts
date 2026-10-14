export type WithholdingTaxTypeDto =
    | "CORPORATE_INCOME_TAX"
    | "PERSONAL_INCOME_TAX"
    | "PENALTY"
    | "OTHER";

export interface TaxPayerDto {
    name: string;
    tax_id: string;
    address: string;
}

export interface TaxPayeeDto {
    name: string;
    tax_id: string;
    address?: string;
}

export interface PaymentDocumentDto {
    document_no?: string;
    document_date?: string;
}

export interface ContractInfoDto {
    contract_no?: string;
    contract_date?: string;
}

export interface TaxItemDto {
    id?: string;
    tax_type: WithholdingTaxTypeDto;
    tax_type_label?: string;
    income_type?: string;
    payment_date?: string;
    amount: number;
    tax_amount: number;
}

export interface SignerDto {
    name?: string;
    position?: string;
}

export interface WithholdingTaxCertificateResponseDto {
    id: string;
    certificate_no?: string;
    fiscal_year?: number;
    payer: TaxPayerDto;
    payment_document?: PaymentDocumentDto;
    contract?: ContractInfoDto;
    payee: TaxPayeeDto;
    tax_items: TaxItemDto[];
    total_income: number;
    total_tax: number;
    total_tax_text?: string;
    signer?: SignerDto;
    status?: "DRAFT" | "APPROVED" | "PRINTED" | "CANCELLED";
}

export type WithholdingTaxResponseDto = WithholdingTaxCertificateResponseDto;

