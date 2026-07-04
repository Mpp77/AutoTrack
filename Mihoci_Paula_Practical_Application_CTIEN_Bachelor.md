# AutoTrack - Management of Car Expenses

  A full-stack application (PWA) for the centralized management of car expenses, documents, and maintenance alerts.

  **Live Application:**
You can access the application directly here: https://auto-track-sooty.vercel.app/

## 1. Project Description

  AutoTrack solves the problem of manually managing vehicle expenses by offering a centralized solution with automated logic for maintenance alerts.

  Technologies used:
* **Frontend:** React, Vite, React Router, Recharts (for graphs), i18next (RO/EN)
* **Backend:** Node.js, Express, JWT Authentication
* **Database:** PostgreSQL (Neon)
* **Deployment:** Vercel (Frontend), Render (Backend).
  
## 2. Repository Address

* Repository URL: https://github.com/Mpp77/AutoTrack

## 3. Build steps

  Make sure you have [Node.js](https://nodejs.org/) installed (v18+).
  
1. Clone the repository:
   ```bash
   git clone https://github.com/Mpp77/AutoTrack.git
   cd AutoTrack

2. Install the dependencies for the Frontend:
    ```bash
     npm install

3. Install the dependencies for the Backend:
    ```bash
     cd server
     npm install

4. Environment variable configuration:

  In the server directory, create an ```.env ``` file with the following variables required for the Neon database connection and token security:

      DATABASE_URL= <enter_neon_connection_string_here>
      JWT_SECRET= <enter_token_secret_key_here>
    
## 4. Installation and launch steps

The application runs on two different ports for development:

1. Launching the Backend (API):

  From the server directory, run:
  
    cd server
    node server.js

2. Launching the Frontend:

  From the project's root directory, run:
  
    npm run dev
    
    
3. Access:
Open the browser at <http://localhost:5173>.

