# WordWell — Backend (Module 2: Backend Development)

Node.js + Express + MongoDB REST API for the WordWell blog app.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your own values:
   ```
   cp .env.example .env
   ```
   - `MONGO_URI` — your MongoDB connection string (local MongoDB or a free MongoDB Atlas cluster)
   - `JWT_SECRET` — any long random string, used to sign login tokens
3. Run the server:
   ```
   npm run dev
   ```
   Server starts on `http://localhost:5000` (or whatever `PORT` you set).

## API Endpoints

### Auth
| Method | Route              | Body                              | Auth? |
|--------|---------------------|------------------------------------|-------|
| POST   | `/api/auth/register` | `{ name, email, password }`       | No    |
| POST   | `/api/auth/login`    | `{ email, password }`             | No    |

Both return `{ token, user }`. Store `token` on the frontend (e.g. `localStorage`) and send it as `Authorization: Bearer <token>` on protected requests.

### Blogs
| Method | Route             | Body                  | Auth? |
|--------|-------------------|------------------------|-------|
| GET    | `/api/blogs`      | —                      | No    |
| GET    | `/api/blogs/mine` | —                      | Yes   |
| GET    | `/api/blogs/:id`  | —                      | No    |
| POST   | `/api/blogs`      | `{ title, body }`      | Yes   |
| PUT    | `/api/blogs/:id`  | `{ title, body }`      | Yes (own posts only) |
| DELETE | `/api/blogs/:id`  | —                      | Yes (own posts only) |

## Connecting to the Module 1 frontend

In the frontend's `js/app.js`, each function has a `// TODO(Module 2)` comment. Replace those localStorage-based bodies with `fetch()` calls to these endpoints, for example:

```js
async function loginUser({ email, password }) {
  const res = await fetch("http://localhost:5000/api/auth/login", {
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

For protected requests (create/delete blog, `/mine`), attach the saved token:

```js
fetch("http://localhost:5000/api/blogs", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
  body: JSON.stringify({ title, body }),
});
```

## Submission checklist
- [ ] GitHub repository link (push the real files, not an empty repo)
- [ ] LinkedIn post link
