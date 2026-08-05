import { useEffect, useState } from "react";

import {
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getUsers,
} from "../services/api";

import CustomerTable from "../components/CustomerTable";
import CustomerForm from "../components/CustomerForm";


function Customers() {

    const [customers, setCustomers] = useState([]);

    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 10;


    // ==========================================
    // NEW - EMPLOYEE FILTER
    // ==========================================

    const [users, setUsers] = useState([]);

    const [selectedEmployee, setSelectedEmployee] = useState("");


    // ==========================================
    // LOGGED IN USER
    // ==========================================

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


    // ==========================================
    // FETCH CUSTOMERS
    // ==========================================

    const fetchCustomers = async (
        employeeId = selectedEmployee
    ) => {

        try {

            const res = await getCustomers(
                "Customer",
                isAdmin ? employeeId : ""
            );

            setCustomers(res.data);

        } catch (err) {

            console.error(
                "Fetch customers error:",
                err
            );

        }

    };


    // ==========================================
    // FETCH EMPLOYEES
    // ADMIN ONLY
    // ==========================================

    const fetchUsers = async () => {

        if (!isAdmin) return;

        try {

            const res = await getUsers();

            setUsers(res.data);

        } catch (err) {

            console.error(
                "Fetch users error:",
                err
            );

        }

    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        fetchCustomers();

        if (isAdmin) {
            fetchUsers();
        }

    }, []);


    // ==========================================
    // ADMIN EMPLOYEE FILTER
    // ==========================================

    const handleEmployeeFilter = async (
        employeeId
    ) => {

        setSelectedEmployee(employeeId);

        setCurrentPage(1);

        await fetchCustomers(employeeId);

    };


    // ==========================================
    // EDIT CUSTOMER
    // ==========================================

    const handleEdit = (customer) => {

        setEditingCustomer(customer);

        setShowForm(true);

    };


    // ==========================================
    // DELETE CUSTOMER
    // ==========================================

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Delete this customer?"
            )
        ) {
            return;
        }

        try {

            await deleteCustomer(id);

            await fetchCustomers();

        } catch (err) {

            console.log(err);

        }

    };


    // ==========================================
    // ADD / UPDATE CUSTOMER
    // ==========================================

    const handleSubmit = async (customer) => {
        try {
            if (editingCustomer) {
                console.log("Updating customer:", editingCustomer.id, customer);

                const res = await updateCustomer(
                    editingCustomer.id,
                    customer
                );

                console.log("Update response:", res.data);
            } else {
                console.log("Adding customer:", customer);

                const res = await addCustomer({
                    ...customer,
                    customer_type: "Customer",
                });

                console.log("Add response:", res.data);
            }

            await fetchCustomers();

            setEditingCustomer(null);
            setShowForm(false);

        } catch (err) {
            console.error(
                "Customer save error:",
                err.response?.data || err
            );

            alert(
                err.response?.data?.message ||
                "Customer save failed"
            );
        }
    };

    // ==========================================
    // SEARCH
    // ==========================================

    const filteredCustomers = customers.filter(
        (customer) => {

            const searchValue =
                search.toLowerCase();

            return (

                customer.name
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                customer.phone
                    ?.toString()
                    .includes(search)

                ||

                customer.location
                    ?.toLowerCase()
                    .includes(searchValue)

            );

        }
    );


    // ==========================================
    // PAGINATION
    // ==========================================

    const indexOfLastCustomer =
        currentPage * customersPerPage;

    const indexOfFirstCustomer =
        indexOfLastCustomer - customersPerPage;


    const currentCustomers =
        filteredCustomers.slice(
            indexOfFirstCustomer,
            indexOfLastCustomer
        );


    const totalPages = Math.ceil(
        filteredCustomers.length /
        customersPerPage
    );


    // ==========================================
    // UI
    // ==========================================

    return (

        <div>


            {/* ==================================
                HEADER
            ================================== */}

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Customers
                </h1>


                <div className="flex gap-4">


                    {/* ===========================
                        ADMIN EMPLOYEE FILTER
                    =========================== */}

                    {isAdmin && (

                        <select

                            value={selectedEmployee}

                            onChange={(e) =>
                                handleEmployeeFilter(
                                    e.target.value
                                )
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
                                        user.role
                                            ?.toLowerCase() === "user"
                                        &&
                                        user.status
                                            ?.toLowerCase() === "active"
                                )

                                .map((user) => (

                                    <option
                                        key={user.id}
                                        value={user.id}
                                    >
                                        {user.name ||
                                            user.username}
                                    </option>

                                ))}

                        </select>

                    )}


                    {/* ===========================
                        SEARCH
                    =========================== */}

                    <input

                        type="text"

                        placeholder="🔍 Search Customers..."

                        value={search}

                        onChange={(e) => {

                            setSearch(
                                e.target.value
                            );

                            setCurrentPage(1);

                        }}

                        className="
                            border
                            rounded-lg
                            px-4
                            py-2
                            w-72
                            focus:ring-2
                            focus:ring-blue-500
                            outline-none
                        "
                    />


                    {/* ===========================
                        ADD CUSTOMER
                        Existing button preserved
                    =========================== */}

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

                        + Add Customer

                    </button>

                </div>

            </div>


            {/* ==================================
                CUSTOMER FORM
            ================================== */}

            {showForm && (

                <CustomerForm

                    onSubmit={handleSubmit}

                    editingCustomer={
                        editingCustomer
                    }

                    cancelEdit={() => {

                        setEditingCustomer(null);

                        setShowForm(false);

                    }}

                />

            )}


            {/* ==================================
                CUSTOMER TABLE
            ================================== */}

            <CustomerTable

                customers={
                    currentCustomers
                }

                emptyMessage="No Customers Found"

                emptySubMessage="Add your first customer to get started."

                onEdit={handleEdit}

                onDelete={handleDelete}

            />


            {/* ==================================
                PAGINATION
            ================================== */}

            {totalPages > 0 && (

                <div className="flex justify-center items-center gap-2 mt-6">


                    <button

                        onClick={() =>
                            setCurrentPage(
                                currentPage - 1
                            )
                        }

                        disabled={
                            currentPage === 1
                        }

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
                                    setCurrentPage(
                                        index + 1
                                    )
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
                            setCurrentPage(
                                currentPage + 1
                            )
                        }

                        disabled={
                            currentPage ===
                            totalPages
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

export default Customers;