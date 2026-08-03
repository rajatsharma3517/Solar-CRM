import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import Layout from "./layout/Layout";

import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Customers from "./pages/Customers";
import CustomerProfile from "./pages/CustomerProfile";
import FollowUps from "./pages/FollowUps";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/followups" element={<FollowUps />} />
        <Route path="/customer/:id" element={<CustomerProfile />} />
      </Route>
    </Routes>
  );
}

export default App;