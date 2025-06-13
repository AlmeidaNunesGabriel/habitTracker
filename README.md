# HabitTracker 📱

A complete habit tracking application built with React Native that allows users to create, manage, and track their daily habits in an intuitive and efficient way.

## 🌟 Features

### ✅ **Habit Management**
- Create new habits with name and description
- View complete list of habits
- Mark habits as completed or pending
- Edit existing habit details
- Delete unwanted habits

### 📊 **Advanced Statistics**
- Overall progress with visual progress bar
- Completion rate in percentage
- Counter of completed vs pending habits
- Consecutive days streak
- Weekly activity summary
- Motivational messages based on progress

### 🎨 **Interface & Experience**
- Modern and responsive design
- Light and dark theme (Dark/Light mode)
- Intuitive tab navigation
- Visual status indicators
- Animations and visual feedback
- Pull-to-refresh updates

### 🌐 **API Integration**
- Cloud data persistence (JSONBin.io)
- Automatic synchronization
- Offline functionality with local cache
- Complete CRUD operations (Create, Read, Update, Delete)

## 🛠️ Technologies Used

### **Frontend**
- **React Native** - Main framework
- **React Navigation** - Screen navigation
- **Context API** - Global state management
- **AsyncStorage** - Local storage

### **Backend/API**
- **JSONBin.io** - REST API for data persistence
- **Fetch API** - HTTP requests

### **Development**
- **Expo** - Development platform
- **JavaScript ES6+** - Main language
- **React Hooks** - useState, useEffect, useContext

## 📱 App Structure

### **Main Screens:**
1. **🏠 Home** - Dashboard with summary and quick access
2. **📋 Habits** - Complete list with editing actions
3. **➕ Add** - Form for new habits
4. **📊 Statistics** - Detailed metrics and progress
5. **👤 Profile** - Personal settings and theme

### **Features by Screen:**

#### **Home Screen**
- Visualized overall progress
- Quick summary (completed/pending/total)
- Quick access buttons
- Motivational messages

#### **Habits List**
- Visual cards for each habit
- Colored status (✅ Completed / ⏳ Pending)
- Action buttons (Complete/Undo/Delete)
- Navigation to details

#### **Add Habit**
- Form with validation
- Character counter
- Save feedback
- Confirmation before discarding

#### **Statistics**
- Progress charts
- Informative cards
- Recent habits
- Personalized tips
- Weekly summary

#### **Profile**
- Theme toggle (light/dark)
- Personal information
- App settings

## 🚀 How to Run

### **Prerequisites:**
- Node.js (version 16 or higher)
- npm or yarn
- Expo CLI
- Physical device or emulator

### **Installation:**

```bash
# Clone the repository
git clone https://github.com/AlmeidaNunesGabriel/habitTracker

# Enter the directory
cd habitTracker

# Install dependencies
npm install

# Start the project
npx expo start
```

### **API Configuration:**

1. Create an account at [jsonbin.io](https://jsonbin.io)
2. Get your Master Key
3. Create a new bin with initial data
4. Configure `src/services/api.js` with your credentials

## 📱 How to Test

### **Expo Go (Recommended):**
Scan the QR Code with the Expo Go app:

![QR Code](https://github.com/AlmeidaNunesGabriel/habitTracker/blob/main/qrcode%20habittracker.png?raw=true)

### **Emulator:**
```bash
# Android
npx expo start --android

# iOS
npx expo start --ios
```

## 🏗️ Project Architecture

```
src/
├── components/          # Reusable components
│   ├── Button/         # Custom button
│   └── Loading/        # Loading indicator
├── context/            # State management
│   ├── HabitsContext   # Habits state
│   └── ThemeContext    # Light/dark theme
├── screens/            # App screens
│   ├── Home/           # Home screen
│   ├── Lista/          # Habits list
│   ├── AddHabitScreen/ # Add habit
│   ├── Estatitisticas/ # Statistics
│   ├── HabitDetails/   # Habit details
│   └── profile/        # User profile
└── services/           # External services
    └── api.js          # JSONBin.io integration
```

## 📊 Project Status

✅ **Functional**
- All main features implemented
- Real API integration working
- Responsive and intuitive interface
- Light and dark themes
- Data persistence

## 🔮 Possible Future Improvements

- 🔔 Push notifications for habit reminders
- 📅 Visual progress calendar
- 🏆 Achievement and badge system
- 📈 Advanced charts with Chart.js
- 👥 Progress sharing
- 🔄 Cross-device synchronization
- 📱 Web version (React.js)


## Project developed for academic coursework

## 📄 License

This project was developed for educational purposes as part of college coursework.

---

⭐ **If this project was helpful, consider giving it a star on GitHub!**