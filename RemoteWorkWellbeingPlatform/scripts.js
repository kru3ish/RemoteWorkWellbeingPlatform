let timerInterval;
let isRunning = false;
let pomodoroCount = 0;
let totalFocusTime = 0; // Total focus time in seconds

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
                    sendNotification("Time's up! Take a break.");

                    // Update dashboard stats for Pomodoro sessions
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

    // Reset to the custom focus duration value
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
        if (taskSpan.classList.contains('task-complete')) {
            incrementTasksCompleted();
        } else {
            decrementTasksCompleted();
        }
        saveTasks(); // Save updated tasks
    };

    // Button to remove the task
    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove";
    removeButton.classList.add('task-button');
    removeButton.onclick = function () {
        if (taskSpan.classList.contains('task-complete')) {
            decrementTasksCompleted();
        }
        taskList.removeChild(taskItem);
        saveTasks(); // Save updated tasks
    };

    // Add elements to the task item
    taskItem.appendChild(taskSpan);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(removeButton);

    // Add the task item to the task list
    taskList.appendChild(taskItem);

    // Save the updated list of tasks
    saveTasks();

    // Clear the input field
    taskInput.value = "";
}

function saveTasks() {
    const taskList = document.getElementById('task-list');
    const tasks = [];

    // Loop through all tasks and save the text and completion state
    taskList.querySelectorAll('li').forEach(taskItem => {
        const taskText = taskItem.querySelector('span').textContent;
        const isCompleted = taskItem.querySelector('span').classList.contains('task-complete');
        tasks.push({ text: taskText, completed: isCompleted });
    });

    // Save tasks to localStorage as a string
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

    // Create a new list item for the task
    const taskItem = document.createElement('li');
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;

    // Mark as complete if needed
    if (isCompleted) {
        taskSpan.classList.add('task-complete');
        incrementTasksCompleted();
    }

    // Button to mark the task as complete
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
        saveTasks(); // Save updated tasks
    };

    // Button to remove the task
    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove";
    removeButton.classList.add('task-button');
    removeButton.onclick = function () {
        if (taskSpan.classList.contains('task-complete')) {
            decrementTasksCompleted();
        }
        taskList.removeChild(taskItem);
        saveTasks(); // Save updated tasks
    };

    // Add elements to the task item
    taskItem.appendChild(taskSpan);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(removeButton);

    // Add the task item to the task list
    taskList.appendChild(taskItem);
}

function updateDashboard() {
    document.getElementById('pomodoro-count').textContent = pomodoroCount;
    document.getElementById('tasks-completed').textContent = countCompletedTasks();
    document.getElementById('total-focus-time').textContent = formatTime(totalFocusTime);

    // Save updated dashboard stats to localStorage
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
