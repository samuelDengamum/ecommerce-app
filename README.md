# Full Stack Ecommerce Application

This is a full-stack ecommerce application featuring a Next.js (React) frontend and a Node.js (Express + MongoDB) backend. 

## 📁 Project Structure

- **/backend** - Contains the Node.js Express server, MongoDB models, controllers, and APIs.
- **/frontend** - Contains the Next.js App Router UI, components, store, and styles.
- **/mongo-data** - Local MongoDB data storage directory.

## 🚀 Root Commands

We have added helper commands at the root `package.json` so you do not need to navigate into each folder separately, although you can.

To run the whole application from the root folder:

1. **Install dependencies in ALL folders:**
   ```bash
   npm run install:all
   ```

2. **Start BOTH the backend and the frontend together (requires concurrently):**
   ```bash
   npm run dev
   ```

*(Alternatively, run them separately in two different terminal windows as instructed below)*

## 🖥 Backend Service

Located in the `backend/` folder. It uses Express, Mongoose, and Socket.io.

### Setup and Running:

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory with necessary variables (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`).
   *Note: If no .env is provided, it defaults to port 5000 and uses `mongodb-memory-server` if local isn't configured.*
4. Start the server:
   ```bash
   npm start
   ```
   *The server runs by default on http://localhost:5000*

## 🎨 Frontend Service

Located in the `frontend/` folder. Built using Next.js 15+ App router and Tailwind CSS.

### Setup and Running:

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend will run by default on http://localhost:3000 (or 3005 if overridden).*

### Important Frontend Scripts:
- `npm run dev` - Starts development server with hot-reload.
- `npm run build` - Creates an optimized production build of your Next.js application.
- `npm run start` - Starts the application in production mode natively (must run `build` first!).
- `npm run lint` - Runs ESLint to find issues.

## 👨‍💻 API Documentation & Routes

Available Backend Routes:
- `POST /api/auth/register` - Registers a new user.
- `POST /api/auth/login` - Authenticates a user and returns a token.
- `GET /api/products` - Returns a catalog of available products.
- `GET /api/products/:id` - Returns detailed information on a single product.

*(Refer to the individual controller files inside `backend/controllers/` for more deep-dive logic documentation).*
