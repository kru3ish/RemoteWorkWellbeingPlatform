let timerInterval;
let isRunning = false;

function startTimer() {
    if (!isRunning) {
        isRunning = true;

        // Get custom durations from the input fields
        const focusDuration = parseInt(document.getElementById('focus-duration').value) * 60;
        const breakDuration = parseInt(document.getElementById('break-duration').value) * 60;

        // Set initial time remaining
        let timeRemaining = focusDuration;
        document.getElementById('timer-label').textContent = 'Focus Time';
        document.getElementById('time-left').textContent = formatTime(timeRemaining);

        // Start the countdown
        timerInterval = setInterval(function () {
            if (timeRemaining > 0) {
                timeRemaining--;
                document.getElementById('time-left').textContent = formatTime(timeRemaining);
            } else {
                // Switch between Focus and Break
                if (document.getElementById('timer-label').textContent === 'Focus Time') {
                    timeRemaining = breakDuration;
                    document.getElementById('timer-label').textContent = 'Break Time';
                    alert("Time's up! Take a break.");
                } else {
                    timeRemaining = focusDuration;
                    document.getElementById('timer-label').textContent = 'Focus Time';
                    alert("Break's over! Back to work.");
                }
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;

    // Reset to the custom focus duration value
    const focusDuration = parseInt(document.getElementById('focus-duration').value) * 60;
    document.getElementById('timer-label').textContent = 'Focus Time';
    document.getElementById('time-left').textContent = formatTime(focusDuration);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
}

// User Management (Unchanged)
let users = [];

function showMessage(message, color = '#d9534f') {
    console.log("showMessage called with message:", message); // Debug line to check if function is called
    const feedbackElement = document.getElementById('feedback-message');
    feedbackElement.textContent = message;
    feedbackElement.style.color = color;
}

function signupUser() {
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    // Enhanced validation
    if (!username || !email || !password) {
        showMessage("All fields are required!");
        return;
    }

    if (password.length < 8) {
        showMessage("Password must be at least 8 characters long.");
        return;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,6}$/;
    if (!emailPattern.test(email)) {
        showMessage("Please enter a valid email address.");
        return;
    }

    users.push({ username, email, password });
    showMessage("Sign up successful! Please log in.", "#5cb85c");

    // Reset the sign-up form
    document.getElementById('signup-form').reset();
}

function loginUser() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
        showMessage("Please enter your username and password!");
        return;
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        showMessage("Login successful! Welcome " + username, "#5cb85c");

        // Reset the login form
        document.getElementById('login-form').reset();
    } else {
        showMessage("Invalid username or password!");
    }
}

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const taskList = document.getElementById('task-list');

    // Create a new list item for the task
    const taskItem = document.createElement('li');
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;

    // Button to mark the task as complete
    const completeButton = document.createElement('button');
    completeButton.textContent = "Complete";
    completeButton.classList.add('task-button');
    completeButton.onclick = function () {
        taskSpan.classList.toggle('task-complete');
    };

    // Button to remove the task
    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove";
    removeButton.classList.add('task-button');
    removeButton.onclick = function () {
        taskList.removeChild(taskItem);
    };

    // Add elements to the task item
    taskItem.appendChild(taskSpan);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(removeButton);

    // Add the task item to the task list
    taskList.appendChild(taskItem);

    // Clear the input field
    taskInput.value = "";
}
