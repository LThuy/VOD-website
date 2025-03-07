**Running the Project Locally**
Account For Test: 
email: admin@gmail.com
password: admin123456

You can also create your own account via your email!

STEP-BY-STEP TO RUN OUR PROJECT 
1. **Open the Root Folder**  
   - Launch **Visual Studio Code** and open the project's root folder.

2. **Start Services in Separate Terminals**  
   - Open **4 terminals** in the root folder and execute the following steps:

   **Terminal 1: Start the Client**  
   ```
   cd client
   npm install
   npm start
   ```

   **Terminal 2: Start the Server**  
   ```
   cd server
   npm install
   npm start
   ```

   **Terminal 3: Start the VOD Dashboard**  
   ```
   cd voddashboard
   npm install
   npm start
   ```

   **Terminal 4: Start the Worker**  
   ```sh
   cd worker
   npm install
   npm start
   ```

---

**Running the Project on Deployment**

1. **Access Deployed Services:**
   - **Client:** [https://feelfilm.vercel.app]
   - **Server:** [https://vod-backend-server.vercel.app]
   - **Dashboard:** [https://vod-dashboard-admin.vercel.app]

2. **Start Required Services for Upload Section:**
   - Open **two terminals** and run the following:

   **Terminal 1: Start the Server**  
   ```sh
   cd server
   npm install
   npm start
   ```

   **Terminal 2: Start the Worker**  
   ```sh
   cd worker
   npm install
   npm start
   ```

3. **Modify Environment Variables:**
   - Update the `.env` file in the `server` folder:
     ```sh
     CLIENT_DASHBOARD_URL=https://vod-dashboard-admin.vercel.app
     ```

Now, the project should be fully operational on deployment.

