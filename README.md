# 🏥 MediLink – Smart Health Companion

> **A comprehensive healthcare ecosystem that bridges the gap between doctors, patients, and pharmacies using AI and automation.**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10.0-FFCA28.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC.svg)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Setup Guide](#-setup-guide)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Integrations](#-api-integrations)
- [Usage Guide](#-usage-guide)
- [Development](#-development)
- [Building for Production](#-building-for-production)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**MediLink** is a full-stack healthcare application designed to transform healthcare access from reactive to proactive. It combines AI-powered prescription reading, drug interaction checking, symptom analysis, air quality monitoring, first aid guidance, and intelligent medicine reminders into one seamless ecosystem.

### Project Type
- **Full-stack Web Application** (React + TypeScript + Firebase)
- **Domain**: Healthcare, AI, Automation, IoT (Optional extension)

---

## 🔍 Problem Statement

Accessing medicines, understanding prescriptions, and ensuring safe self-care is still a broken process in India — often leading to confusion, overdose, or harmful drug interactions.

### Key Challenges Addressed

| Challenge | Description |
|-----------|-------------|
| **Unreadable Prescriptions** | Most prescriptions are handwritten, making it difficult for patients to understand dosages and names |
| **Unsafe Combinations** | Patients often take medicines with overlapping compounds |
| **Poor Medical Awareness** | Lack of knowledge about symptoms and basic first aid |
| **Forgetfulness** | Missed doses due to no structured reminders |
| **Re-order Delays** | No link between prescription and pharmacy APIs |

---

## ✨ Key Features

### 📸 Prescription Reader (OCR)
- **Upload & Extract**: Scan and extract medicine details from handwritten prescriptions
- **AI-Powered Analysis**: Uses OCR technology to digitize prescription data
- **Medicine List Management**: View and manage all your prescriptions in one place

### ⚠️ Drug Interaction Checker
- **Safety Warnings**: Warn users if two medicines conflict
- **Real-time Validation**: Check interactions before taking medications
- **Visual Alerts**: Clear indicators for potential drug interactions

### 🌿 Air Quality Index (AQI) Tracker
- **Real-time Monitoring**: Show Air Quality Index for user's current city
- **Location-based**: Automatic detection or manual city search
- **Dual Standards**: Supports both US and India AQI standards
- **Pollutant Breakdown**: Detailed PM2.5, PM10, O₃, NO₂, SO₂, CO levels
- **Health Recommendations**: Personalized advice based on AQI levels

### 🤒 Symptom Checker
- **AI-Powered Analysis**: Suggest possible conditions using symptom-based ML classification
- **Comprehensive Database**: Covers 50+ common symptoms with detailed information
- **Severity Assessment**: Categorizes symptoms as mild, moderate, or severe
- **Personalized Recommendations**: Actionable advice for each symptom
- **Fallback System**: Works offline with intelligent rule-based analysis

### 🩹 First Aid Guide
- **Quick Access**: Essential emergency steps for common situations
- **Comprehensive Topics**: CPR, Wound Care, Choking, Burns, Bleeding, Shock
- **Step-by-Step Instructions**: Detailed procedures with visual indicators
- **Search Functionality**: Quick access to specific topics
- **Emergency Numbers**: Location-aware emergency contact information

### ⏰ Medicine Reminder
- **Smart Scheduling**: Notifications & intelligent scheduling
- **Multiple Repeat Options**: None, Daily, or Weekly (with specific days)
- **Alarm System**: Real alarm sound with Web Audio API
- **Snooze Functionality**: 5, 10, or 15-minute snooze options
- **Local Persistence**: All reminders saved in browser localStorage
- **Enable/Disable Toggle**: Control reminders individually

### 🔐 Authentication & User Management
- **Firebase Authentication**: Secure email/password authentication
- **Protected Routes**: Dashboard pages require authentication
- **User Profiles**: Store and manage user information
- **Session Management**: Automatic login persistence

### 📊 Dashboard
- **Health Overview**: Quick stats and insights
- **Active Prescriptions**: View current medications
- **Today's Reminders**: See scheduled medicine reminders
- **Safety Alerts**: Drug interaction warnings
- **Integrated Widgets**: All features accessible from one place

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.8.3 | Type safety |
| **Vite** | 5.4.19 | Build tool & dev server |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS |
| **shadcn/ui** | Latest | Component library (Radix UI) |
| **React Router** | 6.30.1 | Client-side routing |
| **React Query** | 5.83.0 | Data fetching & caching |

### Backend & Services
| Service | Purpose |
|---------|---------|
| **Firebase Auth** | User authentication |
| **Firebase Firestore** | Database (optional) |
| **OpenWeatherMap API** | Air quality data |
| **Hugging Face Inference API** | AI symptom analysis |
| **Google Cloud Vision** | OCR (planned) |

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn** or **pnpm**
- **Git** ([Download](https://git-scm.com/))
- A modern web browser (Chrome, Firefox, Edge, Safari)

### Optional but Recommended
- **Firebase Account** (for authentication)
- **OpenWeatherMap API Key** (for AQI features)
- Code editor (VS Code recommended)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd CodeOrbit-Website/medilink-web
```

### Step 2: Install Dependencies

Using **npm**:
```bash
npm install
```

Using **yarn**:
```bash
yarn install
```

Using **pnpm**:
```bash
pnpm install
```

### Step 3: Create Environment File

Create a `.env` file in the `medilink-web` directory:

```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# Linux/Mac
touch .env
```

---

## ⚙️ Setup Guide

### 1. Firebase Authentication Setup

Follow the detailed guide in [`docs/FIREBASE_SETUP.md`](./docs/FIREBASE_SETUP.md) for step-by-step instructions.

**Quick Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Email/Password authentication
4. Register your web app
5. Copy the configuration values

### 2. OpenWeatherMap API Setup (Optional but Recommended)

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add it to your `.env` file (see below)

### 3. Environment Variables

Add the following to your `.env` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# OpenWeatherMap API (Optional - for AQI features)
VITE_OPENWEATHER_API_KEY=your-openweather-api-key
```

**Important Notes:**
- Replace all placeholder values with your actual credentials
- Never commit `.env` file to version control (already in `.gitignore`)
- The `VITE_` prefix is required for Vite to expose variables
- Restart the dev server after modifying `.env`

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080` (or the port shown in terminal).

---

## 📁 Project Structure

```
medilink-web/
├── public/                 # Static assets
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useAlarm.ts
│   │   └── useEmergencyNumber.ts
│   ├── lib/               # Utilities & configs
│   │   ├── firebase.ts
│   │   └── utils.ts
│   ├── pages/             # Page components
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Prescriptions.tsx
│   │   ├── Reminders.tsx
│   │   ├── AQI.tsx
│   │   ├── FirstAid.tsx
│   │   ├── Settings.tsx
│   │   └── Landing.tsx
│   ├── services/          # API services
│   │   └── symptomChecker.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── docs/                  # Documentation
│   ├── FIREBASE_SETUP.md
│   └── QUICK_START.md
├── .env                   # Environment variables (create this)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vite.config.ts
```

---

## 🔌 API Integrations

### Current Integrations

| API | Purpose | Status | Documentation |
|-----|---------|--------|---------------|
| **Firebase Auth** | User authentication | ✅ Active | [Firebase Docs](https://firebase.google.com/docs/auth) |
| **OpenWeatherMap** | Air Quality Index | ✅ Active | [OpenWeather Docs](https://openweathermap.org/api) |
| **Hugging Face** | AI Symptom Analysis | ✅ Active (with fallback) | [Hugging Face Docs](https://huggingface.co/docs/api-inference) |

### Planned Integrations

| API | Purpose | Status |
|-----|---------|--------|
| **Google Cloud Vision** | OCR for prescriptions | 🔄 Planned |
| **DrugBank / RxNav** | Drug interaction checking | 🔄 Planned |
| **1mg / NetMeds** | Auto medicine ordering | 🔄 Planned |
| **Infermedica** | Advanced symptom analysis | 🔄 Planned |

---

## 📖 Usage Guide

### Authentication

1. **Sign Up**: Navigate to `/auth` and create a new account
2. **Login**: Use your credentials to sign in
3. **Protected Routes**: Dashboard features require authentication

### Prescription Management

1. Go to **Prescriptions** page from the sidebar
2. Click **"Upload Prescription"**
3. Upload an image of your prescription
4. View extracted medicine details (OCR feature in development)

### Medicine Reminders

1. Navigate to **Reminders** page
2. Click **"Add Reminder"**
3. Fill in:
   - Medicine name
   - Time (24-hour format, e.g., 09:00, 14:30)
   - Repeat option (None/Daily/Weekly)
   - Enable toggle
4. When reminder triggers:
   - Alarm sound plays
   - Use **Snooze** (5/10/15 min) or **Stop** to dismiss
5. One-time reminders auto-disable after firing

**Tip**: For quick testing, set time to current minute. The scheduler checks every ~5 seconds.

### Symptom Checker

1. Go to **Dashboard** or dedicated Symptom Checker
2. Enter your symptoms (e.g., "headache, fever, fatigue")
3. Click **"Analyze Symptoms"**
4. View:
   - Possible conditions
   - Recommendations
   - Severity level
   - Important advice

### Air Quality Monitor

1. Navigate to **AQI** page
2. Allow location access (or search manually)
3. View:
   - Current AQI level
   - Pollutant breakdown
   - Health recommendations
4. Search for any city worldwide

### First Aid Guide

1. Go to **First Aid** page
2. Browse topics or use search
3. Click on any topic for detailed instructions
4. Follow step-by-step procedures
5. Note emergency contact numbers

---

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build in development mode
npm run build:dev

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Development Server

- **URL**: `http://localhost:8080`
- **Hot Reload**: Enabled (changes reflect immediately)
- **Port**: Configurable in `vite.config.ts`

### Code Style

- **Linter**: ESLint with React plugins
- **Formatter**: Prettier (recommended)
- **TypeScript**: Strict mode enabled

---

## 🏗 Building for Production

### Build Command

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ...
```

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

---

## 🚢 Deployment

### Recommended Platforms

- **Vercel** (Recommended) - Zero-config deployment
- **Netlify** - Easy static hosting
- **Firebase Hosting** - Integrated with Firebase
- **GitHub Pages** - Free for public repos

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login:
   ```bash
   firebase login
   ```

3. Initialize:
   ```bash
   firebase init hosting
   ```

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

### Environment Variables in Production

Make sure to add all environment variables in your hosting platform's dashboard:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_OPENWEATHER_API_KEY` (optional)

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Firebase Authentication Errors

**Error**: `Firebase: Error (auth/invalid-api-key)`
- **Solution**: Check `.env` file has correct API key and all variables start with `VITE_`

**Error**: `Firebase: Error (auth/email-already-in-use)`
- **Solution**: Email already registered. Try logging in or use different email

**Error**: `Firebase: Error (auth/weak-password)`
- **Solution**: Password must be at least 6 characters

#### 2. Environment Variables Not Loading

**Symptoms**: API calls fail, Firebase not initializing
- **Solutions**:
  1. Ensure `.env` file is in `medilink-web` directory (not root)
  2. Restart dev server after creating/modifying `.env`
  3. Verify all variable names start with `VITE_`
  4. Check for typos and no spaces around `=`

#### 3. AQI Not Loading

**Error**: "Missing OpenWeather API key"
- **Solution**: Add `VITE_OPENWEATHER_API_KEY` to `.env` file (optional feature)

**Error**: "Location permission denied"
- **Solution**: Allow location access in browser settings or search manually

#### 4. Reminder Alarm Not Playing

**Symptoms**: No sound when reminder triggers
- **Solution**: 
  - Some browsers block audio until user interaction
  - Click anywhere on page first, then test
  - Check browser audio permissions

#### 5. Protected Routes Redirecting

**Symptoms**: Always redirected to login
- **Solution**: This is expected. Sign in first to access dashboard pages

#### 6. Build Errors

**Error**: TypeScript errors
- **Solution**: Run `npm run lint` to see detailed errors

**Error**: Module not found
- **Solution**: Run `npm install` to ensure all dependencies are installed

### Getting Help

1. Check browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Check Firebase Console for authentication errors
4. Review documentation in `docs/` folder
5. Open an issue on GitHub with error details

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**:
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**:
   ```bash
   npm run lint
   npm run build
   ```

5. **Commit your changes**:
   ```bash
   git commit -m "Add: your feature description"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**

### Code Standards

- Use TypeScript for all new code
- Follow React best practices
- Write meaningful commit messages
- Add tests for new features (when applicable)
- Update README if adding new features

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🎯 Roadmap & Future Enhancements

### Phase 1 (Current)
- ✅ User authentication
- ✅ Medicine reminders
- ✅ Symptom checker
- ✅ AQI tracker
- ✅ First aid guide
- ✅ Prescription upload UI

### Phase 2 (Planned)
- 🔄 OCR for prescription reading
- 🔄 Drug interaction checker
- 🔄 Auto medicine reorder
- 🔄 Advanced symptom analysis
- 🔄 Doctor-verified prescription validation

### Phase 3 (Future)
- 📱 Mobile app (React Native)
- 🏥 Integration with wearable IoT devices
- 🔗 Blockchain-based prescription records
- 🤖 AI-driven dosage reminders
- 📊 Health analytics dashboard

---

## 👥 Team

**CodeOrbit** - Built for VibeCode Hackathon

---

## 📞 Support & Contact

- **Documentation**: Check `docs/` folder for detailed guides
- **Issues**: Open an issue on GitHub
- **Email**: [Your contact email]

---

## 🙏 Acknowledgments

- **Firebase** - Authentication and backend services
- **OpenWeatherMap** - Air quality data
- **Hugging Face** - AI inference API
- **shadcn/ui** - Beautiful component library
- **Vite** - Lightning-fast build tool

---

## ⚠️ Disclaimer

**This application is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with any questions you may have regarding a medical condition.**

---

<div align="center">

**Made with ❤️ by CodeOrbit Team**

[⭐ Star us on GitHub](https://github.com/IlluMinati-Github/CodeOrbit) | [📖 Documentation](./docs/) | [🐛 Report Bug](https://github.com/IlluMinati-Github/CodeOrbit/issues)

</div>
