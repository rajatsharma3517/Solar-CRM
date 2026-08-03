import { useEffect, useMemo, useState } from "react";
import { getAllFollowUps } from "../services/api";
import {
    Phone,
    MessageCircle,
    Mail,
    CheckCircle2,
    Pencil,
    Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
    completeFollowUp,
} from "../services/api";

export default function FollowUps() {
    const [activeTab, setActiveTab] = useState("Upcoming");
    const [followUps, setFollowUps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchFollowUps();
    }, []);

    const handleComplete = async (item) => {
        try {
            await completeFollowUp(item.id, {
                followup_date: item.followup_date.substring(0, 10),
                followup_time: item.followup_time,
                notes: item.notes,
                status: "Completed",
            });

            fetchFollowUps();
        } catch (err) {
            console.log(err);
            alert("Unable to update follow-up.");
        }
    };

    const fetchFollowUps = async () => {
        try {
            const res = await getAllFollowUps();
            setFollowUps(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredFollowUps = useMemo(() => {
        return followUps.filter((item) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                item.name.toLowerCase().includes(searchText) ||
                item.phone.includes(searchText);

            const matchesTab =
                activeTab === "Upcoming"
                    ? item.status !== "Completed"
                    : item.status === "Completed";

            return matchesSearch && matchesTab;
        });
    }, [followUps, search, activeTab]);


    const upcomingCount = followUps.filter(
        (item) => item.status !== "Completed"
    ).length;

    const completedCount = followUps.filter(
        (item) => item.status === "Completed"
    ).length;

    const getStatus = (item) => {
        if (item.status === "Completed") {
            return {
                label: "Completed",
                className: "bg-green-100 text-green-700",
            };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const followupDate = new Date(item.followup_date);
        followupDate.setHours(0, 0, 0, 0);

        if (followupDate < today) {
            return {
                label: "Overdue",
                className: "bg-red-100 text-red-700",
            };
        }

        return {
            label: "Scheduled",
            className: "bg-yellow-100 text-yellow-700",
        };
    };

    return (
        <div className="p-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">

                <div>
                    <h1 className="text-3xl font-bold">
                        Follow-ups
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage all customer follow-ups
                    </p>
                </div>

            </div>

            {/* Search */}

            <input
                type="text"
                placeholder="Search customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-xl px-4 py-3 w-full md:w-96 mb-8"
            />

            {/* Tabs */}

            <div className="flex gap-4 mb-8">

                <button
                    onClick={() => setActiveTab("Upcoming")}
                    className={`px-6 py-2 rounded-xl font-semibold transition ${activeTab === "Upcoming"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                        }`}
                >
                    Upcoming ({upcomingCount})
                </button>

                <button
                    onClick={() => setActiveTab("Completed")}
                    className={`px-6 py-2 rounded-xl font-semibold transition ${activeTab === "Completed"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100"
                        }`}
                >
                    Completed ({completedCount})
                </button>

            </div>

            {/* Table */}

            <div className="bg-white rounded-2xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-900 text-white">

                        <tr>

                            <th className="text-left p-4">Customer</th>

                            <th className="text-left p-4">Phone</th>

                            <th className="text-left p-4">Date</th>

                            <th className="text-left p-4">Time</th>

                            <th className="text-left p-4">Status</th>

                            <th className="text-left p-4">Actions</th>

                        </tr>

                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-12">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredFollowUps.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-12 text-gray-500">
                                    No follow-ups found
                                </td>
                            </tr>
                        ) : (
                            filteredFollowUps.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="p-4">
                                        <Link
                                            to={`/customer/${item.customer_id}`}
                                            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            {item.name}
                                        </Link>
                                    </td>

                                    <td className="p-4">
                                        {item.phone}
                                    </td>

                                    <td className="p-4">
                                        {new Date(item.followup_date).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>

                                    <td className="p-4">
                                        {new Date(
                                            `1970-01-01T${item.followup_time}`
                                        ).toLocaleTimeString("en-US", {
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </td>

                                    <td className="p-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatus(item).className
                                                }`}
                                        >
                                            {getStatus(item).label}
                                        </span>

                                    </td>

                                    <td className="p-4">

                                        <div className="flex items-center gap-2">

                                            {/* Call */}
                                            <a
                                                href={`tel:${item.phone}`}
                                                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
                                                title="Call"
                                            >
                                                <Phone size={16} />
                                            </a>

                                            {/* WhatsApp */}
                                            <a
                                                href={`https://wa.me/91${item.phone}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition"
                                                title="WhatsApp"
                                            >
                                                <MessageCircle size={16} />
                                            </a>

                                            {/* Email */}
                                            <a
                                                href={`mailto:${item.email || ""}`}
                                                className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-600 transition"
                                                title="Email"
                                            >
                                                <Mail size={16} />
                                            </a>

                                            {/* Complete */}
                                            {item.status !== "Completed" && (
                                                <button
                                                    onClick={() => handleComplete(item)}
                                                    className="p-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-600 transition"
                                                    title="Mark Complete"
                                                >
                                                    <CheckCircle2 size={16} />
                                                </button>
                                            )}

                                            {/* Edit */}
                                            <button
                                                className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-600 transition"
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                        </div>

                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>

            </div>

        </div>
    );
}