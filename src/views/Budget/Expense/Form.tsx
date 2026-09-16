import React from 'react'

type BudgetExpenseFormProp = {
    visible?: boolean;
    onClose?: () => void;
};

type BudgetExpense = {
    id: number;
    year: number;               // ปีงบประมาณ
    budget_id: number;          // รหัสงบประมาณ
    project_id: number;         // รหัสโครงการ
    amount: number;             // จำนวนเงิน
    description: string;        // คำอธิบาย
    details: BudgetExpenseDetail[]; // รายละเอียด
}

type BudgetExpenseDetail = {
    id: number;
    budget_expense_id: number;
    mounth: number;             // เดือน
    year: number;               // ปี
    amount: number;             // จำนวนเงิน
    vat: number;                // ภาษีหัก ณ ที่จ่าย
    total: number;              // จำนวนเงินสุทธิ
    paid_to: number;            // จ่ายให้
    paid_at: Date;              // วันที่จ่าย
    paid_by: number;            // ผู้จ่าย
    source_id: string;          // แหล่งเงิน
    withdrawal_no: string;      // เลขที่ขอเบิก
    withdrawal_at: Date;        // วันที่ขอเบิก
    payment_no: string          // เลขที่ขอจ่าย
    payment_at: Date;           // วันที่ขอจ่าย
    voucher_no: string          // เลขที่ใบสำคัญ
    ref_no: string              // เลขที่อ้างอิง
    remark: string;             // หมายเหตุ
    user_id: number;            // ผู้บันทึก
}

const BudgetExpenseForm = ({ visible, onClose }: BudgetExpenseFormProp) => {
    return (
        <div>

        </div>
    )
}

export default BudgetExpenseForm