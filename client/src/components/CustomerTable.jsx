import { Pencil, Trash2, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

function CustomerTable({
  customers,
  onEdit,
  onDelete,
  onConvert,
  emptyMessage = "No Customers Found",
  emptySubMessage = "Add your first customer to get started.",
}) {
  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        <h2 className="text-2xl font-bold text-gray-600">
          {emptyMessage}
        </h2>

        <p className="text-gray-400 mt-2">
          {emptySubMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-5 py-4 text-left">ID</th>
              <th className="px-5 py-4 text-left">Name</th>
              <th className="px-5 py-4 text-left">Phone</th>
              <th className="px-5 py-4 text-left">Location</th>
              <th className="px-5 py-4 text-left">Watts</th>
              <th className="px-5 py-4 text-left">House Size</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-5 py-4">{customer.id}</td>

                <td className="px-5 py-4 font-semibold">
                  <Link
                    to={`/customer/${customer.id}`}
                    className="text-slate-800 hover:text-blue-600 hover:underline transition-colors"
                  >
                    {customer.name}
                  </Link>
                </td>

                <td className="px-5 py-4">
                  {customer.phone}
                </td>

                <td className="px-5 py-4">
                  {customer.location}
                </td>

                <td className="px-5 py-4">
                  {customer.required_watts}
                </td>

                <td className="px-5 py-4">
                  {customer.house_size}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold
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
                </td>

                <td className="px-5 py-4">
                  <div className="flex gap-2">

                    <button
                      onClick={() => onEdit(customer)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(customer.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>

                    {customer.customer_type === "Customer" ? (
                      <span className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold">
                        Customer
                      </span>
                    ) : (
                      <button
                        onClick={() => onConvert(customer.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 rounded-lg transition flex items-center gap-1"
                      >
                        <UserCheck size={16} />
                        Convert
                      </button>
                    )}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerTable;