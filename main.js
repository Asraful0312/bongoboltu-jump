const startBtn = document.querySelector("#startBtn");
const bgMusic = document.querySelector("#bgMusic");
const scream = new Audio("./music/bongobontu.mp3");
const overMusic = new Audio("./music/game-over.mp3");
const jumpMusic = new Audio("./music/amimorinai.mp3");

let score = 0;
let cross = true;
let gameActive = false;

const hero = document.querySelector(".hero");
const monster = document.querySelector(".monster");
const scoreCon = document.querySelector(".score");
const gameOverText = document.querySelector(".gameOver");
const wrapper = document.querySelector(".wrapper");

const container = document.querySelector(".container");
const containerWidth = container.clientWidth;
const heroWidth = 50; // Adjust this based on your CSS
const stepSize = 40;

// Restart Button
const restartBtn = document.createElement("button");
restartBtn.innerText = "Restart";
restartBtn.id = "restartBtn";
document.body.appendChild(restartBtn);
restartBtn.style.display = "none";

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

// Select Buttons
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");

// Mobile Controls Event Listeners
leftBtn.addEventListener("touchstart", moveLeft);
rightBtn.addEventListener("touchstart", moveRight);
jumpBtn.addEventListener("touchstart", jump);

function moveLeft() {
  if (!gameActive) return;
  let heroX = parseInt(window.getComputedStyle(hero).getPropertyValue("left"));
  if (heroX - stepSize >= 0) {
    hero.style.left = heroX - stepSize + "px";
    hero.classList.remove("rotate");
  } else {
    hero.classList.add("rotate");
  }
}

function moveRight() {
  if (!gameActive) return;
  let heroX = parseInt(window.getComputedStyle(hero).getPropertyValue("left"));
  if (heroX + heroWidth + stepSize <= containerWidth) {
    hero.style.left = heroX + stepSize + "px";
  }
}

function jump() {
  if (!gameActive) return;
  let heroY = parseInt(window.getComputedStyle(hero).getPropertyValue("top"));
  if (heroY >= 200) {
    hero.classList.add("animateHero");

    // Stop and restart jump music
    jumpMusic.pause();
    jumpMusic.currentTime = 0;
    jumpMusic.play();

    setTimeout(() => hero.classList.remove("animateHero"), 700);
  }
}

document.onkeydown = function (e) {
  if (!gameActive) return;

  let heroX = parseInt(window.getComputedStyle(hero).getPropertyValue("left"));
  let heroY = parseInt(window.getComputedStyle(hero).getPropertyValue("top"));

  if ((e.keyCode === 87 || e.keyCode === 38) && heroY >= 200) {
    // Up / W
    hero.classList.add("animateHero");

    // Stop and restart jump music
    jumpMusic.pause();
    jumpMusic.currentTime = 0;
    jumpMusic.play();

    setTimeout(() => hero.classList.remove("animateHero"), 700);
  }

  if (
    (e.keyCode === 68 || e.keyCode === 39) &&
    heroX + heroWidth + stepSize <= containerWidth
  ) {
    // Right / D
    hero.style.left = heroX + stepSize + "px";
  }

  if ((e.keyCode === 65 || e.keyCode === 37) && heroX - stepSize >= 0) {
    // Left / A
    hero.style.left = heroX - stepSize + "px";
    hero.classList.remove("rotate");
  } else {
    hero.classList.add("rotate");
  }
};

function startGame() {
  gameActive = true;
  score = 0;
  scoreCon.innerText = "Score: 0";
  gameOverText.style.display = "none";
  startBtn.style.display = "none";
  restartBtn.style.display = "none";
  hero.style.display = "block";
  monster.style.display = "block";
  scoreCon.style.display = "block";
  wrapper.style.display = "none";
  hero.style.left = "50px";

  setTimeout(() => bgMusic.play(), 500);
  animateMonster();
  collisionCheck();
}

function animateMonster() {
  monster.classList.add("monsterAni");
}

function collisionCheck() {
  let check = setInterval(() => {
    let hx = parseInt(window.getComputedStyle(hero).getPropertyValue("left"));
    let hy = parseInt(window.getComputedStyle(hero).getPropertyValue("top"));
    let mx = parseInt(
      window.getComputedStyle(monster).getPropertyValue("left")
    );
    let my = parseInt(window.getComputedStyle(monster).getPropertyValue("top"));

    let offsetX = Math.abs(hx - mx);
    let offsetY = Math.abs(hy - my);

    if (offsetX < 50 && offsetY < 50) {
      // Collision detected
      gameOver();
      clearInterval(check);
    } else if (offsetX < 145 && cross) {
      score++;
      scoreCon.innerText = "Score: " + score;
      cross = false;
      setTimeout(() => (cross = true), 1000);
    }
  }, 100);
}

function gameOver() {
  gameActive = false;
  gameOverText.style.display = "block";
  monster.classList.remove("monsterAni");
  hero.style.display = "none";
  monster.style.display = "none";
  scream.play();
  jumpMusic.pause();
  jumpMusic.currentTime = 0;
  bgMusic.pause();
  setTimeout(() => overMusic.play(), 500);
  restartBtn.style.display = "block";
}
