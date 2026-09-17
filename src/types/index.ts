export interface User {
    id: string | number;
    username: string;
    email: string;
    role_id?: number;
    is_new?: number;
    name?: string;
    employee?: Employee;
    permissions?: any[];
    [key: string]: any;
}

export interface Employee {
    id: number | string;
    firstname: string;
    lastname: string;
    position?: any;
    avatar_url?: string;
    [key: string]: any;
}

export interface Item {
    id: number | string;
    name: string;
    [key: string]: any;
}

export interface Supplier {
    id: number | string;
    name: string;
    [key: string]: any;
}

export interface Place {
    id: number | string;
    name: string;
    [key: string]: any;
}

export interface Department {
    id: number | string;
    name: string;
    [key: string]: any;
}

export interface Requisition {
    id: number | string;
    [key: string]: any;
}

export interface Order {
    id: number | string;
    [key: string]: any;
}

export interface Inspection {
    id: number | string;
    [key: string]: any;
}

export interface Budget {
    id: number | string;
    [key: string]: any;
}

export interface BudgetPlan {
    id: number | string;
    [key: string]: any;
}

export interface BudgetProject {
    id: number | string;
    [key: string]: any;
}

export interface BudgetActivity {
    id: number | string;
    [key: string]: any;
}

export interface BudgetAllocation {
    id: number | string;
    [key: string]: any;
}

export interface Task {
    id: number | string;
    [key: string]: any;
}

export interface Repairation {
    id: number | string;
    [key: string]: any;
}

export interface Comset {
    id: number | string;
    [key: string]: any;
}

export interface Asset {
    id: number | string;
    [key: string]: any;
}

export interface AssetCategory {
    id: number | string;
    [key: string]: any;
}

export interface AssetOwnership {
    id: number | string;
    [key: string]: any;
}

export interface AssetType {
    id: number | string;
    [key: string]: any;
}

export interface Agency {
    id: number | string;
    [key: string]: any;
}

export interface Approval {
    id: number | string;
    [key: string]: any;
}

export interface Division {
    id: number | string;
    [key: string]: any;
}

export interface Member {
    id: number | string;
    [key: string]: any;
}

export interface Project {
    id: number | string;
    [key: string]: any;
}

export interface Room {
    id: number | string;
    [key: string]: any;
}

export interface Unit {
    id: number | string;
    [key: string]: any;
}

export interface Loan {
    id: number | string;
    [key: string]: any;
}

export interface LoanContract {
    id: number | string;
    [key: string]: any;
}

export interface LoanRefund {
    id: number | string;
    [key: string]: any;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export type BudgetExpense = {
    id: number;
    year: number;               // ปีงบประมาณ
    budget_id: number;          // รหัสงบประมาณ
    expense_type_id: number;    // ประเภทค่าใช้จ่าย
    project_id: number;         // รหัสโครงการ/กิจกรรม
    unit_text: string;          // หน่วยนับ
    target: number;             // เป้าหมาย
    amount: number;             // จำนวนเงิน
    description?: string;       // คำอธิบาย
    details?: BudgetExpenseDetail[]; // รายละเอียด
}

export type BudgetExpenseDetail = {
    id: number;
    budget_expense_id: number;  // BudgetExpense ID
    mounth: number;             // เดือน (ที่จ่าย)
    year: number;               // ปี (ที่จ่าย)
    amount: number;             // จำนวนเงิน (ที่จ่าย)
    vat_rate: number;           // อัตราภาษีหัก ณ ที่จ่าย
    vat_amount: number;         // จำนวนเงินภาษีหัก ณ ที่จ่าย
    net_total: number;          // จำนวนเงินสุทธิ (ที่จ่าย)
    paid_to: number;            // จ่ายให้ (ผู้รับ)
    paid_at: Date;              // วันที่จ่าย
    paid_by: number;            // ผู้จ่าย
    source_id: string;          // แหล่งเงินงบประมาณ
    withdrawal_no?: string;     // เลขที่ขอเบิก
    withdrawal_at?: Date;       // วันที่ขอเบิก
    payment_no?: string         // เลขที่ขอจ่าย
    payment_at?: Date;          // วันที่ขอจ่าย
    voucher_no?: string         // เลขที่ฎีกา
    ref_no?: string             // เลขที่อ้างอิง
    remark?: string;            // หมายเหตุ
    created_by: number;         // ผู้บันทึก
}