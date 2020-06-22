const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const backgroundColor = '#383838';
let block = mapGetRan(blocksMap);
let state = initialState(block);
let final_score;
const x = p => p * canvas.width / col_length;
const y = p => p * canvas.height / row_length;

const draw = () => {
  // init final score
  final_score = 0;

  // bgc
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // block
  ctx.fillStyle = 'rgb(0, 200, 50)';
  pd = col_length / 16;
  state.get('positions').forEach(b => ctx.fillRect(x(b.x) + pd, y(b.y) + pd, x(1) - pd * 2, y(1) - pd * 2));
}
const step = t0 => t1 => {
  if(t1 - t0 < 500) {
    draw();
    window.requestAnimationFrame(step(t0));
  } else {
      state = next(state);
      draw();
      window.requestAnimationFrame(step(t1)); 
  }
}

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'w': case 'ArrowUp':    state = rotateBlock(state); break;
    case 'a': case 'ArrowLeft':  state = move(state, moveLeft); break;
    case 's': case 'ArrowDown':  state = move(state, moveDown); break;
    case 'd': case 'ArrowRight': state = move(state, moveRight); break;
    // case ' ': case 'Escape':
    //   state = togglePause(state);
    //   break;
  }
})

window.requestAnimationFrame(step(0));