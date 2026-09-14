import { Route, Routes } from 'react-router-dom';
import GuardRoute from './components/GuardRoute';
import DefaultLayout from "./components/DefaultLayout"
import Home from './views/Home';
/** Auth */
import Login from './views/Auth/Login';
import Register from './views/Auth/Register';
import ForgotPassword from './views/Auth/ForgotPassword';
import VerifyEmail from './views/Auth/VerifyEmail';
import ResetPassword from './views/Auth/ResetPassword';
/** Task */
import TaskList from './views/Task/List';
import AddTask from './views/Task/Add';
import EditTask from './views/Task/Edit';
import TaskDetail from './views/Task/Detail';
import TaskSummary from './views/Task/Report/Summary';
/** Asset */
import AddAsset from './views/Asset/Add';
import AssetList from './views/Asset/List';
import AssetDetail from './views/Asset/Detail';
import EditAsset from './views/Asset/Edit';
import AssetType from './views/AssetType';
import AssetCategory from './views/AssetCategory';
/** Comset */
import ComsetList from './views/Comset/List';
import AddComset from './views/Comset/Add';
import EditComset from './views/Comset/Edit';
import ComsetDetail from './views/Comset/Detail';
/** Employee */
import EmployeeList from './views/Employee/List';
import AddEmployee from './views/Employee/Add';
import EditEmployee from './views/Employee/Edit';
import EmployeeDetail from './views/Employee/Detail';
/** Department */
import Department from './views/Department';
import Division from './views/Division';
import Room from './views/Room';
/** Requisition */
import RequisitionList from './views/Requisition/List';
import RequisitionDetail from './views/Requisition/Detail';
import AddRequisition from './views/Requisition/Add';
import EditRequisition from './views/Requisition/Edit';
/** Purchase Order */
import OrderList from './views/Order/List';
import AddOrder from './views/Order/Add';
import EditOrder from './views/Order/Edit';
import OrderDetail from './views/Order/Detail';
/** Inspection */
import InspectionList from './views/Inspection/List';
import AddInspection from './views/Inspection/Add';
import EditInspection from './views/Inspection/Edit';
import InspectionDetail from './views/Inspection/Detail';
/** Procurement Report */
import ProcurementReport from './views/Procurement/Report';
import ProcurementSummary from './views/Procurement/Summary';
import ProcurementAttachment from './views/Procurement/Attachment';
/** Item */
import ItemList from './views/Item/List';
import AddItem from './views/Item/Add';
import EditItem from './views/Item/Edit';
import ItemDetail from './views/Item/Detail';
/** Supplier */
import SupplierList from './views/Supplier/List';
import AddSupplier from './views/Supplier/Add';
import Unit from './views/Unit'
/** Viewer */
import WordViewer from './components/ReportViewer/WordViewer';
/** Report */
import RequisitionForm from './components/Preview/Requisition/Form';
import RequisitionReport from './components/Preview/Requisition/Report';
import RequisitionCommittee from './components/Preview/Requisition/Committee';
import RequisitionConsideration from './components/Preview/Requisition/Consideration';
import RequisitionNotice from './components/Preview/Requisition/Notice';
import InspectionDocument from './components/Preview/Inspection/Form';
import InspectionReport from './components/Preview/Inspection/Report';
import FormLoan from './components/Preview/FormLoan';
import FormLoanContract from './components/Preview/FormLoanContract';
import FormLoanRefund from './components/Preview/FormLoanRefund';
import FormLoanOver20 from './components/Preview/FormLoanOver20';
import FormLoanReturn from './components/Preview/FormLoanReturn';
import FormLoanRefundBill from './components/Preview/FormLoanRefundBill';
import FormProjectVerify from './components/Preview/FormProjectVerify';
import FormProjectReview from './components/Preview/FormProjectReview';
import PreviewProcurementSummary from './components/Preview/Procurement/Summary';
import PreviewProcurementAttachment from './components/Preview/Procurement/Attachment';
/** Repairation */
import RepairationList from './views/Repairation/List';
import RepairationDetail from './views/Repairation/Detail';
/** Loan */
import LoanList from './views/Loan/List';
import AddLoan from './views/Loan/Add';
import EditLoan from './views/Loan/Edit';
import LoanDetail from './views/Loan/Detail';
/** Loan Contract */
import LoanContractList from './views/LoanContract/List';
import AddLoanContract from './views/LoanContract/Add';
import EditLoanContract from './views/LoanContract/Edit';
import LoanContractDetail from './views/LoanContract/Detail';
import LoanContractReport from './views/LoanContract/Report'
/** Loan Refund */
import LoanRefundList from './views/LoanRefund/List';
import AddLoanRefund from './views/LoanRefund/Add';
import EditLoanRefund from './views/LoanRefund/Edit';
import LoanRefundDetail from './views/LoanRefund/Detail';
/** Budget */
import BudgetActivityList from './views/Budget/Activity/List';
import AddBudgetActivity from './views/Budget/Activity/Add';
import EditBudgetActivity from './views/Budget/Activity/Edit';
import BudgetPlanList from './views/Budget/Plan/List';
import AddBudgetPlan from './views/Budget/Plan/Add';
import EditBudgetPlan from './views/Budget/Plan/Edit';
import BudgetProjectList from './views/Budget/Project/List';
import AddBudgetProject from './views/Budget/Project/Add';
import EditBudgetProject from './views/Budget/Project/Edit';
import AllocationList from './views/Budget/Allocation/List';
import AddAllocation from './views/Budget/Allocation/Add';
import EditAllocation from './views/Budget/Allocation/Edit';
import AllocationSummary from './views/Budget/Allocation/Summary';
/** Place */
import PlaceList from './views/Place/List';
import AddPlace from './views/Place/Add';
import EditPlace from './views/Place/Edit';
/** User */
import UserList from './views/User/List';
/** Help */
import Advice from './views/Advice';
import LoanRefundBillList from './views/LoanRefund/BillList';

