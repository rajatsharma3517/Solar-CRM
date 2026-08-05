import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Sun,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  // Logged-in user ko localStorage se lao
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  // User details
  const name = user?.name || user?.username || "User";
  const role = user?.role || "User";
  const email = user?.email || "";

  // Example:
  // Rajat Sharma -> RS
  // Gaurav -> G
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <nav className="relative z-50 bg-slate-900 shadow-lg">
      <div className="px-8 py-4 flex justify-between items-center">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-8">

          {/* Page Heading */}
          <div>
            <h1 className="text-3xl font-bold text-white">
              Home
            </h1>

            <p className="text-slate-400 text-sm">
              Customer Management Dashboard
            </p>
          </div>

          {/* Search */}
          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search Customers, Leads..."
              className="
                w-96
                pl-10
                pr-4
                py-2
                rounded-xl
                bg-slate-800
                border
                border-slate-700
                text-white
                placeholder:text-slate-400
                focus:outline-none
                focus:ring-2
                focus:ring-yellow-400
              "
            />

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5">

          {/* Notifications */}
          <button className="relative">

            <Bell
              size={22}
              className="
                text-white
                hover:text-yellow-400
                transition
              "
            />

            <span
              className="
                absolute
                -top-2
                -right-2
                bg-red-500
                text-white
                text-xs
                w-5
                h-5
                rounded-full
                flex
                items-center
                justify-center
              "
            >
              3
            </span>

          </button>


          {/* Theme Button */}
          <button
            className="
              bg-yellow-400
              hover:bg-yellow-500
              transition
              p-2
              rounded-full
            "
          >
            <Sun size={18} />
          </button>


          {/* PROFILE */}
          <div className="relative">

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="
                flex
                items-center
                gap-3
                rounded-xl
                p-1
                transition
                hover:bg-slate-800
              "
            >

              {/* User Details */}
              <div className="text-right">

                <h2 className="text-white font-semibold">
                  {name}
                </h2>

                <p className="text-slate-400 text-sm">
                  {role.toLowerCase() === "admin"
                    ? "Administrator"
                    : "User"}
                </p>

              </div>


              {/* Avatar */}
              <div
                className="
                  w-11
                  h-11
                  rounded-full
                  border-2
                  border-yellow-400
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  font-semibold
                "
              >
                {initials}
              </div>


              {/* Arrow */}
              <ChevronDown
                size={18}
                className={`
                  text-white
                  transition-transform
                  duration-200
                  ${profileOpen ? "rotate-180" : ""}
                `}
              />

            </button>


            {/* DROPDOWN */}
            {profileOpen && (

              <div
                className="
                  absolute
                  right-0
                  mt-3
                  w-64
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-2xl
                "
              >

                {/* User Info */}
                <div className="px-5 py-4 border-b border-slate-200">

                  <p className="font-semibold text-slate-900">
                    {name}
                  </p>

                  {email && (
                    <p className="text-sm text-slate-500 truncate">
                      {email}
                    </p>
                  )}

                  <span
                    className="
                      inline-block
                      mt-2
                      rounded-full
                      bg-blue-50
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      text-blue-600
                    "
                  >
                    {role.toLowerCase() === "admin"
                      ? "Administrator"
                      : "User"}
                  </span>

                </div>


                {/* Profile */}
                <button
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-5
                    py-3
                    text-slate-700
                    hover:bg-slate-50
                    transition
                  "
                >
                  <User size={18} />

                  My Profile
                </button>


                {/* Settings */}
                <button
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-5
                    py-3
                    text-slate-700
                    hover:bg-slate-50
                    transition
                  "
                >
                  <Settings size={18} />

                  Account Settings
                </button>


                {/* Logout */}
                <div className="border-t border-slate-200">

                  <button
                    onClick={handleLogout}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-5
                      py-3
                      text-red-600
                      hover:bg-red-50
                      transition
                      font-medium
                    "
                  >
                    <LogOut size={18} />

                    Sign Out
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;