/* ==========================================================================
   WordWell — app.js
   Module 1 (frontend only): data lives in localStorage so every page
   works end-to-end without a server. Each function below is written so
   Module 2 can swap the body for a `fetch('/api/...')` call without
   touching any page's HTML or event wiring — see the TODO markers.
   ========================================================================== */

const DB_KEYS = {
  USERS: "wordwell_users",
  SESSION: "wordwell_session",
  POSTS: "wordwell_posts",
};

/* ---------- tiny storage helpers ---------- */

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* seed a couple of sample posts on first run so Home never looks broken */
function seedIfEmpty() {
  const posts = readStore(DB_KEYS.POSTS, null);
  if (posts === null) {
    writeStore(DB_KEYS.POSTS, [
      {
        id: crypto.randomUUID(),
        title: "Why I write things down before I understand them",
        body: "Some ideas only become clear once they're on the page. This blog is where I keep the drafts...",
        author: "WordWell Team",
        date: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Setting up your first local dev environment",
        body: "A short walkthrough of the tools you need before writing a single line of HTML...",
        author: "WordWell Team",
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ]);
  }
}
seedIfEmpty();

/* ---------- auth ---------- */

// TODO(Module 2): replace body with
//   const res = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify({name, email, password}) })
function registerUser({ name, email, password }) {
  const users = readStore(DB_KEYS.USERS, []);
  if (users.some((u) => u.email === email)) {
    throw new Error("An account with that email already exists.");
  }
  const user = { id: crypto.randomUUID(), name, email, password };
  users.push(user);
  writeStore(DB_KEYS.USERS, users);
  return user;
}

// TODO(Module 2): replace body with
//   const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({email, password}) })
function loginUser({ email, password }) {
  const users = readStore(DB_KEYS.USERS, []);
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Incorrect email or password.");
  writeStore(DB_KEYS.SESSION, { userId: user.id, name: user.name, email: user.email });
  return user;
}

function getSession() {
  return readStore(DB_KEYS.SESSION, null);
}

function logout() {
  localStorage.removeItem(DB_KEYS.SESSION);
  window.location.href = "index.html";
}

function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = "login.html";
  }
  return session;
}

/* ---------- posts ---------- */

// TODO(Module 2): replace with `const res = await fetch('/api/blogs')`
function getAllPosts() {
  return readStore(DB_KEYS.POSTS, []).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getPostsByAuthor(name) {
  return getAllPosts().filter((p) => p.author === name);
}

// TODO(Module 2): replace with `await fetch('/api/blogs', { method: 'POST', body: ... })`
function createPost({ title, body, author }) {
  const posts = readStore(DB_KEYS.POSTS, []);
  const post = { id: crypto.randomUUID(), title, body, author, date: new Date().toISOString() };
  posts.unshift(post);
  writeStore(DB_KEYS.POSTS, posts);
  return post;
}

// TODO(Module 2): replace with `await fetch('/api/blogs/' + id, { method: 'DELETE' })`
function deletePost(id) {
  const posts = readStore(DB_KEYS.POSTS, []).filter((p) => p.id !== id);
  writeStore(DB_KEYS.POSTS, posts);
}

/* ---------- formatting ---------- */

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function excerpt(text, len = 110) {
  return text.length > len ? text.slice(0, len).trim() + "…" : text;
}

/* ---------- shared header wiring ---------- */

function paintHeaderAuthState() {
  const session = getSession();
  const authSlot = document.querySelector("[data-auth-slot]");
  if (!authSlot) return;

  if (session) {
    authSlot.innerHTML = `
      <a href="dashboard.html">Dashboard</a>
      <a href="#" data-logout>Log out</a>
    `;
    authSlot.querySelector("[data-logout]").addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  } else {
    authSlot.innerHTML = `
      <a href="login.html">Log in</a>
      <a href="register.html" class="btn btn-primary" style="padding:0.5rem 1.1rem;">Sign up</a>
    `;
  }
}

document.addEventListener("DOMContentLoaded", paintHeaderAuthState);
