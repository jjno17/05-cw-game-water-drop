// Variables to control game state
let gameRunning = false;
let score = 0;
let timeLeft = 30;
let gameInterval, timerInterval;
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const gameContainer = document.getElementById('game-container');
const difficultySelect = document.getElementById('difficulty');

// Difficulty settings
const difficultySettings = {
    easy: { time: 60, spawnRate: 1000 },
    normal: { time: 30, spawnRate: 700 },
    hard: { time: 15, spawnRate: 500 }
};
let currentDifficulty = 'normal';

// Event listeners
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('reset-btn').addEventListener('click', resetGame);
difficultySelect.addEventListener('change', () => {
    currentDifficulty = difficultySelect.value;
    resetGame();
});

// Sounds
const collectSound = document.getElementById('collect-sound');
const missSound = document.getElementById('miss-sound');
const buttonSound = document.getElementById('button-sound');
const winSound = document.getElementById('win-sound');

function startGame() {
    if (gameRunning) return;
    console.log('Game started'); // Debugging log
    gameRunning = true;
    const settings = difficultySettings[currentDifficulty];
    score = 0;
    timeLeft = settings.time;
    scoreElement.textContent = score;
    timeElement.textContent = timeLeft;
    gameContainer.innerHTML = ''; // Clear existing droplets

    // Start spawning droplets
    gameInterval = setInterval(spawnDroplet, settings.spawnRate);
    console.log('Droplet spawning started'); // Debugging log

    // Start the timer
    timerInterval = setInterval(() => {
        timeLeft--;
        timeElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
    console.log('Timer started'); // Debugging log
}

function resetGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    gameRunning = false;
    const settings = difficultySettings[currentDifficulty];
    score = 0;
    timeLeft = settings.time;
    scoreElement.textContent = score;
    timeElement.textContent = timeLeft;
    gameContainer.innerHTML = ''; // Clear droplets
}

function spawnDroplet() {
    const droplet = document.createElement('div');
    droplet.classList.add('droplet');

    // Randomly decide if it's a good (blue) or bad (red) droplet
    if (Math.random() > 0.5) {
        droplet.classList.add('red'); // Bad droplet
        droplet.dataset.type = 'bad';
    } else {
        droplet.dataset.type = 'good'; // Good droplet
    }

    // Set random horizontal position
    droplet.style.left = Math.random() * 90 + '%';

    // Add click event to handle scoring
    droplet.addEventListener('click', () => {
        if (droplet.dataset.type === 'good') {
            score += 1; // Add a point for blue droplets
            collectSound.play(); // Play collect sound
        } else {
            score = Math.max(0, score - 1); // Deduct a point for red droplets, but don't go below 0
            missSound.play(); // Play miss sound
        }
        scoreElement.textContent = score; // Update the score display
        droplet.remove(); // Remove the droplet after it's clicked
    });

    // Append to the game container
    gameContainer.appendChild(droplet);

    // Remove droplet after it falls out of view
    droplet.addEventListener('animationend', () => {
        if (gameContainer.contains(droplet)) {
            gameContainer.removeChild(droplet);
        }
    });
}

function createDroplet(x, isBad) {
    const droplet = document.createElement('div');
    droplet.className = isBad ? 'droplet bad-droplet' : 'droplet';
    droplet.style.left = `${x}px`;
    droplet.style.top = `0px`;

    droplet.addEventListener('click', () => {
        if (isBad) {
            score = Math.max(0, score - 1); // Deduct points for bad droplets
            missSound.play();
        } else {
            score += 1; // Add points for good droplets
            collectSound.play();
        }
        scoreElement.textContent = score;
        droplet.remove();
    });

    return droplet;
}

function animateDroplet(droplet) {
    let y = 0;
    const fallSpeed = 2 + Math.random() * 3; // Randomize fall speed
    function fall() {
        y += fallSpeed;
        droplet.style.top = `${y}px`;
        if (y < gameContainer.offsetHeight - 30 && gameContainer.contains(droplet)) {
            requestAnimationFrame(fall);
        } else if (gameContainer.contains(droplet)) {
            droplet.remove(); // Remove droplet if it reaches the bottom
        }
    }
    fall();
}

const losingMessages = [
    "Don't give up! Catch more drops next time!",
    "Almost there! Give it another shot!",
    "Keep practicing! You'll win soon!"
];

const milestoneMessages = [
    { score: 10, message: "Halfway there! Keep going!" }, // Halfway to 20
    { score: 20, message: "Great job! You reached 20 points!" },
    { score: 30, message: "You're on fire! Keep it up!" },
    { score: 50, message: "Amazing! You're unstoppable!" }
];

let milestonesTriggered = new Set();

function checkMilestones(score) {
    milestoneMessages.forEach(milestone => {
        if (score >= milestone.score && !milestonesTriggered.has(milestone.score)) {
            showMilestoneMessage(milestone.message); // Display milestone message
            milestonesTriggered.add(milestone.score); // Mark milestone as triggered
        }
    });
}

function showMilestoneMessage(message) {
    const milestonePopup = document.createElement('div');
    milestonePopup.classList.add('milestone-popup');
    milestonePopup.textContent = message;

    document.body.appendChild(milestonePopup);

    // Remove the popup after 2 seconds
    setTimeout(() => milestonePopup.remove(), 2000);
}

function updateScore(points) {
    score += points;
    if (score < 0) score = 0; // Ensure score doesn't go below 0
    scoreElement.textContent = score;

    // Check for milestone messages
    checkMilestones(score);

    // Check if the player has reached 20+ droplets
    if (score >= 20 && gameRunning) {
        gameRunning = false; // Stop further game actions
        winSound.play(); // Play win sound
        showConfetti(); // Trigger confetti
        showGameOverWindow('Congratulations! You collected 20+ droplets!'); // Show win popup
    }
}

function endGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);

    if (score >= 20) {
        winSound.play(); // Play win sound
        showConfetti(); // Trigger confetti
        showGameOverWindow('Congratulations! You collected 20+ droplets!');
    } else {
        const randomLosingMessage = losingMessages[Math.floor(Math.random() * losingMessages.length)];
        showGameOverWindow(`Game Over! ${randomLosingMessage}`);
    }
}

function showConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.innerHTML = ''; // Clear any existing confetti
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = getRandomConfettiColor();
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        confettiContainer.appendChild(confetti);

        // Remove confetti after animation ends
        setTimeout(() => confetti.remove(), 3000);
    }
}

function getRandomConfettiColor() {
    const colors = ['#FFC907', '#2E9DF7', '#8BD1CB', '#4FCB53', '#FF902A', '#F5402C', '#159A48', '#F16061'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function showGameOverWindow(message) {
    const gameWrapper = document.querySelector('.game-wrapper');
    const gameOverWindow = document.createElement('div');
    gameOverWindow.classList.add('game-over-window');
    gameOverWindow.innerHTML = `
        <h2>${message}</h2>
        <button id="play-again-btn">Play Again</button>
    `;
    gameWrapper.appendChild(gameOverWindow);

    document.getElementById('play-again-btn').addEventListener('click', () => {
        gameOverWindow.remove();
        resetGame();
    });
}
