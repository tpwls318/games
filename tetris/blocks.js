// pivot point rotation clockwise
const rotatePoint = ({ dx, dy }) => ({ dx: -dy, dy: dx });
const rotateDiff = rel_poss => rel_poss.map(rel_pos => rotatePoint(rel_pos));
const blocksMap = new Map();
const applyRotate = (pp, rel_poss) => rel_poss.map(rel_pos => ({ x: pp.x + rel_pos.dx, y: pp.y + rel_pos.dy }));
const colors = {
  'L': '#FF8B38',
  'I': '#FFE739',
  'J': '#8DFAFF',
  'O': '#00AF8D',
  'S': '#CE4141',
  'T': '#7C4EC6',
  'Z': '#8ACC0D',
  'wall': '#636363',
  'background': '#383838',
}
blocksMap.set('J', {
  pivot: 2,
  start: [{ x: 5, y: 2 }, { x: 6, y: 2 }, { x: 6, y: 1 }, { x: 6, y: 0 }],
  rel_poss: [{ dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 0, dy: 0 }, { dx: 0, dy: -1 }],
  color: colors['J'],
}).set('I', {
  pivot: 1,
  start: [{ x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 }, { x: 6, y: 0 }],
  rel_poss: [{ dx: 0, dy: 1 }, { dx: 0, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: -2 }],
  color: colors['I'],
}).set('L', {
  pivot: 1,
  start: [{ x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 6, y: 2 }],
  rel_poss: [{ dx: 0, dy: -1 }, { dx: 0, dy: 0 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }],
  color: colors['L'],
}).set('O', {
  pivot: null,
  start: [{ x: 5, y: 1 }, { x: 6, y: 1 }, { x: 5, y: 0 }, { x: 6, y: 0 }],
  rel_poss: null,
  color: colors['O'],
}).set('S', {
  pivot: 2,
  start: [{ x: 5, y: 1 }, { x: 6, y: 1 }, { x: 6, y: 0 }, { x: 7, y: 0 }],
  rel_poss: [{ dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 0, dy: 0 }, { dx: 1, dy: 0 }],
  color: colors['S'],
}).set('T', {
  pivot: 1,
  start: [{ x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 6, y: 0 }],
  rel_poss: [{ dx: -1, dy: 0 }, { dx: 0, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }],
  color: colors['T'],
}).set('Z', {
  pivot: 1,
  start: [{ x: 5, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 7, y: 1 }],
  rel_poss: [{ dx: -1, dy: 0 }, { dx: 0, dy: 0 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }],
  color: colors['Z'],
})