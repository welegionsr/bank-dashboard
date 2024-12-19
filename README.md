# Bank Dashboard - Backend

This project is a backend service for a mock banking application, developed to practice various libraries and tools. It features basic authentication and transaction management.
### Features

  - User Authentication: Implements user registration and login functionalities with password hashing and JWT-based authentication.
  - Transaction Management: Allows users to perform and track simple banking transactions, including validation for sender and receiver accounts.
  - API Documentation: Integrated Swagger UI for detailed API documentation and easy testing of endpoints.
  - Rate Limiting: Ensures secure and controlled access to the API by limiting the number of requests per client.
  - Input Validation: Validates incoming data to ensure consistency and security using middleware.
  - Error Handling: Centralized error handling for better debugging and user feedback.
  - Environment Configuration: Supports environment-based configuration using .env files.
  - Docker Support: Provides containerized deployment for easy setup and scalability. 

## Technologies Used

  - Node.js: JavaScript runtime environment.
  - Express.js: Web application framework for Node.js.
  - MongoDB: NoSQL database for data storage.
  - Mongoose: Object Data Modeling (ODM) library for MongoDB and Node.js.
  - JWT: JSON Web Tokens for authentication.
  - Swagger UI: API documentation and testing interface.
  - Rate Limiting: Middleware to control API request rates.
  - Docker: Containerization platform for consistent development and deployment. 

## Getting Started
### Prerequisites

  - [Node.js] installed.
  - [MongoDB] installed or access to a MongoDB Atlas cluster.
  - [Docker] installed (optional, for containerization).

## Installation

    Clone the repository:
    git clone https://github.com/welegionsr/bank-dashboard.git
    cd bank-dashboard

### Install dependencies:

    npm install

### Set up environment variables:

Create a .env file in the root directory and add the following:

    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key

## Start the application:

    npm start

  The server will run at http://localhost:3000.

## Using Docker

  Build the Docker image:

    docker build -t bank-dashboard .

## Run the Docker container:

    docker run -d -p 3000:3000 --env-file .env bank-dashboard

  The application will be accessible at http://localhost:3000.

## API Endpoints

  See <server_url>/api-docs/ for the full API specification and swagger features.
  The swagger interface is intentionally left accessible, as this is a learning project.
  (In production, you should limit access!).

Note: This project is for practice purposes only and is not intended for production use.
License

This project is licensed under the MIT License. See the LICENSE file for details.
