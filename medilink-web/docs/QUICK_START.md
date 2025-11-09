# Quick Start - Firebase Authentication

## Quick Setup Checklist

1. ✅ **Install Firebase**: `npm install firebase` (in `medilink-web` folder)
2. ✅ **Create Firebase Project**: Go to [Firebase Console](https://console.firebase.google.com/)
3. ✅ **Enable Email/Password Auth**: Firebase Console → Authentication → Sign-in method → Email/Password
4. ✅ **Create `.env` file**: Copy your Firebase config values (see `.env.example`)
5. ✅ **Start the app**: `npm run dev`

## Environment Variables Required

Create a `.env` file in the `medilink-web` folder with:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Testing

1. Go to `/auth` page
2. Click "Sign Up" tab
3. Create an account
4. You'll be redirected to dashboard
5. Try logging out and logging back in

## Files Created/Modified

- `src/lib/firebase.ts` - Firebase configuration
- `src/contexts/AuthContext.tsx` - Authentication context
- `src/components/ProtectedRoute.tsx` - Route protection
- `src/pages/Auth.tsx` - Updated with Firebase auth
- `src/App.tsx` - Added AuthProvider and ProtectedRoute

For detailed instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

