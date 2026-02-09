# FarmConnect Mobile App

A React Native mobile application for the FarmConnect platform, built with Expo and TypeScript.

## Features

- **User Authentication**: Login and Registration
- **Backend Integration**: Connected to Node.js backend API
- **Role-based Access**: Support for FARMER, WHOLESALER, RETAILER, CUSTOMER, and INSTITUTIONAL_BUYER roles
- **Secure Token Management**: JWT token storage using AsyncStorage
- **Profile Management**: View user profile and logout functionality

## Prerequisites

- Node.js (v14 or higher)
- Expo CLI: `npm install -g expo-cli`
- Backend server running on `http://localhost:5000`

## Installation

1. Navigate to the farm-mobile directory:
```bash
cd farm-mobile
```

2. Install dependencies (run in CMD or PowerShell with admin rights):
```cmd
npm install
```

## Configuration

### Backend API URL

Update the API URL in `config/api.ts` based on your environment:

- **Local Development (iOS Simulator)**: `http://localhost:5000/api`
- **Android Emulator**: `http://10.0.2.2:5000/api`
- **Physical Device**: Use your computer's IP address (e.g., `http://192.168.1.100:5000/api`)

To find your IP address:
- Windows: Run `ipconfig` in terminal
- Mac/Linux: Run `ifconfig` in terminal

## Running the App

1. Start the backend server first:
```bash
cd ../farm-backend
npm start
```

2. In a new terminal, start the Expo development server:
```bash
cd farm-mobile
npm start
```

3. Choose how to run:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## Project Structure

```
farm-mobile/
├── src/
│   ├── assets/
│   │   └── images/          # App icons and images
│   ├── components/          # Reusable components
│   ├── config/
│   │   └── api.ts           # Axios API configuration
│   ├── context/
│   │   └── AuthContext.tsx  # Authentication context provider
│   ├── navigation/
│   │   └── AppNavigator.js  # Main navigation setup
│   ├── screens/
│   │   ├── LoginScreen.js   # Login screen
│   │   ├── RegisterScreen.js # Registration screen
│   │   ├── HomeScreen.js    # Home screen
│   │   ├── ProfileScreen.js # Profile screen
│   │   └── index.js         # Screen exports
│   └── services/
│       └── authService.ts   # Authentication API calls
├── App.js                   # Root component
├── package.json             # Dependencies
└── app.json                 # Expo configuration
```

## Testing Authentication

### Register a New User

1. Run the app
2. On the login screen, tap "Register"
3. Fill in the form:
   - Full Name
   - Email
   - Phone (optional)
   - Role (select from dropdown)
   - Password (min 6 characters)
   - Confirm Password
4. Tap "Register"

### Login

1. Enter your email or phone number
2. Enter your password
3. Tap "Login"

### Test Credentials (if backend has seed data)

You can test with any user you create, or check your backend for existing users.

## API Endpoints Used

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile/:userId` - Get user profile

## Troubleshooting

### Network Request Failed

If you get "Network request failed":
1. Make sure the backend server is running
2. Update the API_BASE_URL in `config/api.ts` to match your setup
3. For physical devices, use your computer's IP instead of localhost
4. Check that your device/emulator can reach the backend URL

### Dependencies Not Installing

If npm won't run in PowerShell:
1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Or use Command Prompt (CMD) instead

### Port Already in Use

If Expo port 8081 is in use:
1. Kill the process: `npx kill-port 8081`
2. Or use a different port: `expo start --port 8082`

## Next Steps

Add more features:
- Product browsing
- Order management
- Farmer profiles
- Shopping cart
- Payment integration
- Real-time notifications

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Expo Router** - File-based navigation
- **Axios** - HTTP client
- **AsyncStorage** - Local data persistence
- **React Context** - State management

