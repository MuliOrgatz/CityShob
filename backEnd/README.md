# CityShob Backend

This is the backend service for the CityShob application. It provides APIs for user authentication, task management, and other core functionalities. The backend is built using Node.js, Express, MongoDB, and TypeScript.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

---

## Features

- User authentication (login, registration, logout)
- JWT-based access and refresh token management
- Task management (CRUD operations)
- Swagger API documentation
- MongoDB integration with Mongoose
- Repository pattern for database interactions

---

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express**: Web framework for building APIs
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Swagger**: API documentation
- **TypeScript**: Strongly typed JavaScript

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/cityshob-backend.git
   cd cityshob-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start MongoDB locally (if not already running):
   macOS (Homebrew):
   brew services start mongodb-community
   Windows:
   Run 'mongod' in CMD, or open MongoDB Compass and ensure it's running.

4. Set up environment variables (see [Environment Variables](#environment-variables)).

5. Start the development server:

   ```bash
   npm run dev
   ```

6. The server will run at `http://localhost:3000`.

---

### Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/cityshob
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
```

---

## API Documentation

The API is documented using Swagger. After starting the server, you can access the documentation at:

```
http://localhost:3000/api-docs
```

---

## Project Structure

```
cityshob-backend/
├── src/
│   ├── controllers/       # API controllers
│   ├── db/
│   │   ├── models/        # Mongoose models
│   │   ├── repositories/  # Repository pattern for DB interactions
│   ├── config/            # Swagger config
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── socket/            # Socket lock-manager and socket config
│   ├── app.ts             # configurations
│   └── server.ts          # Entry point of the application
├── .env                   # Environment variables
├── package.json           # Project metadata and dependencies
└── README.md              # Project documentation
```
