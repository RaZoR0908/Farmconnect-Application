# Quick Setup Guide

## Step 1: Install Dependencies

Open **Command Prompt (CMD)** as Administrator and run:

```cmd
cd Y:\Farmconnect\farm-mobile
npm install
```

If you're using PowerShell and get an error, run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Step 2: Configure Backend URL

If testing on:
- **iOS Simulator**: No changes needed (uses `http://localhost:5000/api`)
- **Android Emulator**: Edit `config/api.ts` and change to `http://10.0.2.2:5000/api`
- **Physical Device**: Edit `config/api.ts` and use your PC's IP (find with `ipconfig`)

## Step 3: Start Backend Server

In a new terminal:
```bash
cd Y:\Farmconnect\farm-backend
npm start
```

Server should be running on http://localhost:5000

## Step 4: Start Mobile App

In another terminal:
```bash
cd Y:\Farmconnect\farm-mobile
npm start
```

Then press:
- `a` for Android emulator
- `i` for iOS simulator  
- Scan QR with Expo Go app on your phone

## Step 5: Test the App

1. App will open to **Login Screen**
2. Tap **Register** to create a new account
3. Fill in:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `1234567890` (optional)
   - Role: Select `CUSTOMER` or `FARMER`
   - Password: `password123`
   - Confirm Password: `password123`
4. Tap **Register** button
5. You should be logged in and see the Home screen!

## Troubleshooting

**"Network request failed"**
- Make sure backend is running on port 5000
- Check the API URL in `config/api.ts`
- For physical devices, use your PC's IP address instead of localhost

**"Scripts disabled" error in PowerShell**
- Use Command Prompt (CMD) instead
- Or run as Admin: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

**Port 8081 already in use**
- Kill the process: `npx kill-port 8081`
- Or use different port: `npm start -- --port 8082`

## File Structure Created

```
farm-mobile/
├── src/
│   ├── assets/images/        ← App icons
│   ├── components/           ← Reusable components (empty for now)
│   ├── config/api.ts         ← API configuration
│   ├── context/AuthContext.tsx ← Auth state management
│   ├── navigation/AppNavigator.js ← Navigation setup
│   ├── screens/              ← All screens (.js files)
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js
│   │   └── ProfileScreen.js
│   └── services/authService.ts ← API calls
└── App.js                    ← Root component
```

All example/demo files have been cleaned and replaced with authentication screens!
