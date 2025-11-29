# Virtual Event Management Platform - Backend API

A robust and scalable backend system for managing virtual events with comprehensive user authentication, event scheduling, and participant management capabilities.

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Security Features](#-security-features)
- [Environment Variables](#-environment-variables)
- [Usage Examples](#-usage-examples)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 Problem Statement

Modern organizations need a reliable platform to manage virtual events efficiently. The system must support:

1. **User Management**: Secure registration and authentication for different user roles
2. **Event Organization**: Create, manage, and schedule events with detailed information
3. **Participant Management**: Handle event registrations with capacity limits
4. **Access Control**: Role-based permissions (Organizers vs Attendees)
5. **Notifications**: Automated email confirmations for registrations
6. **API Access**: RESTful API endpoints for seamless integration

### Challenges Addressed

- **Security**: Protecting user data and preventing unauthorized access
- **Scalability**: Supporting multiple events and participants simultaneously
- **Data Integrity**: Ensuring consistent data across user registrations and events
- **User Experience**: Providing clear feedback and automated notifications
- **Maintainability**: Clean, testable, and well-documented codebase

---

## 💡 Solution Overview

This project provides a complete backend API solution built with modern technologies:

- **RESTful API Architecture** with 12 endpoints covering all operations
- **Role-Based Access Control** distinguishing Organizers and Attendees
- **JWT Authentication** for secure, stateless session management
- **MongoDB Atlas** for cloud-based data persistence
- **Email Notifications** via Nodemailer for event confirmations
- **Comprehensive Testing** with Jest and Supertest (35 test cases, 84%+ coverage)
- **TypeScript** for type safety and better developer experience

---

## 🚀 Features

### User Authentication & Authorization

- User registration with email/password
- Secure login with JWT token generation
- Password hashing using bcrypt (10 salt rounds)
- Role-based access (Organizer/Attendee)
- Protected routes with JWT middleware
- User profile retrieval

### Event Management

- Create events (Organizer only)
- View all events (with search and filters)
- View single event details
- Update events (Owner only)
- Delete events (Owner only)
- Event capacity management
- Active/inactive status tracking

### Participant Management

- Register for events
- Unregister from events
- View registered events
- View created events (Organizer)
- Automatic email notifications
- Capacity validation
- Duplicate registration prevention

### Additional Features

- Advanced search and filtering
- Comprehensive input validation
- Centralized error handling
- CORS support
- Health check endpoint

---

## 🛠️ Technology Stack

### Backend Framework

- **Node.js** (v16+) - JavaScript runtime
- **Express.js** (4.18.2) - Web application framework
- **TypeScript** (5.3.3) - Type-safe JavaScript

### Database

- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose** (8.0.3) - MongoDB object modeling (ODM)

### Authentication & Security

- **jsonwebtoken** (9.0.2) - JWT authentication
- **bcryptjs** (2.4.3) - Password hashing
- **express-validator** (7.0.1) - Input validation
- **cors** (2.8.5) - Cross-Origin Resource Sharing

### Email & Notifications

- **nodemailer** (6.9.7) - Email service integration

### Testing

- **Jest** (29.7.0) - Testing framework
- **Supertest** (6.3.3) - HTTP assertions
- **mongodb-memory-server** (9.1.4) - In-memory database for testing

### Development Tools

- **ts-node** (10.9.2) - TypeScript execution
- **nodemon** (3.0.2) - Hot-reload development
- **ts-jest** (29.1.1) - TypeScript Jest integration

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd vem

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your MongoDB URI, JWT secret, and email credentials

# Start the server in development mode
npm run dev
```

**Server runs on:** `http://localhost:3000`  
**API Base URL:** `http://localhost:3000/api`

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v7 or higher) - Comes with Node.js
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Gmail Account** (for email notifications) - Optional but recommended

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vem
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@eventmanagement.com
```

---

## 🚦 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### Verify Server

```bash
curl http://localhost:3000/health
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

**Test Results:**

- Test Suites: 2 passed
- Tests: 35 passed
- Coverage: 84%+

---

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Response Format

**Success:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error:**

```json
{
  "success": false,
  "error": "Error message"
}
```

---

## API Endpoints

### Public Endpoints

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| GET    | `/health`            | Health check      |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |

### Protected Endpoints

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| GET    | `/api/auth/me`             | Get user profile      |
| GET    | `/api/events`              | Get all events        |
| GET    | `/api/events/:id`          | Get single event      |
| POST   | `/api/events`              | Create event          |
| PUT    | `/api/events/:id`          | Update event          |
| DELETE | `/api/events/:id`          | Delete event          |
| POST   | `/api/events/:id/register` | Register for event    |
| DELETE | `/api/events/:id/register` | Unregister from event |
| GET    | `/api/events/my-events`    | Get my events         |

---

## Authentication Endpoints

### Register User

**POST** `/api/auth/register`

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "attendee"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "692a9f880cb983616f596f00",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "attendee"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login

**POST** `/api/auth/login`

**Request:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "692a9f880cb983616f596f00",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "attendee"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get User Profile

**GET** `/api/auth/me`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "692a9f880cb983616f596f00",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "attendee"
    }
  }
}
```

---

## Event Endpoints

### Get All Events

**GET** `/api/events`

**Query Parameters:**

- `search` (optional) - Search in title/description
- `date` (optional) - Filter by date (YYYY-MM-DD)
- `isActive` (optional) - Filter by status

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "count": 2,
  "data": {
    "events": [
      {
        "_id": "692aa7e30cb983616f596f5e",
        "title": "Global Tech Summit 2025",
        "description": "Technology conference...",
        "date": "2025-12-15T00:00:00.000Z",
        "time": "09:00",
        "location": "San Francisco",
        "maxParticipants": 5000,
        "isActive": true
      }
    ]
  }
}
```

