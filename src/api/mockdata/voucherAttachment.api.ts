import type { TaxVoucherAttachment } from "../../types";

export const mockData: TaxVoucherAttachment = {
    id: "WHT-2569-000123",

    formCode: "4117",

    taxpayerEntityType:
        "INDIVIDUAL",

    receiptNo: "",

    paymentRequestNo:
        "3600001234",

    month: "กันยายน",

    buddhistYear: 2569,

    agency: {
        name:
            "ส่วนราชการ",

        address:
            "99 ถนนxxx ตำบลxxx อำเภอxxx จังหวัดนครราชสีมา",

        postalCode:
            "30000",

        telephone:
            "044 999999",

        fax:
            "044 999999",
    },

    items: [
        {
            id: "1",

            sequence: 1,

            taxId:
                "1234567890123",

            branchNo: "",

            vendorName:
                "นางสาวxxxx xxxx",

            vendorAddress: "",

            incomeType:
                "งบดำเนินงาน",

            voucherAmount:
                6000,

            vatAmount:
                392.52,

            goodsServiceAmount:
                5607.48,

            withholdingTaxAmount:
                56.07,

            penaltyAmount:
                0,

            netAmount:
                5943.93,
        },
    ],

    totals: {
        voucherAmount:
            6000,

        vatAmount:
            392.52,

        goodsServiceAmount:
            5607.48,

        withholdingTaxAmount:
            56.07,

        penaltyAmount:
            0,

        netAmount:
            5943.93,
    },

    signer: {
        name: "",
        position: "",
    },

    status: "APPROVED",
};

export async function getTaxVoucherAttachment(id: string): Promise<TaxVoucherAttachment> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
        ...mockData,
        id,
    };
}