import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import Layout from "./layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageUsers from "./pages/ManageUsers";
import AdminRoute from "./components/AdminRoute";

import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Customers from "./pages/Customers";
import CustomerProfile from "./pages/CustomerProfile";
import FollowUps from "./pages/FollowUps";

function App() {
  return (
    <Routes>

      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected CRM Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/followups" element={<FollowUps />} />
        <Route path="/customer/:id" element={<CustomerProfile />} />
        <Route
          path="/manage-users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />

      </Route>

    </Routes>
  );
}

export default App;