---

### Create Event

**POST** `/api/events`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**

```json
{
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "date": "2025-12-15",
  "time": "09:00",
  "location": "Convention Center",
  "maxParticipants": 100
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "event": {
      "_id": "692aa7e30cb983616f596f5e",
      "title": "Tech Conference 2025",
      "description": "Annual technology conference",
      "date": "2025-12-15T00:00:00.000Z",
      "time": "09:00",
      "location": "Convention Center",
      "maxParticipants": 100,
      "participants": [],
      "isActive": true
    }
  }
}
```

---

### Register for Event

**POST** `/api/events/:id/register`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Successfully registered for event. Confirmation email sent.",
  "data": {
    "event": {
      "_id": "692aa7e30cb983616f596f5e",
      "title": "Global Tech Summit 2025",
      "participants": [
        {
          "userId": "692a9f880cb983616f596f03",
          "registeredAt": "2025-11-29T08:00:00.000Z"
        }
      ]
    }
  }
}
```

---

## 📁 Project Structure

```
vem/
├── src/
│   ├── __tests__/
│   │   ├── setup.ts
│   │   ├── auth.test.ts
│   │   └── event.test.ts
│   ├── config/
│   │   ├── config.ts
│   │   └── database.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── event.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── authorization.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── Event.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── event.routes.ts
│   ├── utils/
│   │   ├── auth.utils.ts
│   │   ├── email.utils.ts
│   │   └── errors.ts
│   ├── app.ts
│   └── server.ts
├── dist/
├── coverage/
├── .env
├── .env.example
├── .gitignore
├── jest.config.js
├── nodemon.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🏗️ Architecture

### Application Flow

```
Client Request
    ↓
Express Server
    ↓
Routes
    ↓
Middleware (auth, validation)
    ↓
Controllers
    ↓
Models
    ↓
MongoDB Atlas
    ↓
Response
```

### Key Design Patterns

1. **MVC Architecture** - Separation of concerns
2. **Middleware Pattern** - Reusable authentication
3. **Repository Pattern** - Database abstraction
4. **Error Handling** - Centralized middleware
5. **Dependency Injection** - Environment configuration

---

## 🔒 Security Features

### Password Security

- Bcrypt hashing (10 salt rounds)
- Never stored in plain text
- Excluded from API responses

### JWT Authentication

- Stateless session management
- Token expiration (7 days)
- Signed with secret key

### Input Validation

- Express Validator for all inputs
- Type safety with TypeScript
- Sanitization to prevent injection

### Error Handling

- Centralized error middleware
- No sensitive data in errors
- Appropriate HTTP status codes

---

## ⚙️ Environment Variables

| Variable       | Description        | Required |
| -------------- | ------------------ | -------- |
| PORT           | Server port        | Yes      |
| NODE_ENV       | Environment        | Yes      |
| MONGODB_URI    | MongoDB connection | Yes      |
| JWT_SECRET     | JWT signing secret | Yes      |
| JWT_EXPIRE     | Token expiration   | Yes      |
| EMAIL_HOST     | SMTP server        | Yes      |
| EMAIL_PORT     | SMTP port          | Yes      |
| EMAIL_USER     | Email account      | Yes      |
| EMAIL_PASSWORD | Email password     | Yes      |
| EMAIL_FROM     | From address       | Yes      |

---

## 💻 Usage Examples

### cURL Examples

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123","role":"attendee"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'

# Get events
curl -X GET http://localhost:3000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create event
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Event","description":"Description","date":"2025-12-15","time":"09:00","location":"Place"}'

# Register for event
curl -X POST http://localhost:3000/api/events/EVENT_ID/register \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem:** Can't connect to MongoDB Atlas

**Solutions:**

1. Check internet connection
2. Verify MongoDB URI in `.env`
3. Whitelist your IP in Atlas dashboard
4. Check username/password

---

### Email Not Sending

**Problem:** Confirmation emails not sent

**Solutions:**

1. Verify email configuration in `.env`
2. Use Gmail App Password (not regular password)
3. Check SMTP settings
4. Check spam folder

---

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use`

**Solutions:**

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001
```

---

### Tests Failing

**Solutions:**

```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules && npm install
```

---

## 📈 Future Enhancements

- [ ] Pagination for event listings
- [ ] Event categories and tags
- [ ] File uploads for event images
- [ ] Calendar integration (iCal)
- [ ] Real-time notifications (WebSockets)
- [ ] API rate limiting
- [ ] OAuth social login

---

## 📄 License

ISC License

---

## 📝 Changelog

### Version 1.0.0 (2025-11-29)

- Initial release
- User authentication with JWT
- Event CRUD operations
- Participant management
- Email notifications
- Comprehensive testing (35 tests)

---

**Built with ❤️ using Node.js, TypeScript, and MongoDB**
