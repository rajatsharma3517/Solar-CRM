import Sidebar from "./Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function Layout() {

    return (

        <div className="flex h-screen">

            <Sidebar />

            <div className="flex-1 flex flex-col bg-gray-100">

                <Navbar />

                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>

            </div>

        </div>
    );

}

export default Layout;