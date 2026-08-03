import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const getCustomers = (type) => {
    if (type) {
        return API.get(`/customers?type=${type}`);
    }

    return API.get("/customers");
};

export const addCustomer = (customer) =>
  API.post("/customers", customer);

export const updateCustomer = (id, customer) =>
  API.put(`/customers/${id}`, customer);

export const deleteCustomer = (id) =>
  API.delete(`/customers/${id}`);

export const convertToCustomer = (id) =>
  API.put(`/customers/${id}/convert`);

export const getCustomerById = (id) =>
  API.get(`/customers/${id}`);

export const uploadDocument = (id, documentType, formData) => {
  return API.post(
    `/customers/${id}/upload/${documentType}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// ================= FOLLOW UPS =================

export const addFollowUp = (data) =>
    API.post("/followups", data);

export const getFollowUps = (customerId) =>
    API.get(`/followups/customer/${customerId}`);

export const updateFollowUp = (id, data) =>
    API.put(`/followups/${id}`, data);

export const deleteFollowUp = (id) =>
    API.delete(`/followups/${id}`);

export const getAllFollowUps = () =>
  axios.get("http://localhost:5000/followups");

export const completeFollowUp = (id, data) =>
  axios.put(`http://localhost:5000/followups/${id}`, data);

export const getOverdueFollowups = () =>
  axios.get(`${API_URL}/followups/overdue`);

export const getTodayFollowups = () =>
  API.get("/followups/today");

export const getRecentLeads = () =>
  API.get("/customers/recent");

export const getRecentActivities = () =>
  API.get("/activities/recent");

export default API;