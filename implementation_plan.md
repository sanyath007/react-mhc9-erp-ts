# TypeScript Migration Plan

This document outlines the strategy for migrating the `react-mhc9-erp` project from JavaScript to TypeScript. 

Yes, **you absolutely can convert this project to TypeScript**. Since you are using Create React App (`react-scripts`), the tooling already has excellent built-in support for TypeScript.

> [!NOTE]
> The project currently contains approximately 354 `.js` and `.jsx` files in the `src` directory. Because of the size of the codebase, an **incremental migration** strategy is highly recommended over a "Big Bang" approach (trying to convert everything at once).

## Open Questions

- **Migration Pace**: Would you prefer to migrate files gradually as you touch them for new features/bug fixes, or would you like to dedicate a specific block of time to migrate core areas upfront?
- **Strictness**: Do you want to enforce strict typing (`"strict": true` in `tsconfig`) from the beginning on the newly converted files, or start loose and tighten it later?

## Proposed Changes

We will approach the migration in clearly defined phases to ensure the application remains stable and functional throughout the process.

---

### Phase 1: Setup and Configuration

We'll start by adding the necessary TypeScript dependencies and allowing `.js` and `.ts` files to coexist.

#### 1. Install TypeScript and Types
Run the following command to add TypeScript and community types for React, Node, and Jest:
```bash
npm install --save typescript @types/node @types/react @types/react-dom @types/jest
```

We will also need to install types for some of the third-party libraries currently in `package.json` if they don't include them natively (e.g., `@types/react-router-dom`).

#### 2. Initialize `tsconfig.json`
By simply renaming `src/index.js` (or `src/index.jsx`) to `src/index.tsx` and starting the development server (`npm start`), Create React App will automatically generate a baseline `tsconfig.json` file. 

We will verify that it contains `"allowJs": true` so that our existing 353 JavaScript files continue to compile without errors.

---

### Phase 2: Core Infrastructure

Before touching UI components, it's best to define our core data types and convert the foundation of the app.

#### 1. Define Global Interfaces
Create a `src/types/` directory to hold globally shared interfaces such as:
- `User` (Auth structures)
- API response structures
- Base data models (Assets, Employees, etc.)

#### 2. Convert Utilities and Services
Migrate files that don't have UI dependencies first:
- **`src/utils/`**: Convert pure functions (e.g., date formats, currency calculations).
- **`src/features/services/` (RTK Query)**: Add types for the API endpoints, specifying request and response payload types. This will provide massive auto-complete benefits later.
- **`src/features/slices/`**: Convert Redux slices using Redux Toolkit's built-in TypeScript support.

---

### Phase 3: Components and Views

With the data layer typed, we can move up the component tree.

#### 1. Shared UI Components (`src/components/`)
Convert reusable foundational components first, defining explicit `Props` interfaces for each:
- Buttons, Badges, Loaders
- Form Controls (Pickers, Autocompletes)
- Layout wrappers (`DefaultLayout`, `Navbar`, `Sidebar`)

#### 2. Feature Views (`src/views/`)
Finally, migrate the complex page modules (Auth, Task, Procurement, Loan, etc.). Because the underlying Redux hooks and shared components will already be typed, converting these larger views will be much easier.

## Verification Plan

### Automated Tests
- Run `npm run build` after initial setup to ensure the build pipeline still works with the mixed JS/TS codebase.
- Run `npm test` to ensure existing tests pass.

### Manual Verification
- After setting up `tsconfig.json`, ensure that VS Code or your IDE provides IntelliSense for the newly created `.ts`/`.tsx` files.
- Spin up the dev server (`npm start`) to verify the app renders correctly during the transition.
