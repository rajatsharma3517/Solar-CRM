import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

/*
=================================================
JWT INTERCEPTOR
Har request ke saath login token automatically
Authorization header mein bhejega.
=================================================
*/

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ================= CUSTOMERS / LEADS =================

export const getCustomers = (type, assignedTo = "") => {
  const params = {};

  if (type) {
    params.type = type;
  }

  if (assignedTo) {
    params.assignedTo = assignedTo;
  }

  return API.get("/customers", {
    params,
  });
};


export const addCustomer = (customer) =>
  API.post("/customers", customer);


export const updateCustomer = (id, customer) =>
  API.put(`/customers/${id}`, customer);


export const deleteCustomer = (id) =>
  API.delete(`/customers/${id}`);


export const convertToCustomer = (id) =>
  API.put(`/customers/${id}/convert`);

export const assignCustomer = (customerId, userId) =>
  API.put(`/customers/${customerId}/assign`, {
    userId,
  });

export const getCustomerById = (id) =>
  API.get(`/customers/${id}`);


export const uploadDocument = (
  id,
  documentType,
  formData
) => {
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
  API.get("/followups");


export const completeFollowUp = (id, data) =>
  API.put(`/followups/${id}`, data);


export const getOverdueFollowups = () =>
  API.get("/followups/overdue");


export const getTodayFollowups = () =>
  API.get("/followups/today");


// ================= DASHBOARD =================

export const getRecentLeads = () =>
  API.get("/customers/recent");


export const getRecentActivities = () =>
  API.get("/activities/recent");

// ================= MANAGE USERS =================

// Get all employees
export const getUsers = () =>
  API.get("/api/users");

// Add new employee
export const addUser = (userData) =>
  API.post("/api/users", userData);


export default API;