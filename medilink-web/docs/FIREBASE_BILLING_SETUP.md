# Firebase Billing Setup for Phone Authentication

## Why Billing is Required

Firebase Phone Authentication has a **10 SMS/day limit** for projects without billing. To send more SMS messages, you need to:

1. Upgrade to the **Blaze (pay-as-you-go) plan**
2. Add a billing account

**Good News:** The Blaze plan has a **free tier** that includes:
- 10,000 free SMS verifications per month
- No charges unless you exceed the free tier
- You can set spending limits

---

## Step-by-Step: Add Billing to Firebase

### Step 1: Go to Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **medi-link**

### Step 2: Upgrade to Blaze Plan

1. Click on the **⚙️ Settings** icon (gear icon) in the top left
2. Click **"Project settings"**
3. Go to the **"Usage and billing"** tab
4. Click **"Modify plan"** or **"Upgrade"**
5. Select **"Blaze (pay-as-you-go)"** plan
6. Click **"Continue"**

### Step 3: Add Billing Account

1. You'll be redirected to Google Cloud Console
2. Click **"Create billing account"** (if you don't have one)
3. Fill in your billing information:
   - **Account name**: e.g., "MediLink Billing"
   - **Country/Region**: Select your country
   - **Currency**: Select your currency
   - **Billing address**: Enter your address
4. Click **"Submit and enable billing"**

### Step 4: Set Budget Alerts (Recommended)

1. In Google Cloud Console, go to **"Billing"** → **"Budgets & alerts"**
2. Click **"Create budget"**
3. Set a budget limit (e.g., $10/month)
4. Set up alerts to notify you if you approach the limit
5. This helps prevent unexpected charges

### Step 5: Verify Billing is Active

1. Go back to Firebase Console
2. Check that your project shows **"Blaze plan"** status
3. You should now be able to send more than 10 SMS per day

---

## Free Tier Limits (Blaze Plan)

With the Blaze plan, you get these **free** services:

- **Phone Authentication**: 10,000 SMS verifications/month (free)
- **Cloud Firestore**: 1 GB storage, 50K reads/day (free)
- **Cloud Storage**: 5 GB storage (free)
- **Cloud Functions**: 2 million invocations/month (free)

**You only pay if you exceed these free limits.**

---

## Alternative: Use Email/Password or Google Sign-In

If you don't want to add billing right now, you can:

1. **Use Email/Password authentication** (no limits, free)
2. **Use Google Sign-In** (no limits, free)
3. **Test phone auth later** when you're ready to add billing

Both Email/Password and Google Sign-In are already working in your app!

---

## Troubleshooting

### "Billing account not found" Error

- Make sure you've completed the billing setup in Google Cloud Console
- Wait a few minutes for the billing account to be activated
- Refresh the Firebase Console page

### Still Getting SMS Quota Errors

- Check Firebase Console → Authentication → Usage
- Verify your project is on the Blaze plan
- Wait a few minutes after adding billing for changes to take effect

### Want to Test Without Billing?

You can use **Firebase Emulator Suite** for local testing, but it requires additional setup.

---

## Cost Estimate

For a typical small app:
- **Phone Auth**: 10,000 free SMS/month = **$0/month**
- **Email/Password**: Unlimited = **$0/month**
- **Google Sign-In**: Unlimited = **$0/month**

**Most small apps stay within the free tier!**

---

## Next Steps

1. Add billing account (follow steps above)
2. Test phone authentication again
3. Monitor usage in Firebase Console → Authentication → Usage

**Note:** You can always downgrade back to the Spark (free) plan later if needed, but you'll lose access to phone authentication beyond 10 SMS/day.

