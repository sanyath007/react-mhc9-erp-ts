export interface User {
    id: string | number;
    username: string;
    email: string;
    role_id?: number;
    // ...other user fields based on backend
}

export interface Employee {
    id: number | string;
    firstname: string;
    lastname: string;
    position?: string;
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
