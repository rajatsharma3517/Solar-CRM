import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Phone,
    MapPin,
    Mail,
} from "lucide-react";
import FollowUpCard from "../components/FollowUpCard";

import { getCustomerById } from "../services/api";
import DocumentCard from "../components/DocumentCard";

function CustomerProfile() {
    const { id } = useParams();

    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        fetchCustomer();
    }, []);

    const fetchCustomer = async () => {
        try {
            const res = await getCustomerById(id);
            setCustomer(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    if (!customer) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold">
                    Loading...
                </h2>
            </div>
        );
    }

    return (
        <div className="p-8">

            {/* Back Button */}

            <Link
                to="/customers"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
            >
                <ArrowLeft size={20} />
                Back to Customers
            </Link>

            {/* Header */}

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-4xl font-bold">
                        {customer.name}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Customer Profile
                    </p>

                </div>

                <div className="flex gap-3">

                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                        {customer.customer_type}
                    </span>

                    <span
                        className={`px-4 py-2 rounded-full font-semibold
                        ${customer.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : customer.status === "Contacted"
                                    ? "bg-blue-100 text-blue-700"
                                    : customer.status === "Completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                            }`}
                    >
                        {customer.status}
                    </span>

                </div>



                <div className="flex gap-3 mt-5">

                    <button
                        onClick={() => {
                            const message = `Hello ${customer.name},

We are contacting you regarding your solar enquiry.`;

                            window.open(
                                `https://wa.me/91${customer.phone}?text=${encodeURIComponent(message)}`,
                                "_blank"
                            );
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                        💬 WhatsApp
                    </button>

                    <a
                        href={`tel:${customer.phone}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                        <Phone size={18} />
                        Call
                    </a>

                    <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(customer.location)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                        <MapPin size={18} />
                        Maps
                    </a>

                    <a
                        href={`mailto:${customer.email}`}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                        <Mail size={18} />
                        Email
                    </a>

                </div>



            </div>

            {/* Customer Information */}

            <div className="bg-white rounded-2xl shadow-lg p-8">

                <h2 className="text-2xl font-bold mb-8">
                    Customer Information
                </h2>

                <div className="grid grid-cols-2 gap-8">

                    <div>
                        <p className="text-gray-500 mb-1">
                            Phone
                        </p>

                        <p className="font-semibold text-lg">
                            {customer.phone}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 mb-1">
                            Email
                        </p>

                        <p className="font-semibold text-lg">
                            {customer.email || "No Email"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 mb-1">
                            Location
                        </p>

                        <p className="font-semibold text-lg">
                            {customer.location}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 mb-1">
                            Required Watts
                        </p>

                        <p className="font-semibold text-lg">
                            {customer.required_watts} KW
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 mb-1">
                            House Size
                        </p>

                        <p className="font-semibold text-lg">
                            {customer.house_size}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 mb-1">
                            Customer Type
                        </p>

                        <p className="font-semibold text-lg">
                            {customer.customer_type}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 mb-1">
                            Status
                        </p>

                        <p className="font-semibold text-lg">
                            {customer.status}
                        </p>
                    </div>

                    <div className="col-span-2">

                        <p className="text-gray-500 mb-1">
                            Notes
                        </p>

                        <p className="font-semibold text-lg">
                            {customer.notes || "No notes available"}
                        </p>

                    </div>

                </div>

            </div>
            {/* Documents */}

            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

                <h2 className="text-2xl font-bold mb-8">
                    Customer Documents
                </h2>

                <div className="space-y-5">

                    <DocumentCard
                        title="Aadhaar Card"
                        documentType="aadhaar"
                        filePath={customer.aadhaar_path}
                        customerId={id}
                        refreshCustomer={fetchCustomer}
                    />

                    <DocumentCard
                        title="PAN Card"
                        documentType="pan"
                        filePath={customer.pan_path}
                        customerId={id}
                        refreshCustomer={fetchCustomer}
                    />

                    <DocumentCard
                        title="Property Registry"
                        documentType="registry"
                        filePath={customer.registry_path}
                        customerId={id}
                        refreshCustomer={fetchCustomer}
                    />

                    <DocumentCard
                        title="Quotation"
                        documentType="quotation"
                        filePath={customer.quotation_path}
                        customerId={id}
                        refreshCustomer={fetchCustomer}
                    />

                    <DocumentCard
                        title="Roof Images"
                        documentType="roof"
                        filePath={customer.roof_image_path}
                        customerId={id}
                        refreshCustomer={fetchCustomer}
                    />

                </div>

            </div>
            <FollowUpCard customerId={id} />
        </div>
    );
}

export default CustomerProfile;