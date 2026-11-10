// 固定的中等難度題目；0 代表尚未填入的空格。
const puzzle = [
  "530070000",
  "600195000",
  "098000060",
  "800060003",
  "400803001",
  "700020006",
  "060000280",
  "000419005",
  "000080079"
];

const solution = [
  "534678912",
  "672195348",
  "198342567",
  "859761423",
  "426853791",
  "713924856",
  "961537284",
  "287419635",
  "345286179"
];

const boardElement = document.querySelector("#board");
const timerElement = document.querySelector("#timer");
const scoreElement = document.querySelector("#score");
const bestScoreElement = document.querySelector("#best-score");
const messageElement = document.querySelector("#message");
const clearButton = document.querySelector("#clear-button");
const restartButton = document.querySelector("#restart-button");
const numberButtons = document.querySelectorAll(".number-button");
const BEST_SCORE_KEY = "sudokuChallengeBestScore";

let board = [];
let selectedCell = null;
let elapsedSeconds = 0;
let timerId = null;
let gameWon = false;
let storageUnavailable = false;

// 讀取瀏覽器中的最高分；儲存功能不可用時仍可正常遊玩。
function loadBestScore() {
  try {
    const savedScore = localStorage.getItem(BEST_SCORE_KEY);
    if (savedScore === null) return null;

    const score = Number(savedScore);
    return Number.isInteger(score) && score >= 0 ? score : null;
  } catch (error) {
    console.warn("無法讀取最高分紀錄：", error);
    storageUnavailable = true;
    messageElement.textContent = "瀏覽器無法讀取最高分紀錄，但仍可正常遊玩。";
    messageElement.classList.add("warning");
    return null;
  }
}

// 建立棋盤格子，並標記不能修改的題目數字。
function createBoard() {
  boardElement.replaceChildren();
  board = puzzle.map((row) => row.split("").map(Number));

  board.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const cell = document.createElement("button");
      const isGiven = value !== 0;

      cell.type = "button";
      cell.className = `cell${isGiven ? " given" : ""}`;
      cell.dataset.row = rowIndex;
      cell.dataset.column = columnIndex;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute(
        "aria-label",
        `第 ${rowIndex + 1} 列第 ${columnIndex + 1} 行${isGiven ? `，固定數字 ${value}` : "，空格"}`
      );
      cell.textContent = isGiven ? String(value) : "";

      if (!isGiven) {
        cell.addEventListener("click", () => selectCell(rowIndex, columnIndex));
      }

      boardElement.append(cell);
    });
  });

  renderBoard();
}

function selectCell(row, column) {
  if (gameWon || puzzle[row][column] !== "0") return;
  selectedCell = { row, column };
  renderBoard();
}

// 更新格子顏色與玩家輸入的數字。
function renderBoard() {
  const cells = boardElement.querySelectorAll(".cell");
  const selectedValue = selectedCell
    ? board[selectedCell.row][selectedCell.column]
    : 0;

  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const column = Number(cell.dataset.column);
    const value = board[row][column];
    const isSelected = selectedCell?.row === row && selectedCell?.column === column;
    const isRelated = selectedCell && (
      selectedCell.row === row ||
      selectedCell.column === column ||
      (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
        Math.floor(selectedCell.column / 3) === Math.floor(column / 3))
    );

    cell.textContent = value === 0 ? "" : String(value);
    cell.classList.toggle("selected", Boolean(isSelected));
    cell.classList.toggle("related", Boolean(isRelated) && !isSelected);
    cell.classList.toggle("same-number", Boolean(selectedValue) && value === selectedValue);
    cell.classList.toggle("conflict", value !== 0 && hasConflict(row, column, value));
    cell.setAttribute(
      "aria-label",
      `第 ${row + 1} 列第 ${column + 1} 行${value === 0 ? "，空格" : `，${cell.classList.contains("given") ? "固定數字" : "玩家輸入"} ${value}`}`
    );
    cell.setAttribute("aria-selected", String(Boolean(isSelected)));
  });
}

