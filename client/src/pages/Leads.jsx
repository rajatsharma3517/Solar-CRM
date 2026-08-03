import { useEffect, useState } from "react";
import {
    getCustomers,
    convertToCustomer,
    addCustomer,
    deleteCustomer,
    updateCustomer,
} from "../services/api";
import CustomerForm from "../components/CustomerForm";


import CustomerTable from "../components/CustomerTable";

function Leads() {

    const [leads, setLeads] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const leadsPerPage = 5;

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        const res = await getCustomers("Lead");
        setLeads(res.data);
    };

    const filteredLeads = leads.filter((lead) => {
        return (
            lead.name.toLowerCase().includes(search.toLowerCase()) ||
            lead.phone.includes(search) ||
            lead.location.toLowerCase().includes(search.toLowerCase())
        );
    });

    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;

    const currentLeads = filteredLeads.slice(
        indexOfFirstLead,
        indexOfLastLead
    );

    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

    const handleConvert = async (id) => {
        try {
            await convertToCustomer(id);

            fetchLeads();

            alert("Lead converted successfully");
        } catch (err) {
            console.log(err);
            alert("Conversion failed");
        }
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this lead?")) return;

        try {
            await deleteCustomer(id);
            fetchLeads();
        } catch (err) {
            console.log(err);
            alert("Delete failed");
        }
    };
    const handleSubmit = async (customer) => {
        try {

            if (editingCustomer) {
                await updateCustomer(editingCustomer.id, customer);
            } else {
                await addCustomer(customer);
            }

            fetchLeads();
            setShowForm(false);
            setEditingCustomer(null);

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Leads
                </h1>

                <div className="flex items-center gap-4">

                    <input
                        type="text"
                        placeholder="🔍 Search Leads..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                    >
                        + Add Lead
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
                customers={currentLeads}
                emptyMessage="No Leads Found"
                emptySubMessage="Add your first lead to get started."
                onConvert={handleConvert}
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

export default Leads;