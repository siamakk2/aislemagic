# AisleBird Authentication Setup Guide

## ✅ What We've Created

1. **API Functions** (in `/api/` folder):
   - `auth/signup.js` - User registration
   - `auth/login.js` - User login
   - `lists/save.js` - Save shopping lists
   - `lists/load.js` - Load shopping lists
   - `user/profile.js` - Get user profile

2. **Database** (Supabase PostgreSQL):
   - `users` table - Store usernames & hashed passwords
   - `lists` table - Store each user's lists per store
   - `list_items` table - Store items in each list

---

## 📋 Setup Instructions

### Step 1: Install Dependencies

Run in your project root:
```bash
npm install @supabase/supabase-js bcryptjs jsonwebtoken
```

### Step 2: Add Environment Variables to Vercel

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add these three variables:

```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_SERVICE_KEY = [your-service-key-from-supabase]
JWT_SECRET = [generate-random-string-32-chars-or-more]
```

**How to get them:**
1. Go to **Supabase Dashboard** → Your Project
2. **Settings** → **API** → Copy:
   - Project URL → `SUPABASE_URL`
   - Service Role Secret → `SUPABASE_SERVICE_KEY`
3. For `JWT_SECRET`: Open terminal and run:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output as your JWT_SECRET

### Step 3: Update AisleBird App with Login UI

We need to add a login screen to `/app/index.html`. I'll do this in the next step.

### Step 4: Integrate Frontend Code

The frontend will:
- Show login/signup form
- Call `/api/auth/signup` or `/api/auth/login`
- Store JWT token in localStorage
- Use token to save/load lists from backend

---

## 🔑 API Endpoints Summary

### Authentication

**POST /api/auth/signup**
```json
{
  "username": "john",
  "password": "password123"
}
```
Returns: `{ token, user: { id, username } }`

**POST /api/auth/login**
```json
{
  "username": "john",
  "password": "password123"
}
```
Returns: `{ token, user: { id, username } }`

### Lists

**POST /api/lists/save**
- Header: `Authorization: Bearer [token]`
```json
{
  "storeId": "wf-napa",
  "items": [
    { "name": "Apples", "qty": 2, "checked": false, "cat": "Produce" }
  ]
}
```

**GET /api/lists/load?storeId=wf-napa**
- Header: `Authorization: Bearer [token]`
Returns: `{ items: [...] }`

### User

**GET /api/user/profile**
- Header: `Authorization: Bearer [token]`
Returns: `{ user: { id, username, createdAt, listsCount } }`

---

## 📝 Next Steps

1. Deploy these API files to Vercel (push to main/deployment branch)
2. Add environment variables to Vercel dashboard
3. I'll update the AisleBird UI with login screen
4. Frontend will sync lists with backend

---

## 🛡️ Security Notes

- Passwords are hashed with bcrypt (never stored plain text)
- JWT tokens expire after 30 days
- All API endpoints require valid token
- Row Level Security (RLS) ensures users only see their own data

Ready? Let me know when you've:
1. ✅ Added Supabase keys to Vercel
2. ✅ Run `npm install`
3. ✅ Deployed the API files

Then I'll update the AisleBird app UI!
