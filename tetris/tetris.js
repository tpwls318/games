const col_length = 12;
const row_length = 20;
let n = 0;
let enable_to_move = false;
let time_limit = 300;
let hard_drop_pressed = false;
const getTime = (n) => { return time_limit - n * 100; };
let block = mapGetRan(blocksMap);
let stack = new Map();
for(let i = row_length - 1;i >= 0;i--) stack.set(i, new Map());
const isGameOver = () => {
  let { positions, stack } = state;
  return positions.reduce((acc, { x, y }) => {
      return stack.get(y) && stack.get(y).get(x) || acc;
    }, false);
}
const hasCollision = (positions) => {
  let { stack } = state;
  return positions.reduce((acc, { x, y }) => {
      return y >= row_length || x < 1 || x > (col_length - 2) || stack.get(y) && stack.get(y).get(x) || acc;
    }, false)
}
const possEQ = (poss1, poss2) => poss1.reduce(
  (acc, pos, i) => pos.x != poss2[i].x || pos.y != poss2[i].y ? false : acc, true
);
const expectedLoc = (stack, positions) => {
  // top of stack
  let min_diff = row_length;
  let reducedPoss = positions.reduce((acc, { x, y }) => {
    acc[x] = acc[x] && acc[x] > y ? acc[x] : y;
    return acc;
  },{});
  for (const [k, v] of Object.entries(reducedPoss)) {
    let i = v;
    while(!(stack.get(i) && stack.get(i).get(+k)) && i < row_length){
      i++;
    }
    let diff = i - v - 1;
    if(min_diff > diff) min_diff = diff;
  }
  return positions.map(({ x, y }) => {
    return { x, y: (y + min_diff)};
  });
}
const moveToExpectedLoc = () =>{
  setState({ positions: state.expectedLoc });
  hard_drop_pressed = true;
}
const isImmovable = () => {
  // stack, base => y >= 0
  let { positions, stack } = state;
  return positions.reduce((acc, { x, y }) => {
     return y + 1 > 19 || stack.get(y + 1) && stack.get(y + 1).get(x) || acc;
  }, false);
};
const newBlock = () => {
  let { stack } = state;
  let block = mapGetRan(blocksMap);
  setState({ 
    block,
    positions: block.start,
    expectedLoc: expectedLoc(stack, block.start),
   });
};
const clearLine = () => {
  let { stack } = state;
  for(let i = 0;i < row_length;i++){
    if(stack.get(i).size == 10) stack.delete(i);
  }
  const iterator1 = stack.entries();
  let next = iterator1.next().value;
  let i = row_length - 1;
  let size = stack.size;
  while(i > row_length - size - 1){
    if(next[0] != i){
      stack.set(i, next[1]);
      stack.delete(next[0]);
    }
    next = iterator1.next().value;
    i--;
  }
  while(i >= 0) stack.set(i--, new Map());
};
const stackBlock = () => {
  let { positions, stack, block: { color } } = state;
  positions.map(({x, y}) => {
    stack.get(y).set(x, color);
  });
  setState({ stack });
};
const finishCycle = () => {
  n = 0;
  stackBlock();
  clearLine();
  newBlock();
  if(isGameOver()) toggleGameover();
};
const setTimeToMove = () => {
  enable_to_move = true;
  const a = (k) => {
    if(k == n) enable_to_move = false;
  }
  setTimeout(() => a(++n), getTime(n));
}
const newCycle = () => {
  if(!enable_to_move) {
    finishCycle();
    hard_drop_pressed = false;
  }
}
const isInvalidMove = (positions) => {
  let { stack } = state;
  return positions.reduce((acc, { x, y }) => {
     return y > 19 || x < 1 || x > 10 || stack.get(y) && stack.get(y).get(x) || acc;
  }, false);
};
const moveDown = cur_pos => ({ x: cur_pos.x, y: cur_pos.y + 1});
const moveRight = cur_pos => ({ x: cur_pos.x + 1, y: cur_pos.y});
const moveLeft = cur_pos => ({ x: cur_pos.x - 1, y: cur_pos.y});
const move = (moveDir) => {
    let positions = state.positions.map(pos => moveDir(pos));
    if(!isInvalidMove(positions)){
      setState({ positions });
      if(moveDir.name != 'moveDown'){
        if(isImmovable()) setTimeToMove();
        setState({ expectedLoc: expectedLoc(stack, positions) });
      }
    }
}
const nextPositions = () => {
  move(moveDown);
}
const toggleGameover = () => {
  setState({ gameover: !state.gameover });
}

const rotateBlock = () => {
  let { stack, positions, block: { pivot, rel_poss } } = state;
  if(pivot == null) return -1;
  rel_poss = rotateDiff(rel_poss);
  positions = applyRotate(positions[pivot], rel_poss);
  if(hasCollision(positions)){
    if(!hasCollision(positions.map(pos => moveLeft(pos)))){
      positions = positions.map(pos => moveLeft(pos));
    } else if(!hasCollision(positions.map(pos => moveRight(pos)))){
      positions = positions.map(pos => moveRight(pos));
    } else {
      return -1;// do not move
    }
  }
  setState({ 
    expectedLoc: expectedLoc(stack, positions),
    positions, block: { ...state.block, rel_poss },
  });
  if(isImmovable()) setTimeToMove();
};
const initialState = () => ({
  stack,
  block,
  expectedLoc: expectedLoc(stack, block.start),
  positions: block.start,
  isMoving: false,
  gameover: false,
});
