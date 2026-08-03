import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck2,
} from "lucide-react";


function Sidebar() {
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
      <h1 className="text-4xl font-bold mb-10">
        Solar CRM
      </h1>

      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${isActive
                ? "bg-blue-600"
                : "hover:bg-slate-700"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;