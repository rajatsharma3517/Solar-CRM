import { useEffect, useState } from "react";

import DashboardCards from "../components/DashboardCards";
import { CalendarDays, Users, Activity } from "lucide-react";
import { getOverdueFollowups } from "../services/api";
import { useNavigate } from "react-router-dom";


import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  convertToCustomer,
  getTodayFollowups,
  getRecentLeads,
  getRecentActivities,
} from "../services/api";

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [overdue, setOverdue] = useState([]);
  const [todayFollowups, setTodayFollowups] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [activities, setActivities] = useState([]);

  const customersPerPage = 5;
  const navigate = useNavigate();


  // Load Customers
  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOverdue = async () => {
    try {
      const res = await getOverdueFollowups();
      setOverdue(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchOverdue();
  }, []);

  const fetchTodayFollowups = async () => {
    try {
      const res = await getTodayFollowups();
      setTodayFollowups(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchOverdue();
    fetchTodayFollowups();
  }, []);

  const fetchRecentLeads = async () => {
    try {
      const res = await getRecentLeads();
      setRecentLeads(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchOverdue();
    fetchTodayFollowups();
    fetchRecentLeads();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      const res = await getRecentActivities();
      setActivities(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchOverdue();
    fetchTodayFollowups();
    fetchRecentLeads();
    fetchRecentActivities();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search)
    );
  });

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;

  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const totalPages = Math.ceil(
    filteredCustomers.length / customersPerPage
  );

  // Add or Update Customer
  const handleSubmit = async (customer) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, customer);
        setEditingCustomer(null);
      } else {
        await addCustomer(customer);
      }

      fetchCustomers();
    } catch (err) {
      console.log(err);
    }
  };

  // Edit Customer
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingCustomer(null);
  };

  // Delete Customer
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCustomer(id);
      fetchCustomers();
    } catch (err) {
      console.log(err);
    }
  };

  // Convert Lead to Customer
  const handleConvert = async (id) => {
    const confirmConvert = window.confirm(
      "Convert this Lead into a Customer?"
    );

    if (!confirmConvert) return;

    try {
      await convertToCustomer(id);
      fetchCustomers();
      alert("Lead converted to Customer successfully!");
    } catch (err) {
      console.log(err);
      alert("Failed to convert lead.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">

        <DashboardCards customers={customers} />

        <div className="mt-8">
          <h1 className="text-3xl font-bold">
            Welcome Back, Rajat 👋
          </h1>

          <p className="text-gray-500 mt-2">
            Here's what's happening in your CRM today.
          </p>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow p-6">

          <div className="flex justify-between items-center mb-5">

            <div>
              <h2 className="text-2xl font-bold text-red-600">
                🔥 Overdue Follow-ups
              </h2>

              <p className="text-gray-500">
                Customers waiting for follow-up
              </p>
            </div>

            <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold">
              {overdue.length}
            </span>

          </div>

          {overdue.length === 0 ? (

            <div className="text-center text-gray-500 py-8">
              🎉 No overdue follow-ups
            </div>

          ) : (

            <div className="space-y-4">

              {overdue.map((item) => (

                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-4"
                >

                  <div>

                    <h3 className="font-semibold text-lg">
                      {item.name}
                    </h3>

                    <p className="text-gray-500">
                      📞 {item.phone}
                    </p>

                    <p className="text-red-500 text-sm mt-1">
                      Pending since {new Date(item.followup_date).toLocaleDateString()}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      window.open(`https://wa.me/91${item.phone}`)
                    }
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
                  >
                    WhatsApp
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* Today's Follow-ups */}

          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-bold flex items-center gap-2">
                <CalendarDays className="text-blue-600" />
                Today's Follow-ups
              </h2>

              <button
                onClick={() => navigate("/followups")}
                className="text-blue-600 font-semibold hover:underline"
              >
                View All →
              </button>

            </div>

            {todayFollowups.length === 0 ? (

              <div className="text-center py-10 text-gray-500">
                🎉 No follow-ups scheduled for today.
              </div>

            ) : (

              <div className="space-y-4">

                {todayFollowups.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4 last:border-none last:mb-0"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>

                      <p className="text-gray-500 text-sm mt-1">
                        {item.notes || "Scheduled Follow-up"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-blue-600 font-semibold">
                        {new Date(`1970-01-01T${item.followup_time}`).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      <button
                        onClick={() => window.open(`https://wa.me/91${item.phone}`, "_blank")}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition"
                      >
                        WhatsApp
                      </button>
                    </div>
                  </div>
                ))}

              </div>

            )}

          </div>

          {/* Recent Leads */}

          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-bold flex items-center gap-2">

                <Users className="text-green-600" />

                Recent Leads

              </h2>

              <button
                onClick={() => navigate("/leads")}
                className="text-blue-600 font-semibold hover:underline"
              >
                View All →
              </button>

            </div>

            <div className="space-y-4">

              {recentLeads.length === 0 ? (

                <div className="text-center py-10 text-gray-500">
                  No Recent Leads
                </div>

              ) : (

                recentLeads.map((lead) => (

                  <div
                    key={lead.id}
                    className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-none"
                  >

                    <div>

                      <h3 className="font-semibold text-lg">
                        {lead.name}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        📞 {lead.phone}
                      </p>

                      <p className="text-gray-400 text-xs mt-1">
                        📍 {lead.location}
                      </p>

                    </div>

                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                      Lead
                    </span>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-6 mt-8">

          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">

            <Activity className="text-orange-500" />

            Recent Activities

          </h2>

          <div className="space-y-4">

            {activities.length === 0 ? (

              <div className="text-center py-8 text-gray-500">
                No Recent Activities
              </div>

            ) : (

              activities.map((item) => (

                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-none"
                >

                  <div>

                    <h3 className="font-semibold">
                      {item.name || "System"}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {item.activity}
                    </p>

                  </div>

                  <span className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>

                </div>

              ))

            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;