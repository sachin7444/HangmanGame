const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text span");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");
const hintText = document.querySelector(".hint-text b");

let currentWord = "";
let correctLetters = [];
let wrongLetters = [];
let wrongGuessCount = 0;
const maxGuesses = 6;

const resetGame = () => {
  correctLetters = [];
  wrongLetters = [];
  wrongGuessCount = 0;
  hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
  guessesText.textContent = `${wrongGuessCount} / ${maxGuesses}`;
  
  // Clear wrong letters display if you add one (optional)
  // For example, create a <div class="wrong-letters"></div> in HTML to show wrong guesses

  keyboardDiv.querySelectorAll("button").forEach(btn => {
    btn.disabled = false;
    btn.setAttribute('aria-pressed', 'false');
  });

  wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
  gameModal.classList.remove("show");
};

const getRandomWord = () => {
  const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
  currentWord = word.toLowerCase();
  hintText.innerText = hint;
  resetGame();
};

const gameOver = (isVictory) => {
  setTimeout(() => {
    const modalText = isVictory ? "You found the word:" : "The correct word was:";
    gameModal.querySelector("img").src = isVictory ? "images/victory.gif" : "images/lost.gif";
    gameModal.querySelector("h4").innerHTML = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
  }, 300);
};

const updateWordDisplay = (letter) => {
  const liElements = wordDisplay.querySelectorAll("li");
  [...currentWord].forEach((char, index) => {
    if (char === letter) {
      liElements[index].innerText = letter.toUpperCase();
      liElements[index].classList.add("guessed");
    }
  });
};

const initGame = (button, clickedLetter) => {
  clickedLetter = clickedLetter.toLowerCase();

  if (correctLetters.includes(clickedLetter) || wrongLetters.includes(clickedLetter)) {
    // Letter already guessed, ignore
    return;
  }

  if (currentWord.includes(clickedLetter)) {
    correctLetters.push(clickedLetter);
    updateWordDisplay(clickedLetter);
  } else {
    wrongGuessCount++;
    wrongLetters.push(clickedLetter);
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
  }

  button.disabled = true;
  button.setAttribute('aria-pressed', 'true');
  guessesText.textContent = `${wrongGuessCount} / ${maxGuesses}`;

  // Check for win or lose
  const uniqueLetters = new Set(currentWord);
  const guessedLetters = new Set(correctLetters);

  if (wrongGuessCount === maxGuesses) return gameOver(false);
  if (guessedLetters.size === uniqueLetters.size) return gameOver(true);
};

// Keyboard setup
for (let i = 97; i <= 122; i++) {
  const button = document.createElement("button");
  const letter = String.fromCharCode(i);
  button.innerText = letter.toUpperCase();
  button.setAttribute('aria-label', `Letter ${letter.toUpperCase()}`);
  button.setAttribute('aria-pressed', 'false');
  keyboardDiv.appendChild(button);
  button.addEventListener("click", e => initGame(e.target, letter));
}

// Physical keyboard support
window.addEventListener('keydown', e => {
  const pressedKey = e.key.toLowerCase();
  if (pressedKey >= 'a' && pressedKey <= 'z') {
    // Find corresponding button
    const button = [...keyboardDiv.children].find(btn => btn.innerText.toLowerCase() === pressedKey);
    if (button && !button.disabled) {
      initGame(button, pressedKey);
    }
  }
});

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
