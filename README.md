# University Timetable Management System

Welcome to the University Timetable Management System! This system is designed to facilitate the management of timetables, courses, users, and resources within a university setting. It provides a RESTful API for creating, modifying, and querying class schedules for students, faculty, and administrative staff.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Testing](#testing)

## Features

- User authentication and authorization with JWT
- CRUD operations on courses with assignment of faculty
- Creation and modification of weekly timetables for courses
- Management of rooms and resources with availability tracking
- Student enrollment in courses with timetable viewing
- Notification system for timetable changes, room changes, etc.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express.js**: Web application framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing timetable, course, user, and resource data.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JWT**: JSON Web Tokens for secure authentication.
- **Postman**: API development and testing tool for interacting with the endpoints.
- **Jest**: Testing frameworks for unit and integration testing.

## Folder Structure

![sample screenshot](https://github.com/sliitcsse/assignment-01-ChillBroh/blob/main/screenshots/folderstructure.png)

## Setup Instructions

1. **Clone the Repository** 
   ```bash
   git clone https://github.com/sliitcsse/assignment-01-ChillBroh.git
   
2. **Install Dependencies** 
   ```bash
   cd university-timetable
   npm install

3. **Configure Environment Variables:**
   Create a .env file in root directory and add below vaiables
   ```bash
   MONGO_URI = ""
   JWT_SECRET = ""
   NODE_ENV = ""
   JWT_EXPIRES_IN = ""
   APP_URL = 
   
4. **Start the development server**: 
   ```bash
   npm start

## Api Documentation
For detailed documentation on available endpoints and their usage, please refer to the [API Documentation](https://documenter.getpostman.com/view/26795401/2sA35BbizQ).

![sample screenshot](https://github.com/sliitcsse/assignment-01-ChillBroh/blob/main/screenshots/api.png)

##Testing

1. **Run Test Cases** 
   ```bash
   npm test

![sample screenshot](https://github.com/sliitcsse/assignment-01-ChillBroh/blob/main/screenshots/test.png)

**Security Testing** 

find the security folder and open the html file
![sample screenshot](https://github.com/sliitcsse/assignment-01-ChillBroh/blob/main/screenshots/securitytest.png)
   

