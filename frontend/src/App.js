import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Loginpage from './componts/login/Loginpage';
import DashboardLayout from './DashboardLayout';
import Addcustomer from './componts/dashboard/addcustomer';
import AdminDashboard from './componts/dashboard/Admindashboard';
import EditCustomer from "./componts/customer/EditCustomer";
import Deleteduser from './componts/deleteuser/Deletedusers';
import CustomerListView from './componts/customer/CustomerListView';
import Repayloan from './componts/repayment/Repayloan';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ViewCustomer from "./componts/customer/ViewCustomer";
import AddInterestForm from "./componts/customer/AddInterest";
import InterestDetailsPage from "./componts/customer/InterestDetailsPage";
import ViewInterestPage from "./componts/customer/ViewInterestPage";
import AddJewellery from "./componts/customer/AddJewellery";
import LoanDetails from "./componts/customer/LoanDetails";
import CloseLoan from "./componts/customer/CloseLoan";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // default styles
import ProtectedRoute from "./componts/ProtectedRoute";


function App() {
 
   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return (
    <Router>
      <Routes>
        <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/AdminDashboard" replace /> : <Loginpage />
        }
      />

        {/* Wrap all dashboard pages with DashboardLayout */}
        <Route path="/AdminDashboard" element={
           <ProtectedRoute>
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/add-customer" element={
          <ProtectedRoute>
          <DashboardLayout>
            <Addcustomer />
          </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/customers/edit/:id"  element={
          <ProtectedRoute> 
          <DashboardLayout>
          <EditCustomer />
          </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/deleted-user" element={
          <ProtectedRoute>
          <DashboardLayout>
            <Deleteduser />
          </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/customer-list" element={
          <ProtectedRoute>
          <DashboardLayout>
            <CustomerListView />
          </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/repay-loan" element={
          <ProtectedRoute>
          <DashboardLayout>
            <Repayloan />
          </DashboardLayout>
          </ProtectedRoute>
        } />
          <Route path="/customers/view/:id" element={
            <ProtectedRoute>
          <DashboardLayout>
            <ViewCustomer />
          </DashboardLayout>
          </ProtectedRoute>
        } />
          <Route path="/addinterest/:customerId/:itemCode" element={
            <ProtectedRoute>
          <DashboardLayout>
            <AddInterestForm />
          </DashboardLayout>
          </ProtectedRoute>
        } />
         <Route path="/interestdetails" element={
          <ProtectedRoute>
          <DashboardLayout>
            <InterestDetailsPage/>
          </DashboardLayout>
          </ProtectedRoute>
        } />

          <Route path="/viewinterestdetails/:id" element={
            <ProtectedRoute>
          <DashboardLayout>
            <ViewInterestPage/>
          </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/add-jewellery/:customerId" element={
          <ProtectedRoute>
          <DashboardLayout>
            <AddJewellery/>
          </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/closeloan/:customerId/:itemCode" element={
          <ProtectedRoute>
          <DashboardLayout>
            <CloseLoan/>
          </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/loandetails/:customerId/:itemCode" element={
    <ProtectedRoute>
    <DashboardLayout>
      <LoanDetails />
    </DashboardLayout>
    </ProtectedRoute>
  } 
/>

      </Routes>

       {/* ✅ Add this to show all toasts anywhere in app */}
      <ToastContainer 
        newestOnTop={true} 
        closeOnClick 
        pauseOnFocusLoss 
        draggable 
      />

      
    </Router>
  );
}

export default App;