function hasConflict(row, column, value) {
  for (let index = 0; index < 9; index += 1) {
    if (index !== column && board[row][index] === value) return true;
    if (index !== row && board[index][column] === value) return true;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startColumn = Math.floor(column / 3) * 3;
  for (let boxRow = startRow; boxRow < startRow + 3; boxRow += 1) {
    for (let boxColumn = startColumn; boxColumn < startColumn + 3; boxColumn += 1) {
      if ((boxRow !== row || boxColumn !== column) && board[boxRow][boxColumn] === value) {
        return true;
      }
    }
  }
  return false;
}

function enterNumber(value) {
  if (gameWon || !selectedCell) return;

  const { row, column } = selectedCell;
  if (puzzle[row][column] !== "0") return;

  board[row][column] = value;
  renderBoard();
  checkForWin();
}

function updateScore() {
  const score = Math.max(0, 1000 - elapsedSeconds);
  scoreElement.textContent = String(score);
  return score;
}

function updateTimer() {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  updateScore();
}

function checkForWin() {
  const isComplete = board.every((row) => row.every((value) => value !== 0));
  if (!isComplete) return;

  const isCorrect = board.every((row, rowIndex) =>
    row.every((value, columnIndex) => value === Number(solution[rowIndex][columnIndex]))
  );
  if (!isCorrect) {
    messageElement.textContent = "答案尚未完全正確，請檢查標示的衝突並再試一次。";
    messageElement.classList.add("warning");
    return;
  }

  finishGame();
}

function finishGame() {
  if (gameWon) return;
  gameWon = true;
  window.clearInterval(timerId);
  timerId = null;

  const finalScore = updateScore();
  const previousBest = loadBestScore();
  let newRecord = previousBest === null || finalScore > previousBest;
  let storageWarning = storageUnavailable;

  if (newRecord) {
    try {
      localStorage.setItem(BEST_SCORE_KEY, String(finalScore));
      bestScoreElement.textContent = String(finalScore);
    } catch (error) {
      console.warn("無法儲存最高分紀錄：", error);
      storageUnavailable = true;
      bestScoreElement.textContent = previousBest === null ? "尚無紀錄" : String(previousBest);
      newRecord = false;
      storageWarning = true;
    }
  } else {
    bestScoreElement.textContent = String(previousBest);
  }

  const recordMessage = newRecord ? "新紀錄！" : "";
  const storageMessage = storageWarning ? "（無法儲存最高分，請檢查瀏覽器儲存設定。）" : "";
  messageElement.textContent =
    `恭喜過關！${recordMessage}完成時間 ${timerElement.textContent}，最終分數 ${finalScore} 分。${storageMessage}`;
  messageElement.classList.remove("warning");
  messageElement.classList.add("success");
  renderBoard();
}

function restartGame() {
  window.clearInterval(timerId);
  timerId = null;
  elapsedSeconds = 0;
  gameWon = false;
  selectedCell = null;
  messageElement.className = "message";
  messageElement.textContent = storageUnavailable
    ? "瀏覽器無法讀取最高分紀錄，但仍可正常遊玩。"
    : "選取空格，再輸入數字開始挑戰。";
  if (storageUnavailable) messageElement.classList.add("warning");
  createBoard();
  updateTimer();
  timerId = window.setInterval(() => {
    elapsedSeconds += 1;
    updateTimer();
  }, 1000);
}

numberButtons.forEach((button) => {
  button.addEventListener("click", () => enterNumber(Number(button.dataset.number)));
});

clearButton.addEventListener("click", () => enterNumber(0));
restartButton.addEventListener("click", restartGame);

document.addEventListener("keydown", (event) => {
  if (event.key >= "1" && event.key <= "9") {
    enterNumber(Number(event.key));
  } else if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") {
    enterNumber(0);
  }
});

const initialBestScore = loadBestScore();
if (initialBestScore !== null) {
  bestScoreElement.textContent = String(initialBestScore);
}
restartGame();
