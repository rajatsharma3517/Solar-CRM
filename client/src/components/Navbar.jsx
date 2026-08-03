import {
  Sun,
  Search,
  Bell,
  Bot,
  ChevronDown,
} from "lucide-react";



function Navbar() {
  return (
    <nav className="bg-slate-900 shadow-lg">
      <div className="px-8 py-4 flex justify-between items-center">

        {/* Left */}
        <div className="flex items-center gap-8">

          {/* Logo */}
          <div>
            <h1 className="text-3xl font-bold text-white">
              <span className="text-white-400">Home</span>
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
              className="w-96 pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          {/* Notifications */}
          <button className="relative">

            <Bell
              size={22}
              className="text-white mr-0.5 mt-0.5 hover:text-yellow-400 transition"
            />

            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              3
            </span>

          </button>

          {/* Theme */}
          <button className="bg-yellow-400 hover:bg-yellow-500 transition p-2 rounded-full">

            <Sun size={18} />

          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 cursor-pointer">

            <div className="text-right">

              <h2 className="text-white font-semibold">
                Rajat Sharma
              </h2>

              <p className="text-slate-400 text-sm">
                Administrator
              </p>

            </div>

            <img
              src="https://ui-avatars.com/api/?name=Rajat+Sharma&background=2563EB&color=fff"
              alt="profile"
              className="w-11 h-11 rounded-full border-2 border-yellow-400"
            />

            <ChevronDown
              size={18}
              className="text-white"
            />

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;