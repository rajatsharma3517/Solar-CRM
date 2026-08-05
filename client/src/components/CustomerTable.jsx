import {
  Pencil,
  Trash2,
  UserCheck,
  UserRound,
} from "lucide-react";

import { Link } from "react-router-dom";

function CustomerTable({
  customers,
  onEdit,
  onDelete,
  onConvert,

  // NEW - Lead Assignment
  users = [],
  onAssign,
  isAdmin = false,
  showAssignment = false,

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

          {/* ================= TABLE HEADER ================= */}

          <thead className="bg-slate-900 text-white">

            <tr>

              <th className="px-5 py-4 text-left">
                ID
              </th>

              <th className="px-5 py-4 text-left">
                Name
              </th>

              <th className="px-5 py-4 text-left">
                Phone
              </th>

              <th className="px-5 py-4 text-left">
                Location
              </th>

              <th className="px-5 py-4 text-left">
                Watts
              </th>

              <th className="px-5 py-4 text-left">
                House Size
              </th>

              <th className="px-5 py-4 text-left">
                Status
              </th>


              {/* NEW - Assigned To Column */}
              {showAssignment && (
                <th className="px-5 py-4 text-left">
                  Assigned To
                </th>
              )}


              <th className="px-5 py-4 text-left">
                Actions
              </th>

            </tr>

          </thead>


          {/* ================= TABLE BODY ================= */}

          <tbody>

            {customers.map((customer) => (

              <tr
                key={customer.id}
                className="border-b hover:bg-gray-50 transition"
              >

                {/* ID */}

                <td className="px-5 py-4">
                  {customer.id}
                </td>


                {/* NAME */}

                <td className="px-5 py-4 font-semibold">

                  <Link
                    to={`/customer/${customer.id}`}
                    className="text-slate-800 hover:text-blue-600 hover:underline transition-colors"
                  >
                    {customer.name}
                  </Link>

                </td>


                {/* PHONE */}

                <td className="px-5 py-4">
                  {customer.phone}
                </td>


                {/* LOCATION */}

                <td className="px-5 py-4">
                  {customer.location}
                </td>


                {/* WATTS */}

                <td className="px-5 py-4">
                  {customer.required_watts}
                </td>


                {/* HOUSE SIZE */}

                <td className="px-5 py-4">
                  {customer.house_size}
                </td>


                {/* STATUS */}

                <td className="px-5 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      customer.status === "Pending"
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


                {/* ========================================
                    NEW - ASSIGNED TO
                ======================================== */}

                {showAssignment && (

                  <td className="px-5 py-4">

                    {isAdmin ? (

                      // ADMIN CAN CHANGE ASSIGNMENT
                      <select
                        value={customer.assigned_to || ""}
                        onChange={(e) =>
                          onAssign(
                            customer.id,
                            e.target.value
                          )
                        }
                        className="
                          min-w-40
                          rounded-lg
                          border
                          border-gray-300
                          bg-white
                          px-3
                          py-2
                          text-sm
                          text-slate-700
                          outline-none
                          transition
                          focus:border-blue-500
                          focus:ring-2
                          focus:ring-blue-100
                        "
                      >

                        <option value="">
                          Unassigned
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

                    ) : (

                      // NORMAL USER - READ ONLY
                      <div className="flex items-center gap-2 text-sm text-slate-600">

                        <UserRound
                          size={17}
                          className="text-slate-400"
                        />

                        <span>
                          {customer.assigned_user_name ||
                            "Unassigned"}
                        </span>

                      </div>

                    )}

                  </td>

                )}


                {/* ================= ACTIONS ================= */}

                <td className="px-5 py-4">

                  <div className="flex gap-2">

                    {/* EDIT */}

                    <button
                      onClick={() => onEdit(customer)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition"
                    >
                      <Pencil size={18} />
                    </button>


                    {/* DELETE */}

                    <button
                      onClick={() => onDelete(customer.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>


                    {/* CONVERT / CUSTOMER */}

                    {customer.customer_type === "Customer" ? (

                      <span className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold">
                        Customer
                      </span>

                    ) : (

                      <button
                        onClick={() =>
                          onConvert(customer.id)
                        }
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