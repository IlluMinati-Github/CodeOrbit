# Firebase Setup - Next Steps for Your Project

## Your Firebase Project Details
- **Project Name**: medi-link
- **Project ID**: medi-link-72d97
- **Project Number**: 871830047177

---

## Step 1: Add a Web App to Your Firebase Project

1. In your Firebase Console, you should see a section that says **"Your apps"** with **"There are no apps in your project"**
2. Click on the **Web icon** (`</>`) or **"Add app"** → **"Web"**
3. Register your app:
   - **App nickname**: `MediLink Web` (or any name you prefer)
   - **Firebase Hosting**: You can check this box if you plan to host it later, or leave it unchecked for now
4. Click **"Register app"**

---

## Step 2: Copy Your Firebase Configuration

After registering your web app, you'll see a screen with your Firebase configuration that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "medi-link-72d97.firebaseapp.com",
  projectId: "medi-link-72d97",
  storageBucket: "medi-link-72d97.appspot.com",
  messagingSenderId: "871830047177",
  appId: "1:871830047177:web:..."
};
```

**Copy these values** - you'll need them in the next step!

---

## Step 3: Enable Email/Password Authentication

1. In the Firebase Console, click on **"Authentication"** in the left sidebar
2. Click **"Get started"** (if you haven't enabled Authentication yet)
3. Click on the **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Toggle **"Enable"** to **ON**
6. Click **"Save"**

---

## Step 4: Create Your .env File

1. In your project, go to the `medilink-web` folder
2. Create a new file named `.env` (not `.env.txt` - make sure it has no extension)
3. Copy and paste the following, replacing the values with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSy...your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=medi-link-72d97.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=medi-link-72d97
VITE_FIREBASE_STORAGE_BUCKET=medi-link-72d97.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=871830047177
VITE_FIREBASE_APP_ID=1:871830047177:web:...your-actual-app-id
```

**Important:**
- Replace `AIzaSy...your-actual-api-key` with your actual API key from Step 2
- Replace `1:871830047177:web:...your-actual-app-id` with your actual App ID from Step 2
- Keep the other values as shown (they match your project)

---

## Step 5: Test Your Setup

1. Make sure your `.env` file is saved
2. Start your development server:
   ```bash
   npm run dev
   ```
3. Navigate to `http://localhost:8080/auth` (or your configured port)
4. Try creating an account:
   - Click on the **"Sign Up"** tab
   - Enter a name, email, and password (at least 6 characters)
   - Click **"Create Account"**
5. If successful, you should be redirected to the dashboard!

---

## Troubleshooting

### If you get "Firebase: Error (auth/invalid-api-key)"
- Double-check that your `.env` file has the correct API key
- Make sure all environment variables start with `VITE_`
- Restart your dev server after creating/modifying `.env`

### If you get "Firebase: Error (auth/operation-not-allowed)"
- Make sure Email/Password authentication is enabled in Firebase Console
- Go to Authentication → Sign-in method → Email/Password → Enable

### If environment variables aren't loading
- Make sure `.env` is in the `medilink-web` folder (not the root)
- Restart your dev server
- Check that there are no spaces around the `=` sign in `.env`

---

## Quick Reference

Your Firebase project details:
- **Project ID**: `medi-link-72d97`
- **Auth Domain**: `medi-link-72d97.firebaseapp.com`
- **Storage Bucket**: `medi-link-72d97.appspot.com`
- **Messaging Sender ID**: `871830047177`

You'll get the **API Key** and **App ID** when you register your web app in Step 1.

---

**Once you complete these steps, your authentication will be fully working!** 🎉

