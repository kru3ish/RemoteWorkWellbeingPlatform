// const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let timerInterval;
let isRunning = false;
let pomodoroCount = 0;
let totalFocusTime = 0; // Total focus time in seconds

window.signupUser = signupUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.getStarted = getStarted;
window.startTimer = startTimer;
window.resetTimer = resetTimer;
window.addTask = addTask;
window.playAudio = playAudio;


document.addEventListener("DOMContentLoaded", () => {
    requestNotificationPermission();
    loadTasks(); // Load tasks on page load
    loadDashboard(); // Load dashboard stats on page load
});

function requestNotificationPermission() {
    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            }
        });
    }
}

// Timer functions
function startTimer() {
    if (!isRunning) {
        isRunning = true;

        const focusDuration = parseInt(document.getElementById('focus-duration').value) * 60;
        const breakDuration = parseInt(document.getElementById('break-duration').value) * 60;

        let timeRemaining = focusDuration;
        document.getElementById('timer-label').textContent = 'Focus Time';
        document.getElementById('time-left').textContent = formatTime(timeRemaining);

        timerInterval = setInterval(function () {
            if (timeRemaining > 0) {
                timeRemaining--;
                document.getElementById('time-left').textContent = formatTime(timeRemaining);
            } else {
                if (document.getElementById('timer-label').textContent === 'Focus Time') {
                    timeRemaining = breakDuration;
                    document.getElementById('timer-label').textContent = 'Break Time';
                    sendNotification("Time's up! Take a break.");

                    pomodoroCount++;
                    totalFocusTime += focusDuration;
                    updateDashboard();
                } else {
                    timeRemaining = focusDuration;
                    document.getElementById('timer-label').textContent = 'Focus Time';
                    sendNotification("Break's over! Back to work.");
                }
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;

    const focusDuration = parseInt(document.getElementById('focus-duration').value) * 60;
    document.getElementById('timer-label').textContent = 'Focus Time';
    document.getElementById('time-left').textContent = formatTime(focusDuration);
}

function sendNotification(message) {
    if (Notification.permission === "granted") {
        new Notification(message);
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
}

// Firebase Authentication

// Signup User
function signupUser() {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if (!email || !password) {
        showMessage("All fields are required!", "#d9534f");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage("Sign up successful! Please log in.", "#5cb85c");
            document.getElementById('signup-form').reset();
        })
        .catch((error) => {
            showMessage(`Error: ${error.message}`, "#d9534f");
        });
}

// Login User
function loginUser() {
    const email = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        showMessage("Please enter your email and password!", "#d9534f");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage("Login successful! Welcome back!", "#5cb85c");
            document.getElementById('login-form').reset();
        })
        .catch((error) => {
            showMessage(`Error: ${error.message}`, "#d9534f");
        });
}

// Logout User
function logoutUser() {
    signOut(auth)
        .then(() => {
            showMessage("Logged out successfully.", "#5cb85c");
        })
        .catch((error) => {
            showMessage(`Error: ${error.message}`, "#d9534f");
        });
}

function showMessage(message, color = '#d9534f') {
    const feedbackElement = document.getElementById('feedback-message');
    feedbackElement.textContent = message;
    feedbackElement.style.color = color;
}

// Task Management Code

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const taskList = document.getElementById('task-list');

    const taskItem = document.createElement('li');
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;

    const completeButton = document.createElement('button');
    completeButton.textContent = "Complete";
    completeButton.classList.add('task-button');
    completeButton.onclick = function () {
        taskSpan.classList.toggle('task-complete');
        if (taskSpan.classList.contains('task-complete')) {
            incrementTasksCompleted();
        } else {
            decrementTasksCompleted();
        }
        saveTasks();
    };

    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove";
    removeButton.classList.add('task-button');
    removeButton.onclick = function () {
        if (taskSpan.classList.contains('task-complete')) {
            decrementTasksCompleted();
        }
        taskList.removeChild(taskItem);
        saveTasks();
    };

    taskItem.appendChild(taskSpan);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(removeButton);
    taskList.appendChild(taskItem);

    saveTasks();
    taskInput.value = "";
}

function saveTasks() {
    const taskList = document.getElementById('task-list');
    const tasks = [];

    taskList.querySelectorAll('li').forEach(taskItem => {
        const taskText = taskItem.querySelector('span').textContent;
        const isCompleted = taskItem.querySelector('span').classList.contains('task-complete');
        tasks.push({ text: taskText, completed: isCompleted });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            addTaskFromStorage(task.text, task.completed);
        });
    }
}

function addTaskFromStorage(taskText, isCompleted) {
    const taskList = document.getElementById('task-list');

    const taskItem = document.createElement('li');
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;

    if (isCompleted) {
        taskSpan.classList.add('task-complete');
        incrementTasksCompleted();
    }

    const completeButton = document.createElement('button');
    completeButton.textContent = "Complete";
    completeButton.classList.add('task-button');
    completeButton.onclick = function () {
        taskSpan.classList.toggle('task-complete');
        if (taskSpan.classList.contains('task-complete')) {
            incrementTasksCompleted();
        } else {
            decrementTasksCompleted();
        }
        saveTasks();
    };

    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove";
    removeButton.classList.add('task-button');
    removeButton.onclick = function () {
        if (taskSpan.classList.contains('task-complete')) {
            decrementTasksCompleted();
        }
        taskList.removeChild(taskItem);
        saveTasks();
    };

    taskItem.appendChild(taskSpan);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(removeButton);
    taskList.appendChild(taskItem);
}

function updateDashboard() {
    document.getElementById('pomodoro-count').textContent = pomodoroCount;
    document.getElementById('tasks-completed').textContent = countCompletedTasks();
    document.getElementById('total-focus-time').textContent = formatTime(totalFocusTime);

    localStorage.setItem('dashboard', JSON.stringify({
        pomodoroCount,
        totalFocusTime
    }));
}

function loadDashboard() {
    const savedDashboard = localStorage.getItem('dashboard');
    if (savedDashboard) {
        const dashboardData = JSON.parse(savedDashboard);
        pomodoroCount = dashboardData.pomodoroCount || 0;
        totalFocusTime = dashboardData.totalFocusTime || 0;

        updateDashboard();
    }
}

function incrementTasksCompleted() {
    updateDashboard();
}

function decrementTasksCompleted() {
    updateDashboard();
}

function countCompletedTasks() {
    return document.querySelectorAll('.task-complete').length;
}

function playAudio(audioSrc) {
    const meditationAudio = document.getElementById('meditation-audio');
    meditationAudio.src = audioSrc;
    meditationAudio.style.display = 'block';
    meditationAudio.play();
}