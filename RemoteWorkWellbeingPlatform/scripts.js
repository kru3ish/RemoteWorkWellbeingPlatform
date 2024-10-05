let timerInterval;
let timerDuration = 25 * 60; // Default 25 minutes
let timeRemaining = timerDuration;
let isRunning = false;

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timeRemaining = timerDuration;
    document.getElementById('time-left').textContent = formatTime(timeRemaining);
    isRunning = false;
}

function updateTimer() {
    if (timeRemaining > 0) {
        timeRemaining--;
        document.getElementById('time-left').textContent = formatTime(timeRemaining);
    } else {
        clearInterval(timerInterval);
        alert("Time's up! Take a break.");
        isRunning = false;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
}

let users = [];

function signupUser() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Simple validation
    if (username && email && password) {
        users.push({ username, email, password });
        alert("Sign up successful! Please log in.");
        document.getElementById('signup-form').reset();
    } else {
        alert("Please fill all the fields!");
    }
}

function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Simple check for user credentials
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        alert("Login successful! Welcome " + username);
        document.getElementById('login-form').reset();
    } else {
        alert("Invalid username or password!");
    }
}
