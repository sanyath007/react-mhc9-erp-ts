import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import comsetReducer from "./slices/comset/comsetSlice";
import asssetReducer from "./slices/asset/assetSlice";
import assetTypeReducer from "./slices/asset-type/assetTypeSlice";
import assetCategoryReducer from "./slices/asset-category/assetCategorySlice";
import assetOwnershipReducer from "./slices/asset-ownership/assetOwnershipSlice";
import employeeReducer from "./slices/employee/employeeSlice";
import departmentReducer from "./slices/department/departmentSlice";
import divisionReducer from "./slices/division/divisionSlice";
import roomReducer from "./slices/room/roomSlice";
import taskRecuer from "./slices/task/taskSlice";
import itemReducer from "./slices/item/itemSlice";
import budgetReducer from "./slices/budget/budgetSlice";
import budgetPlanReducer from "./slices/budget-plan/budgetPlanSlice";
import budgetProjectReducer from "./slices/budget-project/budgetProjectSlice";
import budgetActivityReducer from "./slices/budget-activity/budgetActivitySlice";
import budgetAllocationReducer from "./slices/budget-allocation/budgetAllocationSlice"
import requisitionReducer from "./slices/requisition/requisitionSlice";
import unitReducer from './slices/unit/unitSlice';
import memberReducer from "./slices/member/memberSlice";
import orderReducer from "./slices/order/orderSlice";
import supplierReducer from "./slices/supplier/supplierSlice";
import inspectionReducer from "./slices/inspection/inspectionSlice";
import repairationReducer from "./slices/repairation/repairationSlice";
import approvalReducer from "./slices/approval/approvalSlice";
import loanReducer from "./slices/loan/loanSlice";
import loanContactReducer from "./slices/loan-contract/loanContractSlice";
import loanRefundReducer from "./slices/loan-refund/loanRefundSlice";
import projectReducer from "./slices/project/projectSlice";
import placeReducer from "./slices/place/placeSlice";
import userReducer from './slices/user/userSlice';
import agencyReducer from './slices/agency/agencySlice';
import { systemApi } from "./services/system/systemApi";
import { authApi } from "./services/auth/authApi";
import { requisitionApi } from "./services/requisition/requisitionApi";
import { employeeApi } from "./services/employee/employeeApi";
import { itemApi } from "./services/item/itemApi";
import { supplierApi } from "./services/supplier/supplierApi";
import { assetApi } from "./services/asset/assetApi";
import { orderApi } from "./services/order/orderApi";
import { inspectionApi } from "./services/inspection/inspectionApi"
import { taskApi } from "./services/task/taskApi"
import { repairationApi } from "./services/repairation/repairationApi"
import { assetCategoryApi } from "./services/asset-category/assetCategoryApi"
import { assetTypeApi } from "./services/asset-type/assetTypeApi"
import { approvalApi } from "./services/approval/approvalApi";
import { loanApi } from "./services/loan/loanApi";
import { loanContractApi } from './services/loan-contract/loanContractApi'
import { loanRefundApi } from "./services/loan-refund/loanRefundApi";
import { budgetApi } from "./services/budget/budgetApi";
import { budgetPlanApi } from "./services/budget-plan/budgetPlanApi";
import { budgetProjectApi } from "./services/budget-project/budgetProjectApi";
import { budgetActivityApi } from './services/budget-activity/budgetActivityApi'
import { projectApi } from "./services/project/projectApi";
import { placeApi } from "./services/place/placeApi";
import { comsetApi } from "./services/comset/comsetApi";
import { userApi } from "./services/user/userApi";

const store = configureStore({
    reducer: {
        [systemApi.reducerPath]: systemApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [requisitionApi.reducerPath]: requisitionApi.reducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
        [itemApi.reducerPath]: itemApi.reducer,
        [supplierApi.reducerPath]: supplierApi.reducer,
        [assetApi.reducerPath]: assetApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [inspectionApi.reducerPath]: inspectionApi.reducer,
        [taskApi.reducerPath]: taskApi.reducer,
        [repairationApi.reducerPath]: repairationApi.reducer,
        [assetCategoryApi.reducerPath]: assetCategoryApi.reducer,
        [assetTypeApi.reducerPath]: assetTypeApi.reducer,
        [approvalApi.reducerPath]: approvalApi.reducer,
        [loanApi.reducerPath]: loanApi.reducer,
        [loanContractApi.reducerPath]: loanContractApi.reducer,
        [loanRefundApi.reducerPath]: loanRefundApi.reducer,
        [budgetApi.reducerPath]: budgetApi.reducer,
        [budgetPlanApi.reducerPath]: budgetPlanApi.reducer,
        [budgetProjectApi.reducerPath]: budgetProjectApi.reducer,
        [budgetActivityApi.reducerPath]: budgetActivityApi.reducer,
        [projectApi.reducerPath]: projectApi.reducer,
        [placeApi.reducerPath]: placeApi.reducer,
        [comsetApi.reducerPath]: comsetApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        auth: authReducer,
        asset: asssetReducer,
        assetType: assetTypeReducer,
        assetCategory: assetCategoryReducer,
        ownership: assetOwnershipReducer,
        comset: comsetReducer,
        employee: employeeReducer,
        department: departmentReducer,
        division: divisionReducer,
        room: roomReducer,
        task: taskRecuer,
        item: itemReducer,
        budget: budgetReducer,
        requisition: requisitionReducer,
        unit: unitReducer,
        member: memberReducer,
        order: orderReducer,
        supplier: supplierReducer,
        inspection: inspectionReducer,
        repairation: repairationReducer,
        approval: approvalReducer,
        loan: loanReducer,
        loanContract: loanContactReducer,
        loanRefund: loanRefundReducer,
        budgetPlan: budgetPlanReducer,
        budgetProject: budgetProjectReducer,
        budgetActivity: budgetActivityReducer,
        budgetAllocation: budgetAllocationReducer,
        project: projectReducer,
        place: placeReducer,
        user: userReducer,
        agency: agencyReducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(
            systemApi.middleware,
            authApi.middleware,
            requisitionApi.middleware,
            employeeApi.middleware,
            itemApi.middleware,
            supplierApi.middleware,
            assetApi.middleware,
            orderApi.middleware,
            inspectionApi.middleware,
            taskApi.middleware,
            repairationApi.middleware,
            assetCategoryApi.middleware,
            assetTypeApi.middleware,
            approvalApi.middleware,
            comsetApi.middleware,
            loanApi.middleware,
            loanContractApi.middleware,
            loanRefundApi.middleware,
            budgetApi.middleware,
            budgetPlanApi.middleware,
            budgetProjectApi.middleware,
            budgetActivityApi.middleware,
            projectApi.middleware,
            placeApi.middleware,
            userApi.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