function App() {
    return (
        <Routes>
            <Route path="/" element={<DefaultLayout />} >
                <Route index element={<GuardRoute><Home /></GuardRoute>} />

                {/* ============================= IT Helpdesk ============================= */}
                {/* Tasks */}
                <Route path="task" element={<GuardRoute><TaskList /></GuardRoute>} />
                <Route path="task/add" element={<GuardRoute><AddTask /></GuardRoute>} />
                <Route path="task/:id/edit" element={<GuardRoute><EditTask /></GuardRoute>} />
                <Route path="task/:id/detail" element={<GuardRoute><TaskDetail /></GuardRoute>} />
                <Route path="task/summary" element={<GuardRoute><TaskSummary /></GuardRoute>} />

                {/* Repairation */}
                <Route path="repairation" element={<GuardRoute><RepairationList /></GuardRoute>} />
                <Route path="repairation/:id/detail" element={<GuardRoute><RepairationDetail /></GuardRoute>} />

                {/* ============================= Procurement ============================= */}
                {/* Requisitions */}
                <Route path="requisition" element={<GuardRoute><RequisitionList /></GuardRoute>} />
                <Route path="requisition/add" element={<GuardRoute><AddRequisition /></GuardRoute>} />
                <Route path="requisition/:id/edit" element={<GuardRoute><EditRequisition /></GuardRoute>} />
                <Route path="requisition/:id/detail" element={<GuardRoute><RequisitionDetail /></GuardRoute>} />

                {/* Orders */}
                <Route path="order" element={<GuardRoute><OrderList /></GuardRoute>} />
                <Route path="order/add" element={<GuardRoute><AddOrder /></GuardRoute>} />
                <Route path="order/:id/edit" element={<GuardRoute><EditOrder /></GuardRoute>} />
                <Route path="order/:id/detail" element={<GuardRoute><OrderDetail /></GuardRoute>} />

                {/* Inspections */}
                <Route path="inspection" element={<GuardRoute><InspectionList /></GuardRoute>} />
                <Route path="inspection/add" element={<GuardRoute><AddInspection /></GuardRoute>} />
                <Route path="inspection/:id/edit" element={<GuardRoute><EditInspection /></GuardRoute>} />
                <Route path="inspection/:id/detail" element={<GuardRoute><InspectionDetail /></GuardRoute>} />

                {/* Procurement Report */}
                <Route path="procurement/report" element={<GuardRoute><ProcurementReport /></GuardRoute>} />
                <Route path="procurement/report/attachment" element={<GuardRoute><ProcurementAttachment /></GuardRoute>} />
                <Route path="procurement/report/summary" element={<GuardRoute><ProcurementSummary /></GuardRoute>} />

                {/* ============================= Loan ============================= */}
                <Route path="loan" element={<GuardRoute><LoanList /></GuardRoute>} />
                <Route path="loan/add" element={<GuardRoute><AddLoan /></GuardRoute>} />
                <Route path="loan/:id/edit" element={<GuardRoute><EditLoan /></GuardRoute>} />
                <Route path="loan/:id/detail" element={<GuardRoute><LoanDetail /></GuardRoute>} />

                <Route path="loan-contract" element={<GuardRoute><LoanContractList /></GuardRoute>} />
                <Route path="loan-contract/add" element={<GuardRoute><AddLoanContract /></GuardRoute>} />
                <Route path="loan-contract/:id/edit" element={<GuardRoute><EditLoanContract /></GuardRoute>} />
                <Route path="loan-contract/:id/detail" element={<GuardRoute><LoanContractDetail /></GuardRoute>} />
                <Route path="loan-report" element={<GuardRoute><LoanContractReport /></GuardRoute>} />

                <Route path="loan-refund" element={<GuardRoute><LoanRefundList /></GuardRoute>} />
                <Route path="loan-refund/add" element={<GuardRoute><AddLoanRefund /></GuardRoute>} />
                <Route path="loan-refund/:id/edit" element={<GuardRoute><EditLoanRefund /></GuardRoute>} />
                <Route path="loan-refund/:id/detail" element={<GuardRoute><LoanRefundDetail /></GuardRoute>} />
                <Route path="loan-refund/bill" element={<GuardRoute><LoanRefundBillList /></GuardRoute>} />
                {/* ============================= System Data ============================= */}
                {/* Items */}
                <Route path="item" element={<GuardRoute><ItemList /></GuardRoute>} />
                <Route path="item/add" element={<GuardRoute><AddItem /></GuardRoute>} />
                <Route path="item/:id/edit" element={<GuardRoute><EditItem /></GuardRoute>} />
                <Route path="item/:id/detail" element={<GuardRoute><ItemDetail /></GuardRoute>} />

                {/* Suppliers */}
                <Route path="supplier" element={<GuardRoute><SupplierList /></GuardRoute>} />
                <Route path="supplier/add" element={<GuardRoute><AddSupplier /></GuardRoute>} />

                {/* Units */}
                <Route path="unit" element={<GuardRoute><Unit /></GuardRoute>} />

                {/* Comsets */}
                <Route path="comset" element={<GuardRoute><ComsetList /></GuardRoute>} />
                <Route path="comset/add" element={<GuardRoute><AddComset /></GuardRoute>} />
                <Route path="comset/:id/edit" element={<GuardRoute><EditComset /></GuardRoute>} />
                <Route path="comset/:id/detail" element={<GuardRoute><ComsetDetail /></GuardRoute>} />

                {/* Assets */}
                <Route path="asset" element={<GuardRoute><AssetList /></GuardRoute>} />
                <Route path="asset/add" element={<GuardRoute><AddAsset /></GuardRoute>} />
                <Route path="asset/:id/edit" element={<GuardRoute><EditAsset /></GuardRoute>} />
                <Route path="asset/:id/detail" element={<GuardRoute><AssetDetail /></GuardRoute>} />
                <Route path="asset-type" element={<GuardRoute><AssetType /></GuardRoute>} />
                <Route path="asset-category" element={<GuardRoute><AssetCategory /></GuardRoute>} />

                {/* Employees */}
                <Route path="employee" element={<GuardRoute><EmployeeList /></GuardRoute>} />
                <Route path="employee/add" element={<GuardRoute><AddEmployee /></GuardRoute>} />
                <Route path="employee/:id/edit" element={<GuardRoute><EditEmployee /></GuardRoute>} />
                <Route path="employee/:id/detail" element={<GuardRoute><EmployeeDetail /></GuardRoute>} />

                {/* Offices */}
                <Route path="department" element={<GuardRoute><Department /></GuardRoute>} />
                <Route path="division" element={<GuardRoute><Division /></GuardRoute>} />
                <Route path="room" element={<GuardRoute><Room /></GuardRoute>} />

                {/* Budgets */}
                <Route path="budget-plan" element={<GuardRoute><BudgetPlanList /></GuardRoute>} />
                <Route path="budget-plan/add" element={<GuardRoute><AddBudgetPlan /></GuardRoute>} />
                <Route path="budget-plan/:id/edit" element={<GuardRoute><EditBudgetPlan /></GuardRoute>} />
                <Route path="budget-project/:year?/:plan?" element={<GuardRoute><BudgetProjectList /></GuardRoute>} />
                <Route path="budget-project/add/:year?/:plan?" element={<GuardRoute><AddBudgetProject /></GuardRoute>} />
                <Route path="budget-project/:id/edit" element={<GuardRoute><EditBudgetProject /></GuardRoute>} />
                <Route path="budget-activity/:year?/:project?" element={<GuardRoute><BudgetActivityList /></GuardRoute>} />
                <Route path="budget-activity/add/:year?/:project?" element={<GuardRoute><AddBudgetActivity /></GuardRoute>} />
                <Route path="budget-activity/:id/edit" element={<GuardRoute><EditBudgetActivity /></GuardRoute>} />
                <Route path="budget">
                    <Route path="allocation" element={<GuardRoute><AllocationSummary /></GuardRoute>} />
                    <Route path="allocation/budget/:id" element={<GuardRoute><AllocationList /></GuardRoute>} />
                    <Route path="allocation/budget/:id/add" element={<GuardRoute><AddAllocation /></GuardRoute>} />
                    <Route path="allocation/budget/:id/:allocationId/edit" element={<GuardRoute><EditAllocation /></GuardRoute>} />
                </Route>

                {/* Places */}
                <Route path="place" element={<GuardRoute><PlaceList /></GuardRoute>} />
                <Route path="place/add" element={<GuardRoute><AddPlace /></GuardRoute>} />
                <Route path="place/:id/edit" element={<GuardRoute><EditPlace /></GuardRoute>} />

                {/* Users */}
                <Route path="user" element={<GuardRoute><UserList /></GuardRoute>} />

                {/* ============================= Help ============================= */}
                {/* Advice */}
                <Route path="advice" element={<GuardRoute><Advice /></GuardRoute>} />

                {/* ============================= Miscellaneous ============================= */}

            </Route>
            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Report Viewer */}
            <Route path="report-viewer" element={<GuardRoute><WordViewer /></GuardRoute>} />
            {/* Preview */}
            <Route path="/preview/requisition/:id" element={<RequisitionForm />} />
            <Route path="/preview/requisition/:id/report" element={<RequisitionReport />} />
            <Route path="/preview/requisition/:id/committee" element={<RequisitionCommittee />} />
            <Route path="/preview/requisition/:id/consider" element={<RequisitionConsideration />} />
            <Route path="/preview/requisition/:id/notice" element={<RequisitionNotice />} />
            <Route path="/preview/inspection/:id" element={<InspectionDocument />} />
            <Route path="/preview/inspection/:id/report" element={<InspectionReport />} />

            <Route path="/preview/procurement/summary/:sdate/:edate/:status/:limit" element={<PreviewProcurementSummary />} />
            <Route path="/preview/procurement/attachment/:sdate/:edate/:status/:limit" element={<PreviewProcurementAttachment />} />

            <Route path="/preview/:id/loan/form" element={<FormLoan />} />
            <Route path="/preview/:id/loan-contract/form" element={<FormLoanContract />} />
            <Route path="/preview/:id/loan-refund/form" element={<FormLoanRefund />} />
            <Route path="/preview/:id/loan-refund/over20" element={<FormLoanOver20 />} />
            <Route path="/preview/:id/loan-refund/return" element={<FormLoanReturn />} />
            <Route path="/preview/:id/loan-refund/bill" element={<FormLoanRefundBill />} />
            <Route path="/preview/:id/project/verify" element={<FormProjectVerify />} />
            <Route path="/preview/:id/project/review" element={<FormProjectReview />} />
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    );
}

export default App;
