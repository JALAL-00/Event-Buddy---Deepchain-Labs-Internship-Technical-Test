# Event Buddy - Backend API

This is the backend for the Event Buddy application, a full-stack event booking platform. It is built with **NestJS**, **TypeScript**, and **PostgreSQL**.

## Features

-   **JWT Authentication:** Secure endpoints with role-based access control (Admin vs. User).
-   **Admin Event Management:** Full CRUD (Create, Read, Update, Delete) functionality for events, including image uploads.
-   **Public Event Listings:** Publicly accessible endpoints for upcoming and past events with pagination.
-   **User Booking System:** Secure booking and cancellation system with robust validation (seat availability, event dates).
-   **Dynamic Seat Calculation:** All event endpoints provide real-time `bookedSeats` and `spotsLeft` data.

---

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/)
-   [PostgreSQL](https://www.postgresql.org/download/) running locally
-   [pgAdmin 4](https://www.pgadmin.org/download/) (Recommended for database management)

### 1. Setup

### 1. Setup

**Clone the repository:**
```bash
git clone https://github.com/JALAL-00/Event-Buddy---Deepchain-Labs-Internship-Technical-Test.git

**Navigate to the backend directory:**
```bash
cd Event-Buddy---Deepchain-Labs-Internship-Technical-Test/backend
```

**Install dependencies:**
```bash
npm install
```

### 2. Environment Configuration

The application uses a `.env` file for environment variables.

1.  Create a file named `.env` in the root of the `/backend` directory.
2.  Copy the contents of `.env.example` (or the content below) into it.

```ini
# .env file content

# --- Database Configuration ---
# Replace with your actual PostgreSQL credentials
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_postgres_username
DATABASE_PASSWORD=your_postgres_password
DATABASE_NAME=eventbuddy

# --- JWT Configuration ---
# You can generate a strong secret here: https://www.grc.com/passwords.htm
JWT_SECRET=a8b3c1d9e7f5a2b8d4e6f3a1c9d8b7c6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0
JWT_EXPIRES_IN=1d
```

### 3. Database Setup

1.  Open **pgAdmin 4**.
2.  Connect to your local PostgreSQL server.
3.  Right-click on `Databases` -> `Create` -> `Database...`.
4.  Enter `eventbuddy` as the Database name and click Save.
5.  The application will automatically create the necessary tables when it first starts (`synchronize: true` is enabled for development).

### 4. Running the Application

```bash
# Development mode with hot-reload
npm run start:dev
```
The server will start on `http://localhost:3000`. The first time it runs, it will automatically seed the database with an Admin account.

**Default Admin Credentials:**
-   **Email:** `admin@eventbuddy.com`
-   **Password:** `adminpassword`

---

##  API Endpoints

A brief overview of the available API routes. Use an API client like [Postman](https://www.postman.com/) for testing.

*(A more detailed Postman collection would be exported for a full project, but this list is sufficient for the assignment.)*

### `Auth`

-   `POST /auth/register`: Register a new user.
-   `POST /auth/login`: Log in a user or admin, returns a JWT `access_token`.
-   `GET /auth/profile`: [USER] Get the profile of the logged-in user.

### `Events`

-   `GET /events/upcoming`: [PUBLIC] Get a paginated list of upcoming events.
-   `GET /events/past`: [PUBLIC] Get a paginated list of past events.
-   `POST /events/public/find`: [PUBLIC] Get details of a single event by its ID.
-   `GET /events`: [ADMIN] Get a list of all events with registration counts.
-   `POST /events`: [ADMIN] Create a new event (requires `multipart/form-data` for image upload).
-   `PATCH /events`: [ADMIN] Update an event.
-   `DELETE /events`: [ADMIN] Delete an event.

### `Bookings`

-   `POST /bookings`: [USER] Book seats for an event.
-   `GET /bookings/my-bookings`: [USER] Get a list of all bookings for the current user.
-   `DELETE /bookings/cancel`: [USER] Cancel a specific booking.