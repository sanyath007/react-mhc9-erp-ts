export type TaxpayerEntityType =
    | "JURISTIC_PERSON"
    | "INDIVIDUAL";

export interface GovernmentAgency {
    name: string;
    address: string;
    postalCode?: string;
    telephone?: string;
    fax?: string;
}

export interface TaxVoucherAttachmentItem {
    id: string;

    sequence: number;

    /**
     * เลขประจำตัวผู้เสียภาษีอากร
     */
    taxId: string;

    /**
     * สาขาที่
     * เช่น 00000
     */
    branchNo?: string;

    /**
     * ชื่อผู้ประกอบการ
     */
    vendorName: string;

    /**
     * ที่อยู่ผู้ประกอบการ
     */
    vendorAddress?: string;

    /**
     * ประเภทเงินได้พึงประเมิน
     * เช่น งบดำเนินงาน
     */
    incomeType?: string;

    /**
     * จำนวนเงินที่เบิกตามฎีกา
     */
    voucherAmount: number;

    /**
     * ภาษีมูลค่าเพิ่ม
     */
    vatAmount: number;

    /**
     * มูลค่าสินค้าหรือบริการ
     */
    goodsServiceAmount: number;

    /**
     * เงินหักผลักส่ง - ภาษีเงินได้
     */
    withholdingTaxAmount: number;

    /**
     * เงินหักผลักส่ง - ค่าปรับ
     */
    penaltyAmount?: number;

    /**
     * จำนวนเงินขอรับ
     */
    netAmount: number;
}

export interface TaxVoucherAttachment {
    id: string;

    /**
     * แบบ 4117
     */
    formCode: string;

    taxpayerEntityType: TaxpayerEntityType;

    /**
     * สำหรับกรมบัญชีกลาง
     */
    receiptNo?: string;

    paymentRequestNo?: string;

    /**
     * เช่น กันยายน
     */
    month: string;

    /**
     * พ.ศ.
     */
    buddhistYear: number;

    agency: GovernmentAgency;

    items: TaxVoucherAttachmentItem[];

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

    status?:
    | "DRAFT"
    | "APPROVED"
    | "PRINTED"
    | "CANCELLED";
}