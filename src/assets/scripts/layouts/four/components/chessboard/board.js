import {
  Chessboard,
  COLOR,
  INPUT_EVENT_TYPE,
} from "cm-chessboard/src/cm-chessboard/Chessboard.js";

import { FEN } from "cm-chessboard/src/cm-chessboard/model/Position";

import { ChessAI, ChessGame } from "@ibrahimdeniz/chess-js";

const game = new ChessGame();
let difficulty = document.getElementById("difficulty").value;
const ai = new ChessAI();

const elChessBoard = document.getElementById("chess-board");
const elStatusTurn = document.getElementById("turn");
const elStatusText = document.getElementById("status");
const elLog = document.getElementById("log");
elLog.value = "Start Game\n";

const chessboard = new Chessboard(elChessBoard, {
  position: FEN.start,
  orientation: COLOR.white,
  assetsUrl: "./cm-chessboard/",
  // responsive: true,
  style: {
    aspectRatio: 1.0,
    showCoordinates: true,
    pieces: {
      file: "standard.svg",
    },
  },
});

document.getElementById("btnStart").addEventListener("click", () => {
  game.loadGameWithFen(FEN.start);
  chessboard.setPosition(FEN.start, false);
  elStatusText.innerText = "Ready";
  elLog.value = "Start Game\n";
  elStatusTurn.innerText = "White";
  difficulty = document.getElementById("difficulty").value;
});

document.getElementById("btnUndo").addEventListener("click", () => {
  // Undo last AI
  game.undoMove();
  elLog.value += "Black: Undo last move\n";
  // Undo last human
  game.undoMove();
  elLog.value += "White: Undo last move\n";
  chessboard.setPosition(game.fen, false);
});

chessboard.enableMoveInput((event) => {
  switch (event.type) {
    case INPUT_EVENT_TYPE.moveInputStarted:
      console.log(`moveInputStarted: ${event.square}`);
      // return `true`, if input is accepted/valid, `false` aborts the interaction, the piece will not move
      return true;
    case INPUT_EVENT_TYPE.validateMoveInput:
      console.log(`validateMoveInput: ${event.squareFrom}-${event.squareTo}`);
      return movePlayer(event);
    case INPUT_EVENT_TYPE.moveInputCanceled:
      console.log(`moveInputCanceled`);
  }
}, COLOR.white);

function updateStatus(event) {
  elStatusTurn.innerText = game.currentPlayer;
  elLog.value +=
    (game.currentPlayer == "white" ? "black" : "white") +
    ": " +
    event.from +
    " -> " +
    event.to +
    "\n";
  console.debug(game);
  if (game.gameOver) {
    console.debug(`Game Over - Winner: ${game.winner}`);
    elStatusText.innerText = `Game Over - Winner: ${game.winner}`;
    elLog.value += elStatusText.innerText;
  } else {
    if (game.inCheck()) {
      console.debug(`Check: ${game.inCheck}`);
      elStatusText.innerText = `Ready - Check!`;
      elLog.value += "Check!\n";
      if (game.gameOver) {
        console.debug(`Game Over - Winner: ${game.winner}`);
        elStatusText.innerText = `Game Over - Winner: ${game.winner}`;
        elLog.value += elStatusText.innerText;
      }
      if (game.inDoubleCheck()) {
        elStatusText.innerText = `Checkmate!`;
        elLog.value += "Checkmate!\n";
      }
    } else if (game.inDoubleCheck()) {
      elStatusText.innerText = `Checkmate!`;
      elLog.value += "Checkmate!\n";
    } else {
      elStatusText.innerText = `Ready`;
    }
  }
  elLog.scrollTop = elLog.scrollHeight;
}

function moveAi() {
  // AI - Move
  const aiMove = ai.selectMove(game.fen, { depth: difficulty });
  console.log(`AI Move ${aiMove}`);
  game.makeMove({ from: aiMove.from, to: aiMove.to });
  chessboard.movePiece(aiMove.from, aiMove.to, true);
  updateStatus(aiMove);
}

function movePlayer(event) {
  const validMove = game.validateMove({
    from: event.squareFrom,
    to: event.squareTo,
  });
  if (validMove) {
    game.makeMove({ from: event.squareFrom, to: event.squareTo });
    updateStatus({ from: event.squareFrom, to: event.squareTo });
    setTimeout(moveAi, 500);
  }
  return validMove;
}
