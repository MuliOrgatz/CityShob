# CityShob Application

CityShob is a real-time task management application with a frontend built using Angular and a backend powered by Node.js, Express, and MongoDB. This document provides instructions to set up and run the application locally, along with a brief explanation of the design decisions and patterns used.

---

## Instructions to Set Up and Run the Application Locally

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local instance)

---

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backEnd
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start MongoDB locally (if not already running):
   **macOS (Homebrew):**

   ```bash
   brew services start mongodb-community
   ```

   **Windows:**

   ```bash
   Run 'mongod' in CMD
   ```

   or open MongoDB Compass and ensure it's running.

4. Create a .env file in the backEnd directory with the following content:

   ```bash
    MONGO_URI=mongodb://127.0.0.1:27017/realtime-todo
    PORT=3000
    secretJWT_SECRET=mysuperkey123!
    JWT_REFRESH_SECRET=mysuperdupersecretkey123!
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. The backend server will be running at: `http://localhost:3000`.

---

### Frontend Setup

1. Navigate to the frontend directory:
   cd frontEnd

2. Install dependencies:
   npm install

3. Start the development server:
   npm start

4. Open your browser and navigate to:
   http://localhost:4200/

### Design Decisions and Patterns

Backend

1. RESTful API Design: The backend follows REST principles for clear and consistent API endpoints.
2. Socket.IO for Real-Time Updates: Enables real-time task updates for collaborative task management.
3. Repository Pattern: Database interactions are abstracted into repositories for better separation of concerns.
4. JWT Authentication: Secure authentication using access and refresh tokens.
5. Middleware for Authorization: Custom middleware ensures secure access to protected routes.
6. Swagger Documentation: Provides interactive API documentation for easy testing and integration.
7. Environment Configuration: Sensitive data like database URIs and secrets are stored in environment variables.
8. TypeScript for Strong Typing: Ensures type safety and better maintainability.
9. Error Handling: Centralized error handling for consistent and informative error responses.
10. Scalable Structure: Organized into controllers, routes, models, and services for scalability and maintainability.

---

Frontend

1. Modular Structure: The project is organized into modules (components, pages, store, etc.) for scalability and maintainability.
2. State Management with NgRx: NgRx is used to manage application state, ensuring a unidirectional data flow and predictable state transitions.
3. Reactive Programming: RxJS is used for handling asynchronous data streams, making the application responsive and efficient.
4. Angular Material: Provides a modern and consistent UI design with prebuilt components.
5. Service Pattern: Services like TasksService and AuthService handle API interactions and business logic, separating concerns from components.
6. Socket.IO Integration: Real-time updates are implemented using Socket.IO for collaborative task management.
7. Lazy Loading: Routes are configured to load modules lazily, improving initial load time.
8. SCSS for Styling: SCSS is used for modular and reusable styles, ensuring a clean and maintainable design.

---

### Bonus Features Implemented

This project includes several enhancements that go above and beyond the original assignment requirements:

## Authentication

- JWT Authentication: Full user login system using secure access and refresh tokens.
- Token Refresh Logic: Automatically refreshes tokens when expired using interceptors.

## Task Enhancements

- Task Prioritization: Each task can be marked as High, Medium, or Low priority.
- Due Dates: Tasks include a required due date field with date-picker and formatted display.
- Sorted Task Table: Tasks are sorted by priority (High → Medium → Low) automatically in the table.

## Real-Time Features

- Socket-based Locking: Only one user can edit a task at a time (lockedBy displayed to others).
- Auto Lock Release: Locks are released automatically after 60 seconds (can be modify) to prevent stale locks.

## State Management

- NgRx Integration: Full NgRx setup for tasks and user state, including:
- Actions, Reducers, Effects, Selectors
- Store-driven task dialog logic and unlock behavior

### Additional Notes

- The backend server must be running before starting the frontend application to ensure API and real-time socket communication work correctly.
- MongoDB must be running locally or configured to connect to a cloud instance for the application to function properly.
