# ShopHub — Phase-1 (Full Stack)

This repository contains a Phase-1 full-stack e-commerce sample app:
- Backend: Node.js + Express + Mongoose
- Frontend: React (Create React App style)

What is included
- Backend API endpoints for products with pagination, filtering and meta endpoints
- Mongoose models and a `seed.js` file that seeds categories and many products
- React frontend showing product listing, filters, product detail and cart

Quick start (local)

Prerequisites
- Node.js 18+
- MongoDB running locally (default URI used: `mongodb://localhost:27017/ecommerce`)

Backend

1. Install dependencies and seed the database:

```cmd
cd backend
npm install
npm run seed
```

2. Start the backend server:

```cmd
npm run dev
```

The backend will run on port 5000 by default. API base: `http://localhost:5000/api`.

Frontend

1. Open a new terminal and install frontend deps:

```cmd
cd frontend
npm install
npm start
```

2. The React app uses a proxy to `http://localhost:5000` for API calls. Open `http://localhost:3000`.

Git / Publishing

This project is not automatically pushed to GitHub. To publish the current workspace to GitHub:

```cmd
cd "e:\BackEnd\E-Commerce 1"
git init
git add .
git commit -m "Phase-1: Fullstack e-commerce scaffold"
REM Create a repository on GitHub and then:
git remote add origin https://github.com/<your-username>/<repo>.git
git branch -M main
git push -u origin main
```

Notes
- Phase-1 focuses on product browsing, filtering and cart UX. Checkout and payments are not implemented.
- If you want, I can help create a GitHub repo and push the code (I'll need your authorization or a personal access token).

