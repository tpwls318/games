const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const backgroundColor = colors['background'];
setState(initialState());
let final_score;
const x = p => p * canvas.width / col_length;
const y = p => p * canvas.height / row_length;
const pd = col_length / 16; // padding
const clearRect = (posX, posY) => {
  ctx.strokeStyle = backgroundColor;
  ctx.strokeRect(x(posX) + pd, y(posY) + pd,x(1) - pd * 2,y(1) - pd * 2);
}
const paintShadow = (posX, posY, color) => {
  clearRect(posX, posY);
  ctx.strokeStyle = color;
  ctx.strokeRect(x(posX) + pd, y(posY) + pd,x(1) - pd * 2,y(1) - pd * 2);
}
const paintBlock = (posX, posY, color) => {
  clearRect(posX, posY);
  if(color) ctx.fillStyle = color;
  ctx.fillRect(x(posX) + pd, y(posY) + pd, x(1) - pd * 2, y(1) - pd * 2);
}
const drawMap = () => {
  // bgc
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // wall
  ctx.fillStyle = colors['wall'];
  for(let i = 0;i < 20;i++){
    paintBlock(0, i);
    paintBlock(11, i);
  };
}
const drawStack = () => {
  state.stack.forEach((rowMap, cIdx) => {
    rowMap.forEach((color, rIdx) => paintBlock(rIdx, cIdx, color))
  });
}
const drawBlock = () => {
  let { expectedLoc, positions, block: { color } } = state;
  expectedLoc.forEach(({ x, y }) => paintShadow(x, y, color));
  positions.forEach(({ x, y }) => paintBlock(x, y, color));
}
const draw = () => {
  // init final score
  // final_score = 0;
  if(!state.isMoving){
    drawMap();
    drawStack();
  }
  drawBlock();
}
const step = t0 => t1 => {
  if(enable_to_move|| state.gameover || t1 - t0 < 800) {
    draw();
    window.requestAnimationFrame(step(t0));
  } else {
      if(isImmovable()) newCycle();
      nextPositions();
      draw();
      window.requestAnimationFrame(step(t1)); 
  }
}

window.addEventListener('keydown', e => {
  let key = e.key;
  switch (key) {
    case 'w': case 'ArrowUp':    if(!hard_drop_pressed) rotateBlock(); break;
    case 'a': case 'ArrowLeft':  if(!hard_drop_pressed) move(moveLeft); break;
    case 's': case 'ArrowDown':  if(!hard_drop_pressed) move(moveDown); break;
    case 'd': case 'ArrowRight': if(!hard_drop_pressed) move(moveRight); break;
    case ' ': moveToExpectedLoc(); break;
    //   case 'Escape': state = togglePause(state);
    //   break;
  }
})

window.requestAnimationFrame(step(0));