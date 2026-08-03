import { useEffect, useState } from "react";
import { getCustomers, addCustomer, updateCustomer, deleteCustomer, } from "../services/api";
import CustomerTable from "../components/CustomerTable";
import CustomerForm from "../components/CustomerForm";

function Customers() {

    const [customers, setCustomers] = useState([]);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 10;

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        const res = await getCustomers("Customer");
        setCustomers(res.data);
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this customer?")) return;

        try {
            await deleteCustomer(id);
            fetchCustomers();
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (customer) => {
        try {
            await updateCustomer(editingCustomer.id, customer);

            fetchCustomers();

            setEditingCustomer(null);
            setShowForm(false);
        } catch (err) {
            console.log(err);
        }
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search) ||
        customer.location.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;

    const currentCustomers = filteredCustomers.slice(
        indexOfFirstCustomer,
        indexOfLastCustomer
    );

    const totalPages = Math.ceil(
        filteredCustomers.length / customersPerPage
    );

    return (
        <div>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Customers
                </h1>

                <div className="flex gap-4">

                    <input
                        type="text"
                        placeholder="🔍 Search Customers..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border rounded-lg px-4 py-2 w-72 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <button
                        onClick={() => {
                            setEditingCustomer(null);
                            setShowForm(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                    >
                        + Add Customer
                    </button>

                </div>

            </div>

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

            <CustomerTable
                customers={currentCustomers}
                emptyMessage="No Customers Found"
                emptySubMessage="Add your first customer to get started."
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <div className="flex justify-center items-center gap-2 mt-6">

                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${currentPage === 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    Previous
                </button>

                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 rounded-lg ${currentPage === index + 1
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    Next
                </button>

            </div>

        </div>
    );
}

export default Customers;