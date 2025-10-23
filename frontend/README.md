# Event Buddy - Frontend

This is the frontend for Event Buddy, a full-stack event booking platform built with Next.js, TypeScript, and Tailwind CSS. This application provides a complete user experience, from browsing events to booking seats and managing events through a dedicated admin dashboard.

The user interface is designed to be modern, responsive, and intuitive, adhering to the designs provided in the Figma specification.

- **Figma Prototype:** [Clickable Prototype Link](https://www.figma.com/proto/YOUR_PROTOTYPE_LINK)
- **UI Screens:** [UI Screens Link](https://www.figma.com/file/YOUR_UI_SCREENS_LINK)

 <!-- Optional: Replace with a screenshot of your running application -->

---

## Features

This application implements the full feature set required by the project specification, with clear separation between public, user, and admin functionalities.

### Public Features (Unauthenticated Users)
- **Homepage:** Displays beautifully designed lists of upcoming and past events.
- **Event Discovery:** A hero section with a search bar to find events.
- **Event Details Page:** View full event details including description, date, location, and remaining spots.
- **Login/Signup Prompt:** The "Book Now" button on the details page prompts users to log in or sign up before proceeding.

### User Features (Authenticated Users)
- **Secure Authentication:** JWT-based authentication flow with login and registration.
- **Seat Booking:** Users can book between 1 to 4 seats for any upcoming event.
- **Booking Validation:** Logic prevents booking for past events or if available seats are exceeded.
- **User Dashboard:** A personal dashboard to view all registered events.
- **Cancel Bookings:** Users can cancel their registration for an event from their dashboard.

### Admin Features (Authenticated Admin Users)
- **Role-Based Access Control:** The admin dashboard is protected and accessible only to users with the 'ADMIN' role.
- **Event Management Dashboard:** A comprehensive table view listing all events with key details and management actions.
- **Full CRUD Functionality:**
    - **Create:** Create new events via a rich form inside a modal, including image uploads.
    - **Read:** View all events in the dashboard and view individual event details on the public page.
    - **Update:** Edit existing event details using the same reusable form.
    - **Delete:** Securely delete events with a confirmation prompt.

---

## Technology Stack

This project leverages a modern, type-safe, and performant technology stack.

- **Framework:** [Next.js](https://nextjs.org/) (v14+ with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **API Communication:** [Axios](https://axios-http.com/)
- **State Management:** React Context API (for authentication)
- **Linting & Formatting:** ESLint & Prettier (included with Next.js)

---

## Getting Started

Follow these instructions to get the frontend development environment set up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later is recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A running instance of the **[Event Buddy Backend](https://github.com/YOUR_USERNAME/event-buddy-backend)**. *This frontend will not function without it.*

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/JALAL-00/Event-Buddy---Deepchain-Labs-Internship-Technical-Test.git
    ```

2.  **Navigate to the frontend directory:**
    ```bash
    cd cd Event-Buddy---Deepchain-Labs-Internship-Technical-Test/frontend
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

4.  **Set up environment variables:**
    Create a new file named `.env.local` in the `frontend` directory. This file will hold the URL for your backend API.

    ```bash
    touch .env.local
    ```

    Add the following line to the `.env.local` file. This tells the Next.js application where to send API requests.

    ```plaintext
    NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

6.  **Open the application:**
    Open your browser and navigate to [http://localhost:3001](http://localhost:3001) to see the application in action.

---

## Project Structure

The project follows a standard Next.js App Router structure, organized for clarity and scalability.

/src
├── /app/ # Main routing, layouts, and pages
│ ├── /(auth)/ # Route group for auth pages (login, register)
│ ├── /(dashboard)/ # Route group for protected dashboards
│ ├── /events/[id]/ # Dynamic route for event details
│ ├── layout.tsx # Root layout
│ └── page.tsx # Homepage
│
├── /components/ # Reusable React components
│ ├── /shared/ # App-specific components (Navbar, EventCard, etc.)
│ └── /ui/ # Generic UI components (Modal, Pagination)
│
├── /context/ # Global state management (AuthContext)
├── /hooks/ # Custom React hooks (useAuth)
├── /lib/ # Core utilities & libraries (axios configuration)
└── /types/ # TypeScript type definitions and interfaces