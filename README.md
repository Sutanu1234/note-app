## Demo
Check out the live demo [here](https://note-app-ccgk.vercel.app/)

# Note App

A modern **Note-taking application** with email/OTP and Google authentication, built with **Next.js**, **MongoDB**, and **JWT-based sessions**. Users can create, edit, and manage their notes securely.

---

## **Table of Contents**

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [API Endpoints](#api-endpoints)
* [Authentication Flow](#authentication-flow)
* [Notes Flow](#notes-flow)
* [License](#license)

---

## **Features**

### Authentication & User Management

* **Sign up / Login via Email + OTP**

  * OTP sent to user email for verification.
  * OTP resend with rate limits and expiry.
* **Sign in with Google**

  * Automatic user creation if new.
* **JWT-based sessions**

  * Custom JWT tokens for secure API access.
* **User profile**

  * Retrieve user information via `/api/auth/me`.

### OTP Handling

* OTP generation, verification, and deletion.
* Resend OTP with expiration refresh.
* Attempt limits and proper error handling.

### Notes Management

* Create, read, update, and delete notes.
* Notes linked to authenticated users.
* Secured endpoints with JWT-based middleware.

### Security & Middleware

* Token-based authentication for private routes.
* OTP rate limiting and expiry.
* Input validation with proper HTTP status codes.

### Database

* **MongoDB Models**

  * `User` – stores user data.
  * `OTP` – stores OTP for email verification.
  * `Note` – stores user notes.
* Automatic database connection handling with `dbConnect`.

---

## **Tech Stack**

* **Frontend:** Next.js, React
* **Backend:** Next.js API Routes, Node.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JWT, NextAuth.js (Google)
* **Email:** Nodemailer (for OTP emails)
* **Other Tools:** TypeScript, ESLint

---

## **Getting Started**

### Prerequisites

* Node.js >= 18.x
* MongoDB Atlas or local MongoDB instance
* npm or yarn

### Installation

```
git clone https://github.com/your-username/note-app.git
cd note-app
npm install
```

### Running the App

```
# Development mode
npm run dev

# Production build
npm run build
npm start
```

---

## **Environment Variables**

Create a `.env.local` file in the root directory and add:

```
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
OTP_RESEND_LIMIT=5
OTP_EXPIRY_MINUTES=10
JWT_EXPIRES_IN_SHORT=7d
JWT_EXPIRES_IN_LONG=30d
NEXTAUTH_SECRET=<your-nextauth-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-email-password>
```

---

## **API Endpoints**

### Authentication

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| POST   | `/api/auth/send-otp`   | Send OTP to email          |
| POST   | `/api/auth/resend-otp` | Resend OTP                 |
| POST   | `/api/auth/verify-otp` | Verify OTP and issue token |
| GET    | `/api/auth/me`         | Get current user info      |

### Notes

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | `/api/notes`     | Create a new note |
| GET    | `/api/notes`     | Fetch all notes   |
| PUT    | `/api/notes/:id` | Update a note     |
| DELETE | `/api/notes/:id` | Delete a note     |

---

## **Authentication Flow**

1. User enters email → requests OTP.
2. OTP sent to email → user verifies OTP.
3. If signup, user provides `fullName` and `dob`.
4. User receives JWT token → can access protected routes.
5. Optionally, login via Google → automatic account creation.

---

## **Notes Flow**

1. User accesses dashboard.
2. Create, edit, delete notes.
3. Notes are linked to authenticated user via JWT.

---

## **License**

This project is licensed under the [MIT License](LICENSE).
