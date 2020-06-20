const col_length = 32;
const row_length = 18;
const EAST = { x: 1, y: 0 };
const WEST = { x: -1, y: 0 };
const NORTH = { x: 0, y: -1 };
const SOUTH = { x: 0, y: 1 };

const getDistance = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
const randPos = ({ col, row }) => ({ x: Math.floor(Math.random() * col), y: Math.floor(Math.random() * row) });
const randApplePos = state => {
  let rand_pos = randPos(state);
  if(!state.snake.reduce((acc, v) => acc ? getDistance(v, rand_pos) > 3 : acc), true){
    rand_pos = randPos(state);
  }
  return rand_pos;
}
const posEq = (p1, p2) => !(p1.x - p2.x || p1.y - p2.y);
const willEat = (nextHead, apple) => posEq(nextHead, apple);
const nextHead = ({ snake, moves, col, row }) => ({ x: mod(snake[0].x + moves[0].x)(col), y: mod(snake[0].y + moves[0].y)(row) });
const nextSnake = (state) => state.snake.unshift(nextHead(state))
  && (willEat(state.snake[0], state.apple)
  || state.snake.pop()) && state.snake;
const nextApple = state => willEat(state.snake[0], state.apple) ? randApplePos(state) : state.apple;
const invalidMove = (moves, dir) => moves[moves.length - 1].x && dir.x || moves[moves.length - 1].y && dir.y;
const nextMoves = ({ moves }) => moves.length == 1 ? moves : moves.slice(1);

const initialState = () => ({
  col: col_length,
  row: row_length,
  snake: [{ x: 4, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 2 }],
  apple: { x: col_length - 3, y: 2 },
  moves: [EAST],
  pause: true,
  gameover: false,
})
const next = spec({
  col: x => x.col,
  row: x => x.row,
  snake: nextSnake,
  apple: nextApple,
  moves: nextMoves,
  pause: x => x.pause,
  gameover: x => x.gameover,
})
const togglePause = (prev_state) => ({ ...prev_state, pause: !prev_state.pause, gameover: prev_state.gameover && false })
const enqueueMove = (prev_state, dir) => (
  invalidMove(prev_state.moves, dir)
    ? prev_state
    : {...prev_state, moves: [...prev_state.moves, dir]}
);