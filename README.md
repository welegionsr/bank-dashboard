# Bank Dashboard - Backend

This project is a backend service for a mock banking application, developed to practice various libraries and tools. It features basic authentication and transaction management.
Features

  - User Authentication: Implements basic user registration and login functionalities.
  - Transaction Management: Allows users to perform and track simple banking transactions.

## Technologies Used

  - Node.js: JavaScript runtime environment.
  - Express.js: Web application framework for Node.js.
  - MongoDB: NoSQL database for data storage.
  - Mongoose: Object Data Modeling (ODM) library for MongoDB and Node.js.
  - JWT: JSON Web Tokens for authentication.
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

  - User Registration: POST /api/register
  - User Login: POST /api/login
  - Create Transaction: POST /api/transactions
  - Get Transactions: GET /api/transactions

Note: This project is for practice purposes only and is not intended for production use.
License

This project is licensed under the MIT License. See the LICENSE file for details.
