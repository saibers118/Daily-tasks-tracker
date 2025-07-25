// To-Do List JS - No input, fixed tasks, improved counter and date
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');
const dateHeader = document.getElementById('dateHeader');

function setDateHeader() {
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = now.toLocaleDateString();
    dateHeader.textContent = ` Today is ${dayName}, ${dateStr} and I :` ;
}

function updateCounterDisplay() {
    const completedCount = parseInt(localStorage.getItem('completedDays') || '0');
    const lastDay = localStorage.getItem('lastCompletedDay') || '';
    if (completedCount > 0 && lastDay) {
        counter.textContent = `${completedCount} times completed (Last: ${lastDay})`;
    } else {
        counter.textContent = '0 times completed';
    }
}

function saveCheckedState() {
    const checked = Array.from(taskList.children).map(li => li.classList.contains('checked'));
    localStorage.setItem('checkedTasks', JSON.stringify(checked));
}

function loadCheckedState() {
    const today = new Date().toLocaleDateString();
    const lastVisit = localStorage.getItem('lastVisitDate');
    // If it's a new day, clear checked state
    if (lastVisit !== today) {
        Array.from(taskList.children).forEach(li => li.classList.remove('checked'));
        localStorage.setItem('lastVisitDate', today);
        saveCheckedState();
    } else {
        const checked = JSON.parse(localStorage.getItem('checkedTasks') || '[]');
        Array.from(taskList.children).forEach((li, idx) => {
            if (checked[idx]) {
                li.classList.add('checked');
            } else {
                li.classList.remove('checked');
            }
        });
    }
}
function allTasksChecked() {
    return Array.from(taskList.children).length > 0 &&
        Array.from(taskList.children).every(li => li.classList.contains('checked'));
}

function updateCounterDisplay() {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = today.toLocaleDateString();
    const allChecked = allTasksChecked();
    counter.textContent = `${dayName}, ${dateStr}: ${allChecked ? 'Completed' : 'Not completed'}`;
}
function handleTaskClick(e) {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle('checked');
        saveCheckedState();
        // If all tasks are checked, increment counter
        if (allTasksChecked()) {
            let completedCount = parseInt(localStorage.getItem('completedDays') || '0');
            completedCount++;
            const now = new Date();
            const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
            localStorage.setItem('completedDays', completedCount);
            localStorage.setItem('lastCompletedDay', dayName);
        }
        // Always update counter display after any check/uncheck
        updateCounterDisplay();
    }
}

function resetTasksIfNewDay() {
    const today = new Date().toLocaleDateString();
    const lastVisit = localStorage.getItem('lastVisitDate');
    if (lastVisit !== today) {
        Array.from(taskList.children).forEach(li => li.classList.remove('checked'));
        localStorage.setItem('lastVisitDate', today);
        saveCheckedState();
    }
}

window.addEventListener('load', () => {
    setDateHeader();
    resetTasksIfNewDay();
    loadCheckedState();
    updateCounterDisplay();
});

taskList.addEventListener('click', handleTaskClick);