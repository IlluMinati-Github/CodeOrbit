# Firebase Authentication Setup Guide

This guide will walk you through setting up Firebase Authentication for your MediLink application step by step.

## Prerequisites

- A Google account
- Node.js and npm installed on your system
- Basic knowledge of Firebase Console

---

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "MediLink")
4. Click **"Continue"**
5. (Optional) Disable Google Analytics if you don't need it, or enable it if you do
6. Click **"Create project"**
7. Wait for the project to be created, then click **"Continue"**

---

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Register your app with a nickname (e.g., "MediLink Web")
3. **Important:** Check the box "Also set up Firebase Hosting" if you plan to host it, or leave it unchecked
4. Click **"Register app"**
5. You'll see your Firebase configuration object. **Copy this information** - you'll need it in the next step

The configuration will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

## Step 3: Enable Email/Password Authentication

1. In the Firebase Console, go to **Authentication** in the left sidebar
2. Click **"Get started"** if you haven't enabled Authentication yet
3. Click on the **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Toggle **"Enable"** to ON
6. Click **"Save"**

---

## Step 4: Install Firebase Package

Open your terminal in the project root directory (`medilink-web`) and run:

```bash
npm install firebase
```

---

## Step 5: Create Environment Variables File

1. In the `medilink-web` folder, create a file named `.env`
2. Copy the contents from `.env.example` (if it exists) or create it with the following structure:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

3. Replace all the placeholder values with your actual Firebase configuration values from Step 2

**Important Notes:**
- Never commit your `.env` file to version control (it should already be in `.gitignore`)
- The `VITE_` prefix is required for Vite to expose these variables to your application
- Make sure there are no spaces around the `=` sign

---

## Step 6: Verify Your Setup

1. Make sure all files are saved
2. Start your development server:
   ```bash
   npm run dev
   ```
3. Navigate to `http://localhost:8080/auth` (or your configured port)
4. Try creating a new account:
   - Click on the **"Sign Up"** tab
   - Enter a name, email, and password (at least 6 characters)
   - Click **"Create Account"**
5. If successful, you should be redirected to the dashboard
6. Check your Firebase Console → Authentication → Users to see your newly created user

---

## Step 7: Test Login

1. Sign out (if you're logged in)
2. Go back to the auth page
3. Click on the **"Login"** tab
4. Enter the email and password you just created
5. Click **"Sign In"**
6. You should be successfully logged in and redirected to the dashboard

---

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- **Solution:** Check that your `.env` file has the correct API key and that all environment variables start with `VITE_`

### Error: "Firebase: Error (auth/email-already-in-use)"
- **Solution:** This email is already registered. Try logging in instead or use a different email

### Error: "Firebase: Error (auth/weak-password)"
- **Solution:** Your password must be at least 6 characters long

### Environment variables not loading
- **Solution:** 
  1. Make sure your `.env` file is in the `medilink-web` folder (not the root)
  2. Restart your development server after creating/modifying `.env`
  3. Check that all variable names start with `VITE_`

### Protected routes redirecting to login
- **Solution:** This is expected behavior. You need to be logged in to access dashboard pages. Make sure you're signed in first.

---

## Project Structure

Here's what was added to your project:

```
medilink-web/
├── src/
│   ├── lib/
│   │   └── firebase.ts          # Firebase configuration
│   ├── contexts/
│   │   └── AuthContext.tsx      # Authentication context provider
│   ├── components/
│   │   └── ProtectedRoute.tsx   # Component for protecting routes
│   └── pages/
│       └── Auth.tsx             # Updated with Firebase auth
├── .env                         # Your Firebase config (create this)
└── docs/
    └── FIREBASE_SETUP.md        # This file
```

---

## Features Implemented

✅ **Sign Up** - Create new user accounts with email and password
✅ **Login** - Sign in with existing credentials
✅ **Logout** - Sign out functionality (can be added to Settings page)
✅ **Protected Routes** - Dashboard pages require authentication
✅ **Auto-redirect** - Redirects to dashboard if already logged in
✅ **Error Handling** - User-friendly error messages via toasts
✅ **Loading States** - Shows loading indicators during authentication
✅ **User Profile** - Stores display name during signup

---

## Next Steps

1. **Add Logout Button**: You can add a logout button to your Settings page or Navbar:
   ```tsx
   import { useAuth } from "@/contexts/AuthContext";
   
   const { logout } = useAuth();
   
   <Button onClick={logout}>Sign Out</Button>
   ```

2. **Display User Info**: Show the logged-in user's name/email in the Navbar or Settings page:
   ```tsx
   const { currentUser } = useAuth();
   // currentUser.displayName or currentUser.email
   ```

3. **Password Reset**: Add a "Forgot Password" feature using Firebase's `sendPasswordResetEmail`

4. **Email Verification**: Enable email verification in Firebase Console and implement verification flow

---

## Security Best Practices

1. ✅ Never commit `.env` files to version control
2. ✅ Use Firebase Security Rules to protect your data
3. ✅ Enable Firebase App Check for additional security
4. ✅ Regularly update Firebase packages: `npm update firebase`
5. ✅ Use strong passwords (enforce minimum 8 characters in production)

---

## Support

If you encounter any issues:
1. Check the Firebase Console for error logs
2. Check your browser's console for detailed error messages
3. Verify all environment variables are set correctly
4. Make sure Firebase Authentication is enabled in the console

---

**Congratulations!** 🎉 Your Firebase Authentication is now set up and working!

