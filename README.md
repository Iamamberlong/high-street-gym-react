🏋️‍♀️ High Street Gym Booking System

A full-stack web application for class management, bookings, and member engagement.

📋 Project Overview

This project was developed for High Street Gym, a Brisbane-based fitness company expanding across multiple locations.
The web application allows members, trainers, and administrators to interact with the gym’s ecosystem through a secure, responsive, and user-friendly platform.

The system was designed and implemented in three phases:
Backend Development (Phase 1):
Server-side website integrated with a database for gym and booking management.

Frontend Mobile-First Design (Phase 2):
Proof-of-concept interface built using a modern web framework.

Full-Stack Integration (Phase 3):
Backend and frontend integration, including XML import functionality for activities and locations.

🚀 Features
🧍 User Authentication & Authorization

Secure login using email and password.

Role-based access control: Member, Trainer, and Administrator.

Authorization determines which pages and functions are accessible to each role.

🗓️ Class Bookings

Members can view scheduled classes on a weekly calendar.

Ability to book, view, and cancel class sessions.

Trainers can manage their own class schedules.

Administrators can manage all bookings.

💬 Members’ Blog

Members can create and delete their own posts.

Administrators can moderate all posts.

All users (including guests) can view the blog.

🛠️ Management Features

CRUD (Create, Read, Update, Delete) operations for:

Users

Classes

Bookings

Blog posts

Search and filter functions:

Filter classes by date range or trainer

Filter bookings by member

🧩 XML Import Functionality

Import activities and locations from XML documents into the database.

Validated and sanitized to prevent malformed data imports.

🌐 Responsive Design

Fully responsive layout from desktop (2840px) to mobile (360px).

Adaptive navigation menus, headers, and footers.

Accessible color contrast and scalable typography for readability.

🔐 Security & Data Integrity

Input validation, sanitization, and parameter binding to prevent SQL/NoSQL injection.

Referential integrity and key constraints enforced in the database.

Passwords stored securely using hashing algorithms.

🧱 Tech Stack
Layer	Technology Used
Frontend	HTML5, CSS3, JavaScript (Vanilla / Framework such as React or Vue, depending on your implementation)
Backend	Node.js with Express.js
Database	MongoDB (NoSQL)
Authentication	JSON Web Tokens (JWT) or session-based auth
Styling & UI	Bootstrap / Tailwind CSS / Custom CSS
Version Control	Git & GitHub
Data Import	XML Parsing with Node modules (xml2js or similar)

⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/Iamamberlong/high-street-gym-react.git
cd high-street-gym-react

2. Install dependencies
npm install

3. Configure environment variables

Create a .env file in the project root:
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/highstreetgym
JWT_SECRET=yourSecretKey

4. Run the frontend and backend server seperately by:

cd frontend
npm run -w frontend dev
cd backend
npm run -w backend start

Access the site at http://192.168.50.103:5173/

🗃️ Database Structure

Key collections/tables include:

Users: stores login credentials, role, and profile info

Classes: stores activity type, trainer, date/time, and location

Bookings: links users to classes (many-to-many)

Posts: member blog posts

Locations & Activities: imported from XML files

All collections enforce key constraints and use human-readable joins (no raw foreign keys displayed).

🧪 Testing

Manual and automated testing for major CRUD and authentication features.

Validation testing to ensure required fields and input constraints.

Responsive design tested on multiple devices and screen sizes.
