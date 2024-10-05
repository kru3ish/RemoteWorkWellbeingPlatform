# 🌱 Remote Work Well-being Platform

## 📖 Overview

Remote Work Well-being Platform is a web-based app designed to enhance productivity, promote mental health, and help remote workers maintain a healthy work-life balance. It provides a suite of tools, including a Pomodoro timer, guided meditation, daily to-do lists, and productivity dashboards—all in one place.

## ✨ Features

- 🔐 **Authentication System**: Secure sign-up and login using Firebase Authentication.
- ⏱️ **Productivity Timer**: Stay focused with a customizable Pomodoro timer.
- ✅ **Daily To-Do List**: Add, complete, and manage daily tasks to stay productive.
- 🧘 **Guided Meditation**: Access 5, 10, and 15-minute guided meditations to relax and refocus.
- 📊 **Productivity Dashboard**: Track your Pomodoro sessions, completed tasks, and focus time.
- ⏰ **Break Reminders**: Receive reminders to take regular breaks and stay balanced.

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- Firebase account for authentication
- Modern web browser (Chrome, Firefox, etc.)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/RemoteWorkWellbeingPlatform.git
   cd RemoteWorkWellbeingPlatform
   ```

2. **Add Firebase Config**:
   - Create a `.env` file in the root directory.
   - Add your Firebase credentials:
     ```
     FIREBASE_API_KEY=your_api_key_here
     FIREBASE_AUTH_DOMAIN=your_auth_domain_here
     FIREBASE_PROJECT_ID=your_project_id_here
     FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
     FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
     FIREBASE_APP_ID=your_app_id_here
     ```

3. **Run the Application**:
   Open `index.html` in your browser to start using the app.

## 📂 Folder Structure

- **index.html**: Main HTML file.
- **styles.css**: Styling for the app.
- **scripts.js**: JavaScript for app functionality.
- **firebaseConfig.js**: Firebase configuration.
- **audio/**: Guided meditation audio files.

## 🔧 Usage

1. **Sign Up / Log In**: Use the form to create an account or log in.
2. **Pomodoro Timer**: Set focus and break durations to manage work sessions.
3. **Manage Tasks**: Add, complete, or remove tasks.
4. **Meditate**: Choose guided meditations to relax and recharge.

## 🛠️ Technologies Used

- **HTML/CSS/JavaScript**: Front-end development.
- **Firebase**: Authentication and backend services.
- **LocalStorage**: Stores tasks and productivity data locally.


## 💡 Future Enhancements

- **User Profiles**: Personalize settings for each user.
- **Progress Tracking**: Track productivity and provide analytics.
- **Push Notifications**: Real-time reminders for breaks.

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code is clean, well-commented, and adheres to the project's coding style.
- Changes are tested before submitting a pull request.

## 📜 License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
