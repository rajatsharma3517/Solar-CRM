import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck2,
  UserCog,
} from "lucide-react";

function Sidebar() {

  // Logged-in user ko localStorage se nikalo
  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  // Check karo logged-in user Admin hai ya nahi
  const isAdmin =
    user?.role?.toLowerCase() === "admin";


  // Normal CRM menu
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Leads",
      path: "/leads",
      icon: <Users size={20} />,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: <UserCheck size={20} />,
    },
    {
      name: "Follow-ups",
      path: "/followups",
      icon: <CalendarCheck2 size={20} />,
    },
  ];


  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-5">

      {/* Logo */}
      <h1 className="text-4xl font-bold mb-10">
        Solar CRM
      </h1>


      {/* Main Menu */}
      <div className="flex flex-col gap-2">

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-700"
              }`
            }
          >
            {item.icon}

            {item.name}
          </NavLink>

        ))}


        {/* ADMIN ONLY */}

        {isAdmin && (
          <>
            {/* Divider */}
            <div className="my-4 border-t border-slate-700"></div>

            <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Administration
            </p>

            <NavLink
              to="/manage-users"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-slate-700"
                }`
              }
            >
              <UserCog size={20} />

              Manage Users
            </NavLink>
          </>
        )}

      </div>

    </div>
  );
}

export default Sidebar;