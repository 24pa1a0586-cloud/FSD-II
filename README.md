# Restaurant Table Reservation System (MERN Stack)

A complete, clean, and responsive Full Stack Development (FSD) mini project built using **React (Vite)**, **Node.js**, **Express.js**, and **MongoDB (Mongoose)** for table reservations at **The Food Corner**.

---

## 1. Project Overview & Objectives

In dining establishments, handling customer reservations manually over the phone or via paper logbooks often leads to scheduling clashes, unrecorded cancellations, and customer dissatisfaction. 

This project provides a computerized table reservation system that allows customers to:
1. Browse restaurant details and operating hours.
2. Explore a categorized dining menu with descriptions and prices.
3. Reserve dining tables by providing their details, party size (1–10 guests), date, and time slot.
4. Retrieve existing reservations by email.
5. Cancel reservations seamlessly with soft-cancellation (updating the database status rather than permanently deleting the record).
6. Enforce slot-based capacity limits to prevent table overbooking.

---

## 2. Technologies Used

- **Frontend:** React (v18) built with Vite (Fast HMR and bundling)
- **Routing:** React Router DOM (v6)
- **Styling:** Vanilla Plain CSS (clean, responsive, college-lab-friendly design system)
- **Backend:** Node.js & Express.js (REST API architecture)
- **Database:** MongoDB with Mongoose ODM (Object Data Modeling)
- **API Communication:** Browser Native Fetch API
- **Environment Management:** `dotenv`

> **Note:** Strictly follows the requirement of avoiding unnecessary bloat (no Next.js, Redux, TypeScript, Tailwind CSS, or Firebase).

---

## 3. Main Features

- **Home Page:**
  - Welcome banner for "The Food Corner".
  - Quick action buttons ("Book a Table", "View Menu").
  - Restaurant opening hours (Lunch: 12:00 PM – 3:30 PM, Dinner: 7:00 PM – 10:30 PM).
  - Contact details, address, and table reservation policy.

- **Menu Page:**
  - Categorized list of dishes (Starters, Main Course, Desserts, Beverages).
  - Veg and Non-Veg visual indicators.
  - Category filter tabs ("All", "Starters", "Main Course", etc.) and instant live search.
  - Direct "Book Table" link on items.

- **Reservation Page:**
  - Validated input fields: Full Name, Email, Phone, Date, Time Slot, Guests (1–10), and Special Requests.
  - Client-side and server-side validation.
  - Prevention of past-date bookings (`min` date attribute + server validation).
  - Slot capacity checking (configurable limit per date and time slot).
  - Clear success receipt card displaying MongoDB Reservation ID upon confirmation.
  - Informative error banners when the database is unavailable or slot is fully booked.

- **My Reservations Page:**
  - Email-based lookup: customers retrieve their bookings simply by entering their email address.
  - Detailed reservation cards with status badge (`● Confirmed` or `✕ Cancelled`).
  - Safe cancellation with confirmation modal dialog.
  - Soft-delete: Updates status to `Cancelled` in MongoDB so records remain preserved for restaurant auditing.

---

## 4. Folder Structure

```text
restaurant-reservation-system/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Navigation bar with responsive mobile menu
│   │   │   ├── Footer.jsx         # Restaurant footer with hours & contact info
│   │   │   └── StatusBadge.jsx    # Status indicator (Confirmed / Cancelled)
│   │   ├── data/
│   │   │   └── menuData.js        # Static menu items with categories and prices
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page with restaurant info
│   │   │   ├── Menu.jsx           # Food menu with category filtering & search
│   │   │   ├── Reservation.jsx    # Table booking form with validation
│   │   │   └── MyReservations.jsx # Lookup & cancel reservations by email
│   │   ├── App.jsx                # Main layout and React Router routes
│   │   ├── main.jsx               # React DOM entry point
│   │   └── styles.css             # Clean, minimal CSS styling
│   ├── index.html                 # HTML entry point
│   ├── vite.config.js             # Vite configuration with API proxy to port 5000
│   └── package.json               # Frontend dependencies & scripts
├── server/
│   ├── models/
│   │   └── Reservation.js         # Mongoose schema and model definition
│   ├── routes/
│   │   └── reservationRoutes.js   # REST API route handlers
│   ├── .env                       # Local environment variables
│   ├── .env.example               # Template environment configuration
│   ├── seed.js                    # Database seed script with sample reservations
│   ├── server.js                  # Express server entry point & DB connection
│   └── package.json               # Backend dependencies & scripts
├── .gitignore
├── package.json                   # Root package.json for convenience scripts
└── README.md
```

---

## 5. Prerequisites

Before running the project, ensure you have:
1. **Node.js** (v18 or higher recommended; check with `node -v`)
2. **npm** (v9 or higher; check with `npm -v`)
3. A **MongoDB database instance**:
   - Either a **locally installed MongoDB** Community Server running at `mongodb://127.0.0.1:27017`
   - OR a free cloud cluster on **MongoDB Atlas**

---

## 6. Installation & Configuration

### Step 1: Clone or Open the Workspace

Open the project directory in your terminal or IDE:
```bash
cd restaurant-reservation-system
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../client
npm install
```

### Step 4: Configure MongoDB Connection

In the `server/` directory, open `.env` (or copy `.env.example` to `.env`):

