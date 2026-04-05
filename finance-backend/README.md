
# 📘 Finance Data Processing and Access Control Backend

## 📌 Overview

This project is a **backend system** built for a finance dashboard application.

It focuses on:
- Data processing and financial analytics
- Role-based access control (RBAC)
- Secure authentication using JWT
- Clean and scalable backend architecture

> ⚠️ This project is backend-only and is designed to serve APIs for frontend or API clients (Postman/Insomnia).

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Neon Cloud)
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Token)
- **Security:** bcrypt, CORS, Helmet, Rate Limiting

---

## 🏗️ Project Structure

```

finance-backend/
├── node_modules/
├── src/
│   ├── config/                # Database configuration & setup
│   │   ├── database.js
│   │   └── migrate.js
│   │
│   ├── controllers/          # Request handlers (API logic layer)
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── transactionController.js
│   │   └── dashboardController.js
│   │
│   ├── middleware/           # Authentication & validation logic
│   │   ├── authMiddleware.js     # JWT authentication
│   │   ├── roleMiddleware.js      # Role-based access control
│   │   └── validationMiddleware.js# Input validation
│   │
│   ├── models/               # Sequelize models (Database schema)
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── index.js
│   │
│   ├── routes/               # API route definitions
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── services/             # Business logic layer
│   │   ├── userService.js
│   │   ├── transactionService.js
│   │   └── dashboardService.js
│   │
│   ├── utils/                # Utility functions & helpers
│   │   ├── AppError.js
│   │   ├── asyncHandler.js
│   │
│   └── app.js                # Express app setup
│
├── server.js                 # Application entry point
├── .env                      # Environment variables
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

````
## 🔄 System Flow

Client → Routes → Middleware → Controller → Service → Model → Database

### 📌 Explanation of Flow

- **Routes**  
  Define API endpoints and forward requests to controllers.

- **Middleware**  
  Handles authentication, authorization, and validation before reaching controllers.

- **Controllers**  
  Receive requests, process input, and call service layer functions.

- **Services**  
  Contain business logic and handle data processing.

- **Models**  
  Interact with the database using ORM (Sequelize).

- **Database**  
  Stores all application data securely and persistently.

---

### 🔹 Design Principles

- Separation of concerns
- Modular structure
- Scalable and maintainable code
- Clear data flow

---

## 🚀 Setup Instructions

### 1️⃣ Clone Repository

```bash
git https://github.com/Yash-Raj-96/Finance-Data-Processing-and-Access-Control-Backend.git
cd finance-backend
````

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file:

#### ✅ For Local Development

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=finance_db
DB_PORT=5432

JWT_SECRET=your_secret_key
NODE_ENV=development
```

#### ✅ For Production (Neon DB)

```env
DATABASE_URL=your_neon_connection_string

JWT_SECRET=your_secret_key
NODE_ENV=production
```

---

### 4️⃣ Run the Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## 🔐 Authentication

### Login API

```http
POST /api/auth/login
```

#### Request Body

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Response

```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

### 🔑 Authorization Header

```
Authorization: Bearer <token>
```

---

## 👥 Role-Based Access Control (RBAC)

| Role    | Permissions                          |
| ------- | ------------------------------------ |
| Viewer  | Read-only access                     |
| Analyst | Read + analytics                     |
| Admin   | Full access (CRUD + user management) |

---

## 💰 API Endpoints

### 🔹 Auth

```
POST /api/auth/login
POST /api/auth/register
```

---

### 🔹 Users (Admin Only)

```
GET /api/users
```

---

### 🔹 Transactions

```
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
```

---

### 🔹 Dashboard

```
GET /api/dashboard/summary
GET /api/dashboard/trends
GET /api/dashboard/category-analytics
```

---

## 📊 Dashboard Features

* Total Income
* Total Expenses
* Net Balance
* Monthly Trends
* Category-wise Analysis
* Recent Transactions

---

## 🔍 Filtering & Pagination

```http
GET /api/transactions?page=1&limit=10
GET /api/transactions?type=income
GET /api/transactions?category=Food
GET /api/transactions?startDate=2026-01-01&endDate=2026-12-31
```

---

## ⚠️ Assumptions

* JWT is used for authentication
* Roles are stored in the user model
* Soft delete is used for transactions (`isDeleted`)
* Dates are stored in ISO format
* Amounts are stored in decimal format

---

## ⚖️ Trade-offs

### 1. Sequelize ORM

✔ Easy and fast development
❌ Slight performance overhead compared to raw SQL

### 2. Monolithic Architecture

✔ Simple and easy to manage
❌ Less scalable than microservices

### 3. JWT Authentication

✔ Stateless and scalable
❌ No built-in token revocation

### 4. Soft Delete

✔ Prevents accidental data loss
❌ Requires additional filtering logic

---

## 🚨 Error Handling

* Uses proper HTTP status codes:

  * `200` → Success
  * `400` → Bad Request
  * `401` → Unauthorized
  * `403` → Forbidden
  * `404` → Not Found

* Error response format:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 🔐 Security Features

* Password hashing using bcrypt
* JWT authentication
* Role-based access control
* Helmet (secure headers)
* CORS enabled
* Rate limiting

---

## 🌐 Deployment

* **Testing Tools:**

  * Insomnia
  * Postman

> ⚠️ Note: Browser cannot test protected APIs because it does not send authentication headers.

---

## 🚀 Future Improvements

- 🔐 Add refresh tokens for better authentication handling  
- 🔒 Implement two-factor authentication (2FA) for enhanced security  
- ⚡ Add caching using Redis to improve performance  
- 📝 Integrate logging system using Winston or similar tools  
- 📚 Add API documentation using Swagger / OpenAPI  
- 🧪 Implement unit and integration testing  
- 🚀 Set up CI/CD pipeline for automated deployment  
- 📊 Add advanced analytics and reporting features  
- 🌐 Improve scalability with microservices architecture (future scope)

---
## 📌 Conclusion

This project demonstrates:

✔ Strong backend architecture
✔ Role-based access control
✔ Secure authentication system
✔ Real-world API design
✔ Clean and maintainable code

---
