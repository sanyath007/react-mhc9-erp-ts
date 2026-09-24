# AGENTS.md

## Quick Start

- **Start dev server**: `npm start` – runs CRA on http://localhost:3000.
- **Run tests**: `npm test` (CRA Jest watcher). To run a single test file: `npm test -- <path/to/file.test.ts>`.
- **Build for production**: `npm run build` (uses `--max_old_space_size=4096`).

## Environment / Build Prerequisites

1. Set the correct `REACT_APP_API_URL` in `.env.local` before building:
   - Development: `REACT_APP_API_URL="http://localhost:8081/laravel80-mhc9-erp/public"`
   - Production: uncomment and set the production URL.
2. In `package.json` ensure the `homepage` field is set to the production base URL (e.g., `"homepage": "https://app.mhc9dmh.com/erp/"`).
3. In the router component (`src/App.tsx` or similar) set `basename="/erp"` so the app works under the sub‑path.
4. Remove hard‑coded email/password values from the `initialValues` prop in the Login view before committing.

## Key Project Structure

### Core Architecture
- `src/api/index.ts` – custom Axios instance with JWT interceptor (legacy, used by Redux async thunks).
- `src/features/store.ts` – central Redux store configuration (32 slices + 25 RTK Query services).
- `src/features/services/` – RTK Query service definitions (preferred for data fetching).
- `src/features/slices/` – Redux slices for local/global state.

### Page Modules (`src/views/`)
- `Auth/` – Authentication (Login, Register, ForgotPassword, ResetPassword, ChangePassword)
- `Task/` – IT helpdesk tasks with handling workflow
- `Repairation/` – Equipment repair tracking
- `Requisition/` – Purchase requisitions with approval workflow
- `Order/` – Purchase orders
- `Inspection/` – Goods receiving inspection
- `Procurement/` – Procurement reports (Summary, Attachment)
- `Loan/` – Government loan requests
- `LoanContract/` – Loan contract management
- `LoanRefund/` – Loan refund/settlement and bill management
- `Asset/` – Fixed assets (equipment, furniture)
- `AssetType/`, `AssetCategory/` – Asset classification
- `Comset/` – Computer sets
- `Material/` – Consumable materials
- `Employee/` – Personnel management
- `Department/`, `Division/`, `Room/` – Organizational structure
- `Item/` – Product/service catalog
- `supplier/` – Supplier management
- `Unit/` – Measurement units
- `Budget/` – Budget management (Plan, Project, Activity, Allocation)
- `Place/` – Location management
- `User/` – User management

### Reusable Components (`src/components/`)
- `DefaultLayout/` – Main app shell (Navbar + Sidebar + Content + Footer)
- `ui/` – Shared UI layout and components (Navbar, Sidebar, Pagination, Loading, StatCard)
- `GuardRoute.tsx` – Auth guard (checks JWT expiry, forces password change for new users)
- `FormControls/` – Custom form inputs (Autocomplete, DropdownAutocomplete, EmployeeSelection, ThDatePicker, FileUpload, etc.)
- `Preview/` – 17 document print templates (Thai government memo formats for Requisition, Inspection, Loan documents)
- `ReportViewer/` – DevExpress, Stimulsoft, and Word document viewers
- `Modals/` – 17 entity picker modals (AssetList, BudgetList, EmployeeList, ItemList, Requisition, Order, Loan, LoanContract, Supplier, Place, etc.)
- `Expense/` – Expense line item management (AddExpense, ExpenseList)
- `Badges/` – Status badges (LoanStatusBadge)

### Thai-Specific Utilities (`src/utils/`)
- `index.ts` – Buddhist Era date formatting (+543), Thai Baht currency formatting, VAT calculation
- `constraints.ts` – Thai constants (Priorities, Duties, Expenses, Month names)
- `currencyText.ts` – Number-to-Thai-text conversion for official documents
- `OverwriteMomentBE.ts` – Moment.js Buddhist Era year override

## Features & Modules

### Authentication
- JWT-based authentication with token refresh
- User registration and password management
- Forgot password and email verification flows
- Forced password change for new users (`is_new` flag)
- Role-based access control (5 roles: Admin=1, Role 3, Role 4, Role 5)

### IT Helpdesk / Services
- Task management with CRUD operations
- Task handling workflow
- Asset assignment within tasks
- Repairation tracking
- Task summary/reporting

### Procurement Module
- Purchase requisitions with approval workflow
- Purchase orders management
- Goods receiving inspection
- Procurement reports (Summary, Attachment)
- Document generation (official Thai government memo formats)

### Financial Loans Module
- Government loan requests
- Loan contract management
- Loan refund/settlement
- Bill and receipt management
- Loan contract register/report

### Master Data Management
- Fixed assets and equipment (ครุภัณฑ์)
- Computer sets (ชุดคอมพิวเตอร์)
- Consumable materials (วัสดุ)
- Asset types and categories
- Employees, departments, divisions, rooms
- Product/service catalog
- Suppliers and measurement units
- Budget management (plans, projects, activities, allocations)
- Locations/places
- User management

## Role-Based Access Control

| Role ID | Access Level |
|---------|--------------|
| 1 (Admin) | Full access to all modules |
| 3 | Procurement (orders, inspections, reports) + master data |
| 4 | Loan contract/report access + budget management |
| 5 | Combined procurement + loan + budget access |

Menu visibility is enforced at both Navbar and Sidebar levels based on `role_id`.

## Routing

- Protected routes are wrapped with `<GuardRoute>` in `src/App.tsx`.
- Main pages use `DefaultLayout`.
- Auth guard checks JWT expiry and redirects to login if invalid.
- New users are forced to ChangePassword page.

## Styling

- **Primary UI**: Tailwind CSS + DaisyUI
- **Layout**: Bootstrap 5 + React-Bootstrap
- **Legacy**: Material-UI (date pickers, some components)

## Testing

- CRA's default Jest config is used; no extra setup required.
- Single test execution: `npm test -- <path/to/file.test.ts>`.

## Reference

- See `GEMINI.md` for a deeper project overview and conventions.
