import type {
    WithholdingTaxCertificate,
} from "../../types";

const mockData: WithholdingTaxCertificate = {
    id: "WHT-2569-000123",
    certificateNo: "WHT-2569-000123",
    fiscalYear: 2569,
    payer: {
        organizationName: "โรงพยาบาลจิตเวชนครราชสีมาราชนครินทร์",
        taxId: "0999999999999",
        address: "99 ถนนxxxxx ตำบลxxxxx อำเภอxxxxx จังหวัดนครราชสีมา",
    },
    paymentDocument: {
        documentNo: "3600001234",
        documentDate: "2026-09-29",
    },
    contract: {
        contractNo: "CN-2569-0012",
        contractDate: "2026-09-01",
    },
    payee: {
        name: "นางสาวxxxx xxxx",
        taxId: "1234567890123",
    },
    taxItems: [
        {
            id: "1",
            taxType: "CORPORATE_INCOME_TAX",
            taxTypeLabel: "ภาษีเงินได้นิติบุคคล",
            incomeType: "",
            paymentDate: "2026-09-29",
            amount: 5607.48,
            taxAmount: 56.07,
        },
    ],
    totalIncome: 5607.48,
    totalTax: 56.07,
    totalTaxText: "ห้าสิบหกบาทเจ็ดสตางค์",
    signer: {
        name: "",
        position: "",
    },
    status: "APPROVED",
};

export async function getWithholdingTaxCertificate(id: string): Promise<WithholdingTaxCertificate> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
        ...mockData,
        id,
    };
}