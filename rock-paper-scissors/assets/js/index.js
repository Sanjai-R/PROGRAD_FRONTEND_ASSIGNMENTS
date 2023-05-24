// JavaScript code for Rock-Paper-Scissors game

// Initialize scores
let playerScore = 0;
let houseScore = 0;

// Get HTML elements
const playerScoreElement = document.querySelector(".player_score");
const houseScoreElement = document.querySelector(".house_score");
const resultTextElement = document.querySelector(".result-text");
const playerChoiceElement = document.querySelector(
  ".game-board .player .choice"
);
const houseChoiceElement = document.querySelector(".game-board .house .choice");

// Choices mapping
const choices = {
  r: {
    name: "Rock",
    icon: "assets/images/icon-rock.svg",
  },
  p: {
    name: "Paper",
    icon: "assets/images/icon-paper.svg",
  },
  s: {
    name: "Scissors",
    icon: "assets/images/icon-scissors.svg",
  },
};

// Function to generate a random choice for the house
function getHouseChoice() {
  const keys = Object.keys(choices);
  const randomIndex = Math.floor(Math.random() * keys.length);
  return choices[keys[randomIndex]];
}

// Function to update the score on the UI
function updateScore() {
  playerScoreElement.textContent = playerScore;
  houseScoreElement.textContent = houseScore;
}

// Function to display the player and house choices
function displayChoices(playerChoice, houseChoice) {
  console.log(houseChoiceElement.innerHTML);
  playerChoiceElement.innerHTML = `<img src="${playerChoice.icon}" alt="${playerChoice.name}" />`;
  houseChoiceElement.innerHTML = `<img src="${houseChoice.icon}" alt="${houseChoice.name}" />`;
}

// Function to determine the winner of the round
function determineWinner(playerChoice, houseChoice) {
  if (playerChoice === houseChoice) {
    return "It's a tie!";
  } else if (
    (playerChoice === choices.r && houseChoice === choices.s) ||
    (playerChoice === choices.p && houseChoice === choices.r) ||
    (playerChoice === choices.s && houseChoice === choices.p)
  ) {
    return "You win!";
  } else {
    return "The house wins!";
  }
}

// Function to handle player choice and game logic
function playGame(playerChoiceKey) {
  document.querySelector(".game-board").style.display = "flex";
  const playerChoice = choices[playerChoiceKey];
  const houseChoice = getHouseChoice();

  displayChoices(playerChoice, houseChoice);

  const roundResult = determineWinner(playerChoice, houseChoice);
  resultTextElement.textContent = roundResult;

  if (roundResult === "You win!") {
    playerScore++;
  } else if (roundResult === "The house wins!") {
    houseScore++;
  }

  updateScore();

  if (playerScore === 5) {
    resultTextElement.textContent = "Congratulations! You win the game!";
    disableChoices();
  } else if (houseScore === 5) {
    resultTextElement.textContent = "Sorry! The house wins the game!";
    disableChoices();
  }
}

// Function to disable choices after the game ends
function disableChoices() {
  const choiceElements = document.querySelectorAll(".choice");
  choiceElements.forEach((choice) => {
    choice.removeEventListener("click", handleChoice);
  });
}

// Function to handle player choice
function handleChoice(event) {
  const choice = event.target.closest(".choice");
  if (!choice) return;

  const choiceId = choice.id;

  playGame(choiceId);
}

// Event listener for start button
const startButton = document.querySelector(".button");
startButton.addEventListener("click", () => {
  document.querySelector(".start_container").remove();
  const choiceElements = document.querySelectorAll(".choice");

  choiceElements.forEach((choice) => {
    choice.addEventListener("click", handleChoice);
  });
});
