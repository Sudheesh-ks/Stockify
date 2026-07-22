# 📦 Stockify - An Inventory Management System

Stockify is a full-stack inventory management application that helps businesses efficiently manage their products, stock levels, and inventory operations. It provides a secure authentication system, intuitive dashboard, and scalable architecture to simplify inventory tracking and business management.

---

## 🚀 Features

- 🔐 **Secure Authentication** – JWT-based user authentication with protected routes.
- 📦 **Inventory Management** – Add, update, delete, and organize products efficiently.
- 📊 **Stock Tracking** – Monitor available stock and maintain accurate inventory records.
- 🔍 **Search & Filtering** – Quickly find products using search and filtering options.
- 📱 **Responsive UI** – Modern interface optimized for desktop and mobile devices.
- 🧠 **Repository Pattern Architecture** – Clean, modular backend structure following SOLID principles for better maintainability and scalability.

---

## 🧰 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Nodemailer

---

## 🏗️ Architecture Overview

The backend follows the **Repository Pattern**, separating responsibilities into different layers:

- **Controllers** – Handle HTTP requests and responses.
- **Services** – Contain business logic.
- **Repositories** – Handle all database operations.
- **Models** – Define MongoDB schemas.
- **Middlewares** – Authentication, validation, and error handling.

This architecture improves code reusability, scalability, and maintainability.

---

## 🚀 **Installation & Setup**

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start
