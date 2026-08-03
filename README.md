# ☀️ Solar CRM

A full-stack Customer Relationship Management system designed for solar businesses to manage leads, customers, follow-ups, documents, and day-to-day sales operations from a centralized dashboard.

## 🚀 Features

- 🔐 Admin and User Authentication
- 👥 Lead & Customer Management
- 🔄 Convert Leads into Customers
- ✏️ Create, Update and Delete Customer Records
- 🔍 Search and Filter Customers
- 📅 Follow-up Management
- 📊 Interactive CRM Dashboard
- 📁 Customer Document Management
- 👤 Customer Profile View
- 🛡️ Protected Routes & Authentication Middleware
- 📱 Responsive User Interface

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- Lucide React

### Backend
- Node.js
- Express.js
- REST APIs
- Authentication Middleware

### Database
- MySQL

## 📁 Project Structure

```text
Solar-CRM/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── layout/
│       ├── pages/
│       └── services/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── server.js
│
├── .gitignore
└── README.md
```

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/rajatsharma3517/Solar-CRM.git
```

Install frontend dependencies:

```bash
cd Solar-CRM/client
npm install
npm run dev
```

Install backend dependencies:

```bash
cd ../server
npm install
npm start
```

Create a `.env` file inside the `server` directory and configure the required environment variables.

```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_secret_key
```

> Sensitive environment variables and uploaded customer documents are excluded from this repository.

## 🎯 Purpose

Solar CRM was built to simplify customer and lead management for solar businesses. It provides a centralized workflow for managing prospects, customer information, follow-ups, documents, and sales activity.

## 🔮 Future Improvements

- Role-based Admin & Employee Management
- Advanced Analytics and Reports
- Notifications and Follow-up Reminders
- Deployment with Cloud Database
- Enhanced Role-Based Access Control
- AI-powered Lead Insights

## 👨‍💻 Developer

**Rajat Sharma**  
Full-Stack Developer | B.Tech CSE

---

⭐ If you found this project useful, consider giving the repository a star.