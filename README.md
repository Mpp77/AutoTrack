# AutoTrack - Management of Car Expenses

  A full-stack application (PWA) for the centralized management of car expenses, documents, and maintenance alerts.

## 1. Project Description

  AutoTrack solves the problem of manual car expense management by providing a centralized solution featuring "offline-first" capabilities and automated logic for maintenance alerts.
PDF

  Technologies used:
* **Frontend:** React, Vite, React Router, Recharts, i18next (RO/EN)
* **Backend:** Node.js, Express, JWT Authentication
* **Database:** PostgreSQL (Neon)
* **Technologies:** PWA (Service Workers for Offline-First Experience)

## 2. Build steps

  Make sure you have [Node.js](https://nodejs.org/) installed (v18+).
  
1. Clone the repository:
   ```bash
   git clone <URL_REPO>
   cd AutoTrack

2. Install the dependencies for the frontend and server:
    ```bash
     npm install
     cd server && npm install

4. Create a .env file in the server folder with the necessary variables:
    ```bash
    DATABASE_URL=...
    JWT_SECRET=...
    

## 3. Installation and launch steps

  Launching the database: Ensure the PostgreSQL instance is configured.

1. Starting the server (Backend):

    ```bash
    cd server
    npm run dev
    ```

2. Starting the application (Frontend):

    ```bash
    npm run dev
    ```

3. Access:
Open the browser at <http://localhost:5173>.

