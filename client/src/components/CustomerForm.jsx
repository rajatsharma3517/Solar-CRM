import { useEffect, useState } from "react";

function CustomerForm({
  onSubmit,
  editingCustomer,
  cancelEdit,
}) {
  const initialState = {
    name: "",
    phone: "",
    email: "",
    location: "",
    pincode: "",
    required_watts: "",
    house_size: "",
    status: "Pending",
    notes: "",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (editingCustomer) {
      setFormData(editingCustomer);
    } else {
      setFormData(initialState);
    }
  }, [editingCustomer]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);

    if (!editingCustomer) {
      setFormData(initialState);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6">
        {editingCustomer
          ? "Edit Customer"
          : "Add New Customer"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={formData.name}
          onChange={handleChange}
          className="border rounded-lg p-3"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="border rounded-lg p-3"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          maxLength={6}
          className="border rounded-xl p-3 w-full"
        />

        <input
          type="number"
          name="required_watts"
          placeholder="Required Watts"
          value={formData.required_watts}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          type="number"
          name="house_size"
          placeholder="House Size (sq.ft)"
          value={formData.house_size}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border rounded-lg p-3"
        >
          <option>Pending</option>
          <option>Contacted</option>
          <option>Completed</option>
          <option>Rejected</option>
        </select>

        <textarea
          name="notes"
          placeholder="Notes..."
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          className="border rounded-lg p-3 md:col-span-2"
        />

        <div className="md:col-span-2 flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            {editingCustomer
              ? "Update Customer"
              : "Save Customer"}
          </button>

          {editingCustomer && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;