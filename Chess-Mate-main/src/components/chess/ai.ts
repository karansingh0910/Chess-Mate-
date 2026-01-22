export function getRandomAIMove(chess: any) {
  const moves = chess.moves({ verbose: true });
  if (!moves.length) return null;

  const randomMove = moves[Math.floor(Math.random() * moves.length)];

  return {
    from: randomMove.from,
    to: randomMove.to,
  };
}