let startTime = 0;
let elapsedTime = 0;
let timeInterval = null;
let isRunning = false;

const display = {
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    milliseconds: document.getElementById('milliseconds')
};

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const themeBtn = document.getElementById('themeBtn');

// Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    
    // Save theme preference
    localStorage.setItem('stopwatch-theme', isDark ? 'light' : 'dark');
}

function handleStart() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timeInterval = setInterval(updateDisplay, 10);
        isRunning = true;
        
        startBtn.disabled = true;
        stopBtn.disabled = false;
        resetBtn.disabled = false;
    }
}

function handleStop() {
    if (isRunning) {
        clearInterval(timeInterval);
        timeInterval = null;
        elapsedTime = Date.now() - startTime;
        isRunning = false;
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
        resetBtn.disabled = false;
    }
}

function handleReset() {
    clearInterval(timeInterval);
    timeInterval = null;
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    
    display.hours.value = '00';
    display.minutes.value = '00';
    display.seconds.value = '00';
    display.milliseconds.value = '00';
    
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = false;
}

function updateDisplay() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    
    const time = {
        hours: Math.floor(elapsedTime / (1000 * 60 * 60)),
        minutes: Math.floor((elapsedTime / (1000 * 60)) % 60),
        seconds: Math.floor((elapsedTime / 1000) % 60),
        milliseconds: Math.floor((elapsedTime % 1000) / 10)
    };

    display.hours.value = padNumber(time.hours);
    display.minutes.value = padNumber(time.minutes);
    display.seconds.value = padNumber(time.seconds);
    display.milliseconds.value = padNumber(time.milliseconds);
}

function padNumber(number) {
    return number.toString().padStart(2, '0');
}

// Event Listeners
startBtn.addEventListener('click', handleStart);
stopBtn.addEventListener('click', handleStop);
resetBtn.addEventListener('click', handleReset);
themeBtn.addEventListener('click', toggleTheme);

// Initialize
handleReset();

// Load saved theme
const savedTheme = localStorage.getItem('stopwatch-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeBtn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'; 

// Add Raining Hearts
function createHeart(x, y, isClick = false) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    if (isClick) {
        heart.classList.add('heart-click');
    }
    heart.innerHTML = '♥';
    
    // Position heart
    if (isClick) {
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
    } else {
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '-50px'; // Start above the viewport
    }
    
    // Calculate animation duration
    const animationDuration = (Math.random() * 5 + 5);
    heart.style.animationDuration = animationDuration + 's';
    heart.style.fontSize = (Math.random() * 10 + 10) + 'rem';
    document.body.appendChild(heart);

    // Remove heart after animation completes
    setTimeout(() => {
        if (heart && heart.parentElement) {
            heart.remove();
        }
    }, (animationDuration * 1000) + 1000);
}

// Handle click events
function handleClick(e) {
    // Create heart at click position
    createHeart(e.clientX, e.clientY, true);
}

// Create hearts at lower frequency
function startRainingHearts() {
    if (window.heartInterval) {
        clearInterval(window.heartInterval);
    }
    window.heartInterval = setInterval(() => createHeart(), 800);
}

// Cleanup function
function cleanup() {
    if (window.heartInterval) {
        clearInterval(window.heartInterval);
    }
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach(heart => heart.remove());
}

// Initialize hearts animation
startRainingHearts();

// Add event listeners
window.addEventListener('unload', cleanup);
document.addEventListener('click', handleClick); 