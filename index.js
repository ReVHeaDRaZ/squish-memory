const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let misses = 0;
let matches = 0;
let flipSound = new Audio("./assets/cardFlip.mp3");
let matchSound = new Audio("./assets/match.mp3");

document.querySelector(".misses").textContent = misses;

fetch("./cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    //shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);

    gridContainer.classList.remove("scale-down-tosize");
    gridContainer.offsetWidth; // trigger reflow
    gridContainer.classList.add("scale-down-tosize");
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");
  flipSound.play();

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
  if(matches==cards.length/2){
    document.getElementById("win-container").style.display = "block";
  }
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if(isMatch){
    spawnParticlesInContainer(particleArray,firstCard,'particle', 30, 10, 80,false,4);
    spawnParticlesInContainer(particleArray,secondCard,'particle', 30, 10, 80,false,4);
    disableCards();
    matchSound.play();
    matches++;
  }else{
    unflipCards();
  } 
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
    flipSound.play();
    misses++;
    document.querySelector(".misses").textContent = misses;
  }, 800);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  misses = 0;
  matches = 0;
  document.querySelector(".misses").textContent = misses;
  gridContainer.innerHTML = "";
  generateCards();
  document.getElementById("win-container").style.display = "none";
}
