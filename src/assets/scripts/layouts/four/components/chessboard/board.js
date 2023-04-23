import {
  Chessboard,
  COLOR,
  INPUT_EVENT_TYPE,
} from "cm-chessboard/src/cm-chessboard/Chessboard.js";

import { FEN } from "cm-chessboard/src/cm-chessboard/model/Position";

import { ChessAI, ChessGame } from "@ibrahimdeniz/chess-js";

const game = new ChessGame();
const difficulty = 5;
const ai = new ChessAI();

const chessboard = new Chessboard(document.getElementById("chess-board"), {
  position: FEN.start,
  orientation: COLOR.white,
  assetsUrl: "./chessboard/",
  responsive: true,
  style: {
    aspectRatio: 1.0,
    showCoordinates: true,
    pieces: {
      file: "standard.svg",
    },
  },
});

chessboard.enableMoveInput((event) => {
  switch (event.type) {
    case INPUT_EVENT_TYPE.moveInputStarted:
      console.log(`moveInputStarted: ${event.square}`);
      // return `true`, if input is accepted/valid, `false` aborts the interaction, the piece will not move
      return true;
    case INPUT_EVENT_TYPE.validateMoveInput:
      console.log(`validateMoveInput: ${event.squareFrom}-${event.squareTo}`);
      // if (validMove) {
      //   movePlayer(event);
      // } else {
      //   console.error(`Invalid move: ${event.squareFrom}-${event.squareTo}`);
      // }
      // return true, if input is accepted/valid, `false` takes the move back
      return movePlayer(event);
    case INPUT_EVENT_TYPE.moveInputCanceled:
      console.log(`moveInputCanceled`);
  }
}, COLOR.white);

function updateStatus() {
  console.log(`Game Over: ${game.gameOver}`);
  console.log(`Game winner: ${game.winner}`);
  console.log(`Check ${game.inCheck()}`);
  console.log(`Checkmate ${game.inDoubleCheck()}`);
}

function moveAi() {
  // AI - Move
  const aiMove = ai.selectMove(game.fen, { depth: difficulty });
  console.log(`AI Move ${aiMove}`);
  game.makeMove({ from: aiMove.from, to: aiMove.to });
  chessboard.movePiece(aiMove.from, aiMove.to, true);
  updateStatus();
  chessboard.setPosition(game.fen, false);
}

function movePlayer(event) {
  const validMove = game.validateMove({
    from: event.squareFrom,
    to: event.squareTo,
  });
  if (validMove) {
    game.makeMove({ from: event.squareFrom, to: event.squareTo });
    updateStatus();
    moveAi();
  }
  return validMove;
}
