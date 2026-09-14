# MHC9 ERP System

A comprehensive Enterprise Resource Planning (ERP) system for **Mental Health Center 9** (ศูนย์สุขภาพจิตที่ 9), a Thai government health organization. Built with React, this application manages various aspects of the organization including IT helpdesk, procurement, loan management, asset management, and budgeting.

## Features

### Authentication & User Management
- JWT-based authentication with token refresh
- User registration and password management
- Forgot password and email verification flows
- Forced password change for new users
- Role-based access control (5 roles with different permission levels)

### IT Helpdesk / Services
- Task management with full CRUD operations
- Task handling workflow
- Asset assignment within tasks
- Equipment repair tracking (Repairation)
- Task summary and reporting

### Procurement Module
- **Requisition**: Purchase/hire requests with approval workflow
- **Order**: Purchase orders management
- **Inspection**: Goods receiving inspection
- **Reports**: Procurement summary and attachment reports
- **Document Generation**: Official Thai government memo formats for printing

### Financial Loans Module
- **Loan Requests**: Government loan applications
- **Loan Contracts**: Contract management and tracking
- **Loan Refund**: Settlement and bill management
- **Loan Reports**: Contract register and reporting

### Master Data Management
- **Assets**: Fixed assets and equipment (ครุภัณฑ์)
- **Computer Sets**: Computer set management (ชุดคอมพิวเตอร์)
- **Materials**: Consumable materials (วัสดุ)
- **Asset Classification**: Types and categories
- **Personnel**: Employees, departments, divisions, rooms
- **Catalog**: Products/services, suppliers, measurement units
- **Budget**: Plans, projects, activities, and allocations
- **Locations**: Place and room management

### Document Generation & Reporting
- 17 document print templates (Thai government memo formats)
- Procurement documents (Requisition, Order, Inspection)
- Loan documents (Request, Contract, Refund, Bill)
- Project verification and review forms
- Multiple report viewer integrations (DevExpress, Stimulsoft, Word)

## Tech Stack

### Core
- **React 18** - Frontend framework
- **TypeScript** - Primary language for type safety
- **React Router 6** - Client-side routing with protected routes
- **Redux Toolkit** - State management with RTK Query for API services

### UI Libraries
- **Tailwind CSS + DaisyUI** - Primary styling
- **Bootstrap 5 + React-Bootstrap** - Layout and components
- **Material-UI** (Legacy) - Date pickers and some components

### Forms & Validation
- **Formik** - Form state management
- **Yup** - Schema validation

### Reporting & Documents
- **DevExpress Reporting** - Advanced report generation
- **Stimulsoft Reports** - Report viewer
- **PDFTron WebViewer** - PDF viewing

### Utilities
- **Moment.js** - Date manipulation with Buddhist Era support
- **Axios** - HTTP client with JWT interceptor
- **jwt-decode** - JWT token decoding

## Getting Started

### Prerequisites
- Node.js (LTS version recommended, compatible with CRA 5)
- npm or yarn package manager

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Opens the app at http://localhost:3000

### Production Build

```bash
npm run build
```

Uses `--max_old_space_size=4096` for large builds.

## Build Precautions

Before building for production:

1. Comment `REACT_APP_API_URL` key of development and uncomment production one in `.env.local` file
2. Update `REACT_APP_ROOT_PATH=/erp` in `.env.local` file
3. Set property `"homepage": "https://app.mhc9dmh.com/erp/"` in package.json
4. Set prop `basename="/erp"` to Router component
5. Remove email and password values of `initialValues` prop in Login view (optional)

## Project Structure

```
src/
├── api/                    # Axios instance (legacy, JWT interceptor)
├── features/
│   ├── store.ts           # Redux store (32 slices + 25 RTK Query services)
│   ├── slices/            # Redux slices for local/global state
│   └── services/          # RTK Query API services
├── views/                 # 27 page modules organized by domain
│   ├── Auth/              # Login, Register, ForgotPassword, ChangePassword
│   ├── Task/              # IT Helpdesk tasks
│   ├── Repairation/       # Equipment repair tracking
│   ├── Requisition/       # Purchase requisitions
│   ├── Order/             # Purchase orders
│   ├── Inspection/        # Goods receiving
│   ├── Procurement/       # Reports (Summary, Attachment)
│   ├── Loan/              # Government loan requests
│   ├── LoanContract/      # Loan contracts
│   ├── LoanRefund/        # Loan refund/settlement
│   ├── Asset/             # Fixed assets
│   ├── Comset/            # Computer sets
│   ├── Material/          # Consumable materials
│   ├── Employee/          # Personnel
│   ├── Budget/            # Budget management
│   └── ...                # Other modules
├── components/
│   ├── DefaultLayout/     # App shell (Navbar + Sidebar + Content + Footer)
│   ├── ui/                # Shared UI elements (Navbar, Sidebar, Loading, Pagination, etc.)
│   ├── FormControls/      # Custom form inputs
│   ├── Preview/           # 17 document print templates
│   ├── ReportViewer/      # DevExpress, Stimulsoft, Word viewers
│   ├── Modals/            # 17 entity picker modals
│   └── ...
└── utils/
    ├── index.ts           # Buddhist Era dates, Thai Baht, VAT
    ├── constraints.ts     # Thai constants
    └── currencyText.ts    # Number-to-Thai-text
```

## Role-Based Access Control

| Role ID | Access Level |
|---------|--------------|
| 1 (Admin) | Full access to all modules |
| 3 | Procurement (orders, inspections, reports) + master data |
| 4 | Loan contract/report access + budget management |
| 5 | Combined procurement + loan + budget access |

Menu visibility is enforced at both Navbar and Sidebar levels based on `role_id`.
