const cat = document.getElementById("catImage");
const scoreDisplay = document.getElementById("scoreDisplay");
const lastScoreDisplay = document.getElementById("lastScoreDisplay");
const audio = new Audio("music.mp3");
audio.loop = true;

let score = 0;
let lastScore = 0;
let highScore = 0;
let scoreIntervalId = null;
let animationFrameId = null;

let posX = 0;
let posY = 0;
let speed = 1;
let angle = Math.random() * 2 * Math.PI;
let vx = Math.cos(angle) * speed;
let vy = Math.sin(angle) * speed;

function centerCat() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const scoreHeight = document.getElementById("scoreArea").offsetHeight;
  const rect = cat.getBoundingClientRect();

  posX = centerX - rect.width / 2;
  posY = centerY - rect.height / 2 + scoreHeight / 2;

  cat.style.transition = "none";
  cat.style.left = `${posX}px`;
  cat.style.top = `${posY}px`;
}

function animate() {
  const rect = cat.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width;
  const maxY = window.innerHeight - rect.height;
  const scoreHeight = document.getElementById("scoreArea").offsetHeight;

  posX += vx;
  posY += vy;

  if (posX < 0 || posX > maxX) vx = -vx;
  if (posY < scoreHeight || posY > maxY) vy = -vy;

  posX = Math.max(0, Math.min(posX, maxX));
  posY = Math.max(scoreHeight, Math.min(posY, maxY));

  cat.style.left = `${posX}px`;
  cat.style.top = `${posY}px`;

  const velocityIncrease = 0.05;
  const factor = 1 + velocityIncrease / Math.sqrt(vx * vx + vy * vy);
  vx *= factor;
  vy *= factor;

  animationFrameId = requestAnimationFrame(animate);
}

function updateScore() {
  score += 1;
  scoreDisplay.textContent = `Score: ${score}`;
}

function startChasing() {
  cat.src = "cat-spinning.gif";
  angle = Math.random() * 2 * Math.PI;
  speed = 1;
  vx = Math.cos(angle) * speed;
  vy = Math.sin(angle) * speed;
  animate();

  audio.currentTime = 0;
  audio.play().catch((err) => console.warn("audio error", err));

  score = 0;
  scoreDisplay.textContent = "Score: 0";

  if (scoreIntervalId) clearInterval(scoreIntervalId);
  scoreIntervalId = setInterval(updateScore, 10);
}

function stopChasing() {
  cat.src = "cat.PNG";
  cancelAnimationFrame(animationFrameId);
  centerCat();
  audio.pause();
  audio.currentTime = 0;

  if (scoreIntervalId) {
    clearInterval(scoreIntervalId);
    scoreIntervalId = null;
  }

  lastScore = score;
  if (lastScore > highScore) highScore = lastScore;
  lastScoreDisplay.textContent = `Last Score: ${lastScore} (High: ${highScore})`;
}

cat.addEventListener("mouseover", startChasing);
cat.addEventListener("mouseout", stopChasing);

cat.addEventListener("touchstart", (e) => {
  e.preventDefault();
  startChasing();
});

cat.addEventListener("touchend", stopChasing);

cat.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  const rect = cat.getBoundingClientRect();
  const withinX = touch.clientX >= rect.left && touch.clientX <= rect.right;
  const withinY = touch.clientY >= rect.top && touch.clientY <= rect.bottom;

  if (!withinX || !withinY) {
    stopChasing();
  }
});

window.addEventListener(
  "click",
  () => {
    audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        console.log("audio enabled");
      })
      .catch((err) => {
        console.warn("audio error", err);
      });
  },
  { once: true }
);

window.addEventListener("load", centerCat);
window.addEventListener("resize", centerCat);
