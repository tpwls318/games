const home = document.getElementById('home');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const hold_canvas = document.getElementById('hold');
const hold_ctx = hold_canvas.getContext('2d');
const next_canvas = document.getElementById('next');
const next_ctx = next_canvas.getContext('2d');
const backgroundColor = colors['background'];
setState(initialState());
let { width, height } = canvas;
const x = p => p * canvas.width / col_length;
const y = p => p * canvas.height / row_length;
const holdX = p => p * hold_canvas.width / block_col_length;
const holdY = p => p * hold_canvas.height / block_row_length;
const pd = col_length / 16; // padding
const showGameover = () => {
  document.getElementById("score_text").innerHTML = `SCORE: ${status.score}<br><br>PRESS ENTER<br>TO RESTART`;
}
const tetrisPopup = () => {
  const tetris_popup = document.getElementById('tetris_popup');
  tetris_popup.innerHTML = `
<span>T</span><span style="color: ${colors['L']}">E</span><span>T</span><span style="color: ${colors['Z']}">R</span><span style="color: ${colors['O']}">I</span><span style="color: ${colors['T']}">S</span>`;
};
tetrisPopup();
const fillWholeRect = (id, color) => {
  const cv = document.getElementById(id);
  const id_ctx = cv.getContext('2d');
  id_ctx.fillStyle = color;
  id_ctx.fillRect(0, 0, cv.width, cv.height);
}
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
const drawHold = () => {
  let { hold } = status;
  hold_ctx.fillStyle = colors.background;
  hold_ctx.fillRect(0, 0, hold_canvas.width, hold_canvas.height);
  if(hold){
    hold_ctx.fillStyle = hold.color;
    const paintHold = (posX, posY) => {
      hold_ctx.fillRect(holdX(posX) + pd, holdY(posY) + pd, holdX(1) - pd * 2, holdY(1) - pd * 2);
    }
    holdBlocks.get(hold.name).positions.map(({ x, y }) => paintHold(x, y));
  }
  fillWholeRect('left_space', colors['wall']);
  const hold_text = document.getElementById('hold_text');
  hold_text.style.backgroundColor = colors['background'];
  hold_text.innerHTML = 'HOLD';
}
const drawNext = () => {
  let next_block = state.blockQueue[state.blockQueue.length - 2];
  next_ctx.fillStyle = colors.background;
  next_ctx.fillRect(0, 0, next_canvas.width, next_canvas.height);
  next_ctx.fillStyle = next_block.color;
  const paintHold = (posX, posY) => {
    next_ctx.fillRect(holdX(posX) + pd, holdY(posY) + pd, holdX(1) - pd * 2, holdY(1) - pd * 2);
  }
  holdBlocks.get(next_block.name).positions.map(({ x, y }) => paintHold(x, y));
}
const drawStatus = () => {
  let {
    score,
    line,
    level,
  } = status;
  const status_board = document.getElementById('status');
  status_board.style.backgroundColor = colors['wall'];
  const next_text = document.getElementById('next_text');
  next_text.style.backgroundColor = colors['background'];
  next_text.innerHTML = 'NEXT';
  status_board.innerHTML = `
  <div class="status">score: ${score}</div>
  <div class="status">line: ${line}</div>
  <div class="status">level: ${level}</div>
  <img id="S" src="images/S.png">
  `;
}
const drawHome = () => {
  const tetris = document.getElementById('TETRIS');
  const sj_park = document.getElementById('SJPARK');
  drawMap();
  ctx.drawImage(tetris, width / 2 - 125, 75, 250, 250);
  ctx.drawImage(sj_park, width / 2 - 60, 300, 124, 98);
  const key_info = document.getElementById('key_info');
  key_info.style.visibility = 'visible';
  key_info.innerText = `START: ENTER
  MOVE RIGHT/LEFT: RIGHT/LEFT ARROW
  ROTATE CLOCKWISE: UP ARROW
  SOFT DROP: DOWN ARROW
  HARD DROP: SPACE
  PAUSE: P HOLD: SHIFT`;
};
const drawPause = () => {
  let [paddingX, paddingY] = [80, 220];
  drawMap();
  ctx.fillStyle = 'black';
  ctx.fillRect(paddingX, paddingY, width - 2 * paddingX, height - 2 * paddingY);
  ctx.font = '30px Minecrafter';
  ctx.fillStyle = 'white';
  ctx.fillText('PAUSE', paddingX + 20, paddingY + 40);
};
const draw = () => {
  let { tetris, gameover } = state;
  drawMap();
  drawStack();
  drawBlock();
  drawHold();
  drawNext();
  drawStatus();
  if(gameover) {
    showGameover();
    gameover_popup.style.visibility = 'visible';
  }
  if(tetris) {
    tetris_popup.style.visibility = 'visible';
    setTimeout(() => {
      tetris_popup.style.visibility = 'hidden';
      setState({ tetris: false });
    }, 600);
  };
}
const step = t0 => t1 => {
  let { home, gameover, pause } = state;
  if(home) {
    drawHome();
  } else if(pause){
    drawPause();
  } else if(enable_to_move || gameover || t1 - t0 < 800 - status.level * 50) {
    draw();
  } else {
      if(isImmovable()) newCycle();
      nextPositions();
      draw();
      window.requestAnimationFrame(step(t1));
      return 0;
  }
  window.requestAnimationFrame(step(t0));
}

window.addEventListener('keydown', e => {
  let { home, gameover } = state;
  if(home || gameover){
    if(e.key == 'Enter'){
      if(home) {
        setState({ home: !home });
        document.getElementById('key_info').style.visibility = 'hidden';
      }
      else {
        setState(initialState());
        gameover_popup.style.visibility = 'hidden';
      }
    }
  } else {
    switch (e.key) {
      case 'w': case 'ArrowUp':    if(!hard_drop_pressed) rotateBlock(); break;
      case 'a': case 'ArrowLeft':  if(!hard_drop_pressed) move(moveLeft); break;
      case 's': case 'ArrowDown':  if(!hard_drop_pressed) move(moveDown); break;
      case 'd': case 'ArrowRight': if(!hard_drop_pressed) move(moveRight); break;
      case ' ': moveToExpectedLoc(); break; // hard drop
      case 'q': case 'Shift': switchHold(); break; // hold
      case 'p': case 'Escape': togglePause(); // pause
    }
  }
})

window.requestAnimationFrame(step(0));