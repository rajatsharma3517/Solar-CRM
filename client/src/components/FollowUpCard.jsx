import { useEffect, useState } from "react";

import {
    CalendarDays,
    Clock3,
    StickyNote,
    CheckCircle2,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    addFollowUp,
    getFollowUps,
    updateFollowUp,
    deleteFollowUp,
} from "../services/api";

function FollowUpCard({ customerId }) {

    const [followUps, setFollowUps] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        followup_date: "",
        followup_time: "",
        notes: "",
    });

    useEffect(() => {
        fetchFollowUps();
    }, []);

    const fetchFollowUps = async () => {
        try {

            const res = await getFollowUps(customerId);

            setFollowUps(res.data);

        } catch (err) {

            console.log(err);

        }
    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const resetForm = () => {

        setEditingId(null);

        setFormData({
            followup_date: "",
            followup_time: "",
            notes: "",
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await updateFollowUp(editingId, {
                    ...formData,
                    status: "Scheduled",
                });

            } else {

                await addFollowUp({
                    customer_id: customerId,
                    ...formData,
                });

            }

            resetForm();

            fetchFollowUps();

        } catch (err) {

            console.log(err);

            alert("Something went wrong.");

        }

    };

    const handleEdit = (item) => {

        setEditingId(item.id);

        setFormData({
            followup_date: item.followup_date.slice(0, 10),
            followup_time: item.followup_time.slice(0, 5),
            notes: item.notes,
        });

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this follow-up?")) return;

        try {

            await deleteFollowUp(id);

            fetchFollowUps();

        } catch (err) {

            console.log(err);

        }

    };

    const markCompleted = async (item) => {

        try {

            await updateFollowUp(item.id, {
                followup_date: item.followup_date,
                followup_time: item.followup_time,
                notes: item.notes,
                status: "Completed",
            });

            fetchFollowUps();

        } catch (err) {

            console.log(err);

        }

    };

    // Date Format
    const formatDate = (date) => {

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    };

    // Time Format
    const formatTime = (time) => {

        return new Date(
            `1970-01-01T${time}`
        ).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

    };
    return (

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

            <div className="flex items-center justify-between mb-8">

                <div>

                    <h2 className="text-2xl font-bold">
                        📅 Follow-up Manager
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Schedule and manage customer follow-ups
                    </p>

                </div>

            </div>

            {/* Form */}

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >

                <div>

                    <label className="block text-sm font-medium mb-2">
                        Date
                    </label>

                    <input
                        type="date"
                        name="followup_date"
                        value={formData.followup_date}
                        onChange={handleChange}
                        className="border rounded-xl p-3 w-full"
                        required
                    />

                </div>

                <div>

                    <label className="block text-sm font-medium mb-2">
                        Time
                    </label>

                    <input
                        type="time"
                        name="followup_time"
                        value={formData.followup_time}
                        onChange={handleChange}
                        className="border rounded-xl p-3 w-full"
                        required
                    />

                </div>

                <div className="flex items-end">

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition"
                    >
                        {editingId
                            ? "Update Follow-up"
                            : "Schedule Follow-up"}
                    </button>

                </div>

                <div className="md:col-span-3">

                    <label className="block text-sm font-medium mb-2">
                        Notes
                    </label>

                    <textarea
                        name="notes"
                        rows="4"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Example: Customer requested quotation after discussing subsidy..."
                        className="border rounded-xl p-3 w-full"
                    />

                </div>

            </form>

            <hr className="my-8" />

            <div className="flex items-center justify-between mb-6">

                <h3 className="text-xl font-bold">

                    Upcoming Follow-ups

                </h3>

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">

                    {followUps.length} Total

                </span>

            </div>

            <div className="space-y-5">

                {followUps.length === 0 ? (

                    <div className="text-center text-gray-500 py-10">

                        No Follow-ups Scheduled

                    </div>

                ) : (

                    followUps.map((item) => (

                        <div
                            key={item.id}
                            className="border rounded-2xl p-6 hover:shadow-lg transition"
                        >

                            <div className="flex justify-between items-start">

                                <div className="space-y-3">

                                    <div className="flex items-center gap-3">

                                        <CalendarDays
                                            size={18}
                                            className="text-blue-600"
                                        />

                                        <span className="font-semibold">

                                            {formatDate(item.followup_date)}

                                        </span>

                                    </div>

                                    <div className="flex items-center gap-3">

                                        <Clock3
                                            size={18}
                                            className="text-orange-500"
                                        />

                                        <span>

                                            {formatTime(item.followup_time)}

                                        </span>

                                    </div>

                                    <div className="flex items-start gap-3">

                                        <StickyNote
                                            size={18}
                                            className="text-gray-500 mt-1"
                                        />

                                        <span>

                                            {item.notes || "No Notes"}

                                        </span>

                                    </div>

                                </div>

                                <div>

                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${item.status === "Completed"
                                                ? "bg-green-100 text-green-700"
                                                : item.status === "Missed"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {item.status}
                                    </span>

                                </div>

                            </div>

                            <div className="flex gap-3 mt-6">

                                <button
                                    type="button"
                                    onClick={() => markCompleted(item)}
                                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition"
                                >
                                    <CheckCircle2 size={18} />
                                    Complete
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleEdit(item)}
                                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
                                >
                                    <Pencil size={18} />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(item.id)}
                                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                                >
                                    <Trash2 size={18} />
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default FollowUpCard;