# WordWell — Full Stack Blog Application

A full stack blog platform built as part of the Codomax internship program (Modules 1–6). Users can register, log in, write posts, edit or delete their own posts, browse all posts with search and category filters, and manage their profile from a personal dashboard.

**Live demo:** _add your deployed link here after Module 6 deployment_
**Video/screenshots:** _optional, add if your LinkedIn post includes a walkthrough_

---

## Tech stack

| Layer     | Tech |
|-----------|------|
| Frontend  | HTML, CSS, vanilla JavaScript |
| Backend   | Node.js, Express.js |
| Database  | MongoDB (Mongoose) |
| Auth      | JWT (JSON Web Tokens) + bcrypt password hashing |

## Project structure

```
wordwell/                  → Frontend (Module 1, 3, 4, 5)
  index.html                 Home — all posts, search + category filter
  login.html                 Log in
  register.html               Sign up
  dashboard.html              Logged-in user's posts, stats, edit/delete
  create-blog.html            Write a new post
  edit-blog.html              Update an existing post
  post.html                   Single post detail view
  profile.html                View/edit display name, logout
  css/style.css                Shared styling
  js/app.js                    All data logic (see note below)

wordwell-backend/          → Backend (Module 2, 3, 4, 5)
  server.js                   Express app entry point
  config/db.js                 MongoDB connection
  models/User.js, Blog.js      Mongoose schemas
  controllers/                 Route logic (auth, blogs)
  routes/                      API route definitions
  middleware/auth.js           JWT route protection
```

## How the frontend talks to the backend

Right now `js/app.js` stores everything in the browser's `localStorage` so every page works on its own without a server — useful for demoing Module 1 by itself. Every function that touches data (login, register, create/edit/delete post, profile update) has a `// TODO(Module 2)` comment showing the exact `fetch()` call that replaces it once you point the frontend at the live backend. Swap them one at a time; no HTML needs to change.

Example — the real login call once the backend is deployed:
```js
async function loginUser({ email, password }) {
  const res = await fetch("https://YOUR-BACKEND-URL/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  localStorage.setItem("token", data.token);
  localStorage.setItem("wordwell_session", JSON.stringify(data.user));
  return data.user;
}
```
For protected requests, attach the saved token: `Authorization: "Bearer " + localStorage.getItem("token")`.

## API reference (backend)

### Auth
| Method | Route | Body | Auth? |
|---|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` | No |
| POST | `/api/auth/login` | `{ email, password }` | No |
| GET  | `/api/auth/me` | — | Yes |
| PUT  | `/api/auth/profile` | `{ name }` | Yes |

### Blogs
| Method | Route | Body | Auth? |
|---|---|---|---|
| GET | `/api/blogs` | — (`?search=&category=` optional) | No |
| GET | `/api/blogs/mine` | — | Yes |
| GET | `/api/blogs/:id` | — | No |
| POST | `/api/blogs` | `{ title, body, category }` | Yes |
| PUT | `/api/blogs/:id` | `{ title, body, category }` | Yes (own posts only) |
| DELETE | `/api/blogs/:id` | — | Yes (own posts only) |

---

## Run it locally

**Backend**
```
cd wordwell-backend
npm install
cp .env.example .env    # then fill in MONGO_URI and JWT_SECRET
npm run dev
```
Runs on `http://localhost:5000`.

**Frontend**
Open `wordwell/index.html` with VS Code's Live Server extension (or just double-click it). No build step needed.

---

## Deploying (Module 6)

### Backend — Render (recommended, free tier)
1. Push `wordwell-backend/` to GitHub.
2. On [render.com](https://render.com), create a **New Web Service**, connect the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables `MONGO_URI` and `JWT_SECRET` in Render's dashboard (use a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster for `MONGO_URI`).
5. Deploy. Copy the live URL, e.g. `https://wordwell-api.onrender.com`.

### Frontend — Netlify or Vercel
1. In `js/app.js`, replace every `TODO(Module 2)` localStorage function body with the matching `fetch()` call pointed at your Render backend URL (see example above).
2. Push `wordwell/` to GitHub.
3. On [netlify.com](https://netlify.com) or [vercel.com](https://vercel.com), import the repo, no build command needed for plain HTML — just deploy.
4. Copy the live site link into this README under "Live demo" at the top.

---

## Submission checklist (per module)
- [ ] GitHub repository link (with all files actually pushed — not an empty repo)
- [ ] LinkedIn post link
- [ ] Live website link (Module 6 only)
