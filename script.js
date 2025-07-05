// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let score = 0;
const scoreElement = document.getElementById('score');
const gameContainer = document.getElementById('game-container');
const timeElement = document.getElementById('time');
let timeLeft = 30;
let timerInterval;
let gameInterval;
let gameActive = false;

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reset-btn").addEventListener("click", resetGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  scoreElement.textContent = score;
  gameContainer.innerHTML = '';
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  timeLeft = 30;
  timeElement.textContent = timeLeft;
  gameActive = true;
  gameInterval = setInterval(spawnDroplet, 700);
  timerInterval = setInterval(() => {
      timeLeft--;
      timeElement.textContent = timeLeft;
      if (timeLeft <= 0) {
          endGame();
      }
  }, 1000);
}

function resetGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  gameRunning = false;
  gameActive = false;
  score = 0;
  scoreElement.textContent = score;
  timeLeft = 30;
  timeElement.textContent = timeLeft;
  gameContainer.innerHTML = '';
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}

function createDroplet(x, y, id, isBad = false) {
    const droplet = document.createElement('div');
    droplet.className = isBad ? 'droplet bad-droplet' : 'droplet';
    droplet.style.left = x + 'px';
    droplet.style.top = y + 'px';
    droplet.dataset.id = id;
    droplet.addEventListener('click', function(e) {
        if (isBad) {
            score = Math.max(0, score - 1);
        } else {
            score += 1;
        }
        scoreElement.textContent = score;
        droplet.remove();
        e.stopPropagation();
    });
    return droplet;
}

let dropletId = 0;
function spawnDroplet() {
    const x = Math.random() * (gameContainer.offsetWidth - 30);
    const y = 0;
    const isBad = Math.random() < 0.25; // 25% chance to spawn a bad droplet
    const droplet = createDroplet(x, y, dropletId++, isBad);
    gameContainer.appendChild(droplet);
    animateDroplet(droplet);
}

function animateDroplet(droplet) {
    let y = 0;
    const fallSpeed = 2 + Math.random() * 3;
    function fall() {
        y += fallSpeed;
        droplet.style.top = y + 'px';
        if (y < gameContainer.offsetHeight - 30 && gameContainer.contains(droplet)) {
            requestAnimationFrame(fall);
        } else if (gameContainer.contains(droplet)) {
            droplet.remove();
        }
    }
    fall();
}

const winningMessages = [
    "Amazing! You're a water drop master!",
    "Fantastic job! You win!",
    "Incredible! You caught so many drops!",
    "Winner! You have great reflexes!"
];
const losingMessages = [
    "Try again! You can do better!",
    "Don't give up! Catch more drops next time!",
    "Almost there! Give it another shot!",
    "Keep practicing! You'll win soon!"
];

function launchConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.innerHTML = '';
    const colors = ['#FFD600', '#4fc3f7', '#0288d1', '#fff176', '#81d4fa'];
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = (Math.random() * 2) + 's';
        confettiContainer.appendChild(confetti);
    }
    setTimeout(() => confettiContainer.innerHTML = '', 3500);
}

function showEndMessage(isWin) {
    const messageArr = isWin ? winningMessages : losingMessages;
    const message = messageArr[Math.floor(Math.random() * messageArr.length)];
    const msgDiv = document.createElement('div');
    msgDiv.className = 'end-message';
    msgDiv.textContent = message + ` (Score: ${score})`;
    gameContainer.innerHTML = '';
    gameContainer.appendChild(msgDiv);
    if (isWin) launchConfetti();
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    gameActive = false;
    const isWin = score >= 20;
    showEndMessage(isWin);
    if (isWin) {
        launchConfetti();
    }
}
