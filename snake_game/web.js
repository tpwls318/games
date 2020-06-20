const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const backgroundColor = '#383838';
let padding;
let state = initialState();
let final_score;
let apple = document.getElementById("apple");
const x = p => p * canvas.width / state.col;
const y = p => p * canvas.height / state.row;
const showMessage = ({ pause, gameover }, t0) => {
  let message = '';
  let score = final_score || state.snake.length;
  let fontSize = '';
  color = 'yellow';
  if(gameover) {
    fontSize = '20px';
    message = `Your final score :${score}
press space to restart`;
  } else if(pause){
    fontSize = '24px';
    if(!t0){
      message = 'press space to start';
      draw();
    } else {
      color = 'darkblue';
      message = `Your score :${score}`;
    }
    
  } else {
    fontSize = '16px';
    message = 'press space to pause';
  }
  document.getElementById('message').style.color = color;
  document.getElementById('message').style.fontSize = fontSize;
  document.getElementById('message').innerHTML = message;
}
const draw = () => {
  // init final score
  final_score = 0;

  // bgc
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // snake
  ctx.fillStyle = 'rgb(0, 200, 50)';
  pd = state.col / 16;
  state.snake.forEach(b => ctx.fillRect(x(b.x) + pd, y(b.y) + pd, x(1) - pd * 2, y(1) - pd * 2));

  // apple
  var oc = document.createElement('canvas'), octx = oc.getContext('2d');
  octx.drawImage(apple, 0, 0, x(1) - 6, y(1) - 6);
  ctx.drawImage(oc, x(state.apple.x) + 3, y(state.apple.y) + 2);

  // crash
  for (let i = 1; i < state.snake.length; i++) {
    if(JSON.stringify(state.snake[0]) == JSON.stringify(state.snake[i])){
      ctx.fillStyle = 'rgb(255, 40, 40)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      window.setTimeout(() => {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }, 100);
      final_score = state.snake.length;
      state = initialState();
      state.gameover = true;
      break;
    }
  }
}
const step = t0 => t1 => {
  showMessage(state, t0);
  if(state.pause || t1 - t0 < 100 - state.snake.length * 2) {
    window.requestAnimationFrame(step(t0));
  } else {
      state = next(state);
      draw();
      window.requestAnimationFrame(step(t1)); 
  }
}

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'w': case 'ArrowUp':    state = enqueueMove(state, NORTH); break;
    case 'a': case 'ArrowLeft':  state = enqueueMove(state, WEST); break;
    case 's': case 'ArrowDown':  state = enqueueMove(state, SOUTH); break;
    case 'd': case 'ArrowRight': state = enqueueMove(state, EAST); break;
    case ' ': case 'Escape':
      state = togglePause(state);
      document.getElementById('message').style.backgroundColor = state.pause ? '#bbbbbb' : 'transparent';
      break;
  }
})

window.requestAnimationFrame(step(0));