#### Option A: Using Local MongoDB Server
If you have MongoDB installed locally as a Windows service:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/restaurant_db
MAX_RESERVATIONS_PER_SLOT=5
```
Ensure your local MongoDB service is started:
```powershell
net start MongoDB
```

#### Option B: Using Free MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in/register for free.
2. Create a free shared cluster (M0 sandbox).
3. Under **Database Access**, create a user with a username and password.
4. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere).
5. Click **Connect** -> **Drivers** (Node.js) and copy the connection string.
6. Paste it into `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/restaurant_db?retryWrites=true&w=majority
MAX_RESERVATIONS_PER_SLOT=5
```
*(Replace `<username>` and `<password>` with your database user credentials).*

---

## 7. Commands to Start the Project

### Running Backend (Terminal 1)
```bash
cd server
npm run dev
```
- Server starts at: `http://localhost:5000`
- API Health check: `http://localhost:5000/api/health`
- Reservations API: `http://localhost:5000/api/reservations`

### Running Frontend (Terminal 2)
```bash
cd client
npm run dev
```
- Open your browser at: **`http://localhost:3000`**

### (Optional) Seed Sample Reservations
Once your MongoDB connection is established, populate sample reservations for lab demo:
```bash
cd server
npm run seed
```

---

## 8. REST API Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Request Body / Query | Success Response Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server and database status check | None | `200 OK` |
| `GET` | `/reservations` | Retrieve reservations (all or by email) | Query: `?email=user@example.com` | `200 OK` |
| `GET` | `/reservations/:id` | Retrieve single reservation by MongoDB ID | Param: `:id` | `200 OK` |
| `POST` | `/reservations` | Create a new table reservation | JSON body with reservation details | `201 Created` |
| `PATCH` | `/reservations/:id/cancel` | Cancel an existing reservation (sets status to 'Cancelled') | Param: `:id` | `200 OK` |

### Sample JSON Request Body for `POST /api/reservations`:
```json
{
  "customerName": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "phone": "9876543210",
  "reservationDate": "2026-10-30",
  "reservationTime": "07:30 PM",
  "guests": 4,
  "specialRequests": "Window booth preferred"
}
```

### Sample JSON Response:
```json
{
  "success": true,
  "message": "Reservation successfully confirmed!",
  "data": {
    "_id": "671bd419d832a8298f24a1b0",
    "customerName": "Rahul Sharma",
    "email": "rahul.sharma@example.com",
    "phone": "9876543210",
    "reservationDate": "2026-10-30",
    "reservationTime": "07:30 PM",
    "guests": 4,
    "specialRequests": "Window booth preferred",
    "status": "Confirmed",
    "createdAt": "2026-10-25T16:15:21.000Z",
    "updatedAt": "2026-10-25T16:15:21.000Z"
  }
}
```

---

## 9. Business Rules & Reservation Logic

1. **Past Date Prevention:** Customers cannot select past dates. Both the HTML date picker (`min` attribute) and the backend Express route reject dates earlier than today.
2. **Guest Limits:** Table parties must be between 1 and 10 guests.
3. **Slot Capacity Management:** The system checks how many `Confirmed` reservations exist for the requested `reservationDate` and `reservationTime`. If the count reaches `MAX_RESERVATIONS_PER_SLOT` (default: 5), the backend returns HTTP 400 with a friendly notice to select another slot.
4. **Soft Deletion / Cancellation:** When a customer cancels, the record is NOT erased. The `status` field is updated from `Confirmed` to `Cancelled`.
5. **No Double Cancellation:** Attempting to cancel an already cancelled reservation returns HTTP 400.
6. **Graceful DB Disconnect Handling:** If MongoDB is offline, requests return HTTP 503 with an actionable explanation instead of crashing.

---

## 10. How It Works (Lab Evaluation / Viva Guide)

### How React Communicates with Express
1. The user fills in the reservation form in React (`Reservation.jsx`).
2. When the user clicks **Confirm Reservation**, React invokes the native `fetch()` function to send an asynchronous HTTP POST request to `/api/reservations`.
3. In development, the Vite dev server (`vite.config.js`) proxies requests from `http://localhost:3000/api/*` to `http://localhost:5000/api/*`. This eliminates Cross-Origin Resource Sharing (CORS) complications.
4. Express receives the request, parses the JSON body via `express.json()` middleware, and routes it to `reservationRoutes.js`.

### How Express Interacts with MongoDB
1. When the Express server boots up (`server.js`), Mongoose establishes an active connection pool using `mongoose.connect(MONGODB_URI)`.
2. The schema defined in `models/Reservation.js` validates data types, required fields, and constraints (e.g. min/max guests, email regex).
3. The Express route handler calls Mongoose methods:
   - `Reservation.find({ email })` to fetch reservations.
   - `Reservation.countDocuments({ reservationDate, reservationTime, status: 'Confirmed' })` to check slot capacity.
   - `new Reservation(...).save()` to insert a new document.
   - `reservation.save()` after setting `reservation.status = 'Cancelled'` to update the document.
4. Express formats the database response as JSON and sends it back with the appropriate HTTP status code (`200`, `201`, `400`, `404`, or `500`).
5. React receives the JSON response and updates the UI state (rendering the confirmation card or error banner).
