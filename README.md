# WordWell — Blog App (Module 1: Frontend Development)

A responsive blog application frontend built with plain HTML, CSS, and JavaScript.

## Pages
- `index.html` — Home, lists all posts
- `login.html` — Log in
- `register.html` — Sign up
- `dashboard.html` — Logged-in user's posts + stats
- `create-blog.html` — Write a new post

## Run it locally
No build step needed — it's plain HTML/CSS/JS.

1. Open the folder in VS Code.
2. Right-click `index.html` → **Open with Live Server** (or just double-click `index.html` to open it in a browser).
3. That's it. Data is stored in the browser's `localStorage`, so registering, logging in, and publishing posts all work without a backend.

## How it works right now
`js/app.js` has small functions (`registerUser`, `loginUser`, `getAllPosts`, `createPost`, `deletePost`, etc.) that read/write to `localStorage`. This lets every page function end-to-end for Module 1 even before a server exists.

## Handing off to Module 2 (Backend Development)
Each function in `js/app.js` that touches data has a `// TODO(Module 2)` comment showing the `fetch()` call that should replace its body once the Express + MongoDB API is ready, e.g.:

```js
// TODO(Module 2): replace body with
//   const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({email, password}) })
```

Swapping these one at a time (register → login → get posts → create post → delete post) is the cleanest way to wire the frontend to the real backend without rewriting any HTML.

## Submission checklist
- [ ] GitHub repository link (push all files, not just create the repo — see note below)
- [ ] LinkedIn post link

> **Note:** an empty GitHub repo won't count as a submission — after `git init`, make sure you actually run `git add .`, `git commit -m "Module 1: frontend"`, and `git push` so the files show up on GitHub.
