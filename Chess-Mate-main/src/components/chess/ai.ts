// src/components/chess/ai.ts
// ✅ REAL AI: Minimax + Alpha-Beta Pruning (Chess.js)

import type { Square, Move } from "chess.js";

export type AIMove = { from: Square; to: Square };

// ✅ Set depth only here (change once)
const AI_DEPTH = 3; // ✅ recommended: 3 (smart + not too slow)

const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

function evaluateBoard(chess: any): number {
  const board = chess.board();
  let score = 0;

  for (const row of board) {
    for (const piece of row) {
      if (!piece) continue;

      const val = PIECE_VALUES[piece.type] || 0;
      score += piece.color === "w" ? val : -val;
    }
  }
  return score;
}

function minimax(
  chess: any,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }

  const moves: Move[] = chess.moves({ verbose: true });
  if (isMaximizing) {
    let best = -Infinity;

    for (const move of moves) {
      chess.move(move);
      const score = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();

      best = Math.max(best, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) {
        console.log(" PRUNED => alpha:",alpha,"beta:", beta);
        break;
      }
    }

    return best;
  } else {
    let best = Infinity;

    for (const move of moves) {
      chess.move(move);
      const score = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();

      best = Math.min(best, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // ✅ alpha-beta prune
    }

    return best;
  }
}

export function getBestMoveMinimaxAlphaBeta(chess: any, depth: number = AI_DEPTH): AIMove | null {
  const moves: Move[] = chess.moves({ verbose: true });
  if (!moves.length) return null;

  let bestMove: Move | null = null;

  // ✅ AI plays BLACK
  let bestScore = Infinity;

  for (const move of moves) {
    chess.move(move);

    // After black move, white turn => maximizing for white
    const score = minimax(chess, depth - 1, -Infinity, Infinity, true);

    chess.undo();

    if (score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  if (!bestMove) return null;

  return {
    from: bestMove.from as Square,
    to: bestMove.to as Square,
  };
}