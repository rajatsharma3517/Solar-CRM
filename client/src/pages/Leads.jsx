import { useEffect, useState } from "react";

import {
    getCustomers,
    convertToCustomer,
    addCustomer,
    deleteCustomer,
    updateCustomer,
    getUsers,
    assignCustomer,
} from "../services/api";

import CustomerForm from "../components/CustomerForm";
import CustomerTable from "../components/CustomerTable";

function Leads() {
    const [leads, setLeads] = useState([]);
    const [users, setUsers] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const leadsPerPage = 5;

    // Logged-in user
    const storedUser = localStorage.getItem("user");

    let loggedInUser = null;

    try {
        loggedInUser = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch {
        loggedInUser = null;
    }

    const isAdmin =
        loggedInUser?.role?.toLowerCase() === "admin";


    // =========================================
    // FETCH LEADS
    // =========================================

    const fetchLeads = async (employeeId = selectedEmployee) => {
        try {
            const res = await getCustomers(
                "Lead",
                isAdmin ? employeeId : ""
            );

            setLeads(res.data);
        } catch (err) {
            console.error("Fetch leads error:", err);
        }
    };


    // =========================================
    // FETCH EMPLOYEES
    // Only Admin can call /api/users
    // =========================================

    const fetchUsers = async () => {
        if (!isAdmin) return;

        try {
            const res = await getUsers();

            setUsers(res.data);
        } catch (err) {
            console.error("Fetch users error:", err);
        }
    };


    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {
        fetchLeads();

        if (isAdmin) {
            fetchUsers();
        }
    }, []);


    // =========================================
    // SEARCH
    // =========================================

    const filteredLeads = leads.filter((lead) => {
        const searchValue = search.toLowerCase();

        return (
            lead.name
                ?.toLowerCase()
                .includes(searchValue) ||

            lead.phone
                ?.toString()
                .includes(search) ||

            lead.location
                ?.toLowerCase()
                .includes(searchValue)
        );
    });


    // =========================================
    // PAGINATION
    // =========================================

    const indexOfLastLead =
        currentPage * leadsPerPage;

    const indexOfFirstLead =
        indexOfLastLead - leadsPerPage;

    const currentLeads = filteredLeads.slice(
        indexOfFirstLead,
        indexOfLastLead
    );

    const totalPages = Math.ceil(
        filteredLeads.length / leadsPerPage
    );


    // =========================================
    // ASSIGN LEAD
    // =========================================

    const handleAssign = async (
        customerId,
        userId
    ) => {
        try {
            await assignCustomer(
                customerId,
                Number(userId)
            );

            // Refresh leads so latest assignment appears
            await fetchLeads();

            alert("Lead assigned successfully");
        } catch (err) {
            console.error(
                "Lead assignment error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Lead assignment failed"
            );
        }
    };

    const handleEmployeeFilter = async (employeeId) => {
        setSelectedEmployee(employeeId);
        setCurrentPage(1);

        await fetchLeads(employeeId);
    };


    // =========================================
    // CONVERT LEAD
    // =========================================

    const handleConvert = async (id) => {
        try {
            await convertToCustomer(id);

            await fetchLeads();

            alert("Lead converted successfully");
        } catch (err) {
            console.error(err);

            alert("Conversion failed");
        }
    };


    // =========================================
    // EDIT
    // =========================================

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
    };


    // =========================================
    // DELETE
    // =========================================

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this lead?")) {
            return;
        }

        try {
            await deleteCustomer(id);

            await fetchLeads();
        } catch (err) {
            console.error(err);

            alert("Delete failed");
        }
    };


    // =========================================
    // ADD / UPDATE LEAD
    // =========================================

    const handleSubmit = async (customer) => {
        try {
            if (editingCustomer) {
                await updateCustomer(
                    editingCustomer.id,
                    customer
                );
            } else {
                await addCustomer(customer);
            }

            await fetchLeads();

            setShowForm(false);
            setEditingCustomer(null);
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div>

            {/* =====================================
          HEADER
      ===================================== */}

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Leads
                </h1>

                <div className="flex items-center gap-4">

                    {isAdmin && (
                        <select
                            value={selectedEmployee}
                            onChange={(e) =>
                                handleEmployeeFilter(e.target.value)
                            }
                            className="
      border
      border-gray-300
      rounded-lg
      px-4
      py-2
      bg-white
      text-slate-700
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
    "
                        >
                            <option value="">
                                All Employees
                            </option>

                            {users
                                .filter(
                                    (user) =>
                                        user.role?.toLowerCase() === "user" &&
                                        user.status?.toLowerCase() === "active"
                                )
                                .map((user) => (
                                    <option
                                        key={user.id}
                                        value={user.id}
                                    >
                                        {user.name || user.username}
                                    </option>
                                ))}
                        </select>
                    )}

                    <input
                        type="text"
                        placeholder="🔍 Search Leads..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="
              border
              rounded-lg
              px-4
              py-2
              w-72
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
                    />

                    <button
                        onClick={() => {
                            setEditingCustomer(null);
                            setShowForm(true);
                        }}
                        className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-2
              rounded-lg
            "
                    >
                        + Add Lead
                    </button>

                </div>

            </div>


            {/* =====================================
          CUSTOMER FORM
      ===================================== */}

            {showForm && (
                <CustomerForm
                    onSubmit={handleSubmit}
                    editingCustomer={editingCustomer}
                    cancelEdit={() => {
                        setEditingCustomer(null);
                        setShowForm(false);
                    }}
                />
            )}


            {/* =====================================
          LEADS TABLE
      ===================================== */}

            <CustomerTable
                customers={currentLeads}
                emptyMessage="No Leads Found"
                emptySubMessage="Add your first lead to get started."
                onConvert={handleConvert}
                onEdit={handleEdit}
                onDelete={handleDelete}

                users={users}
                onAssign={handleAssign}
                isAdmin={isAdmin}
                showAssignment={true}
            />


            {/* =====================================
          PAGINATION
      ===================================== */}

            {totalPages > 0 && (
                <div className="flex justify-center items-center gap-2 mt-6">

                    <button
                        onClick={() =>
                            setCurrentPage((page) => page - 1)
                        }
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg ${currentPage === 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                    >
                        Previous
                    </button>


                    {[...Array(totalPages)].map(
                        (_, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    setCurrentPage(index + 1)
                                }
                                className={`px-4 py-2 rounded-lg ${currentPage === index + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        )
                    )}


                    <button
                        onClick={() =>
                            setCurrentPage((page) => page + 1)
                        }
                        disabled={
                            currentPage === totalPages
                        }
                        className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                    >
                        Next
                    </button>

                </div>
            )}

        </div>
    );
}

export default Leads;