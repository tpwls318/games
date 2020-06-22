const col_length = 12;
const row_length = 20;
const EAST = { x: 1, y: 0 };
const WEST = { x: -1, y: 0 };
const SOUTH = { x: 0, y: 1 };

const moveDown = cur_pos => ({ x: cur_pos.x, y: cur_pos.y + 1});
const moveRight = cur_pos => ({ x: cur_pos.x + 1, y: cur_pos.y});
const moveLeft = cur_pos => ({ x: cur_pos.x - 1, y: cur_pos.y});
const move = (state, moveDir) => state.set('positions', state.get('positions').map(cur_pos => moveDir(cur_pos)));
const nextPositions = state => state.get('positions').map(cur_pos => moveDown(cur_pos));
const initialState = block => objToMap({
  block,
  positions: block.start,
  pause: false,
  gameover: false,
});

const next = spec({
  block: x => x.get('block'),
  positions: nextPositions,
  pause: x => x.get('pause'),
  gameover: x => x.get('gameover'),
})
// const togglePause = (prev_state) => ({ ...prev_state, pause: !prev_state.pause, gameover: prev_state.gameover && false })
const rotateBlock = state => {
  state.get('block').rel_poss = rotateDiff(state.get('block').rel_poss);
  let { pivot, rel_poss } = state.get('block');
  // console.log({ pivot, rel_poss });
  return state.set('positions', applyRotate(state.get('positions')[pivot], rel_poss));
};