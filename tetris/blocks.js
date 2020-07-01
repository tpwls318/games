// pivot point rotation clockwise
const rotatePoint = ({ dx, dy }) => ({ dx: -dy, dy: dx });
const rotateDiff = rel_poss => rel_poss.map(rel_pos => rotatePoint(rel_pos));
const blocksMap = new Map();
const holdBlocks = new Map();
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
  name: 'J',
  pivot: 2,
  start: [{ x: 5, y: 2 }, { x: 6, y: 2 }, { x: 6, y: 1 }, { x: 6, y: 0 }],
  rel_poss: [{ dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 0, dy: 0 }, { dx: 0, dy: -1 }],
  color: colors['J'],
}).set('I', {
  name: 'I',
  pivot: 1,
  start: [{ x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 }, { x: 6, y: 0 }],
  rel_poss: [{ dx: 0, dy: 1 }, { dx: 0, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: -2 }],
  color: colors['I'],
}).set('L', {
  name: 'L',
  pivot: 1,
  start: [{ x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 6, y: 2 }],
  rel_poss: [{ dx: 0, dy: -1 }, { dx: 0, dy: 0 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }],
  color: colors['L'],
}).set('O', {
  name: 'O',
  pivot: null,
  start: [{ x: 5, y: 1 }, { x: 6, y: 1 }, { x: 5, y: 0 }, { x: 6, y: 0 }],
  rel_poss: null,
  color: colors['O'],
}).set('S', {
  name: 'S',
  pivot: 2,
  start: [{ x: 5, y: 1 }, { x: 6, y: 1 }, { x: 6, y: 0 }, { x: 7, y: 0 }],
  rel_poss: [{ dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 0, dy: 0 }, { dx: 1, dy: 0 }],
  color: colors['S'],
}).set('T', {
  name: 'T',
  pivot: 1,
  start: [{ x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 6, y: 0 }],
  rel_poss: [{ dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }, { dx: 0, dy: 0 }],
  color: colors['T'],
}).set('Z', {
  name: 'Z',
  pivot: 1,
  start: [{ x: 5, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 7, y: 1 }],
  rel_poss: [{ dx: -1, dy: 0 }, { dx: 0, dy: 0 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }],
  color: colors['Z'],
})

const block_row_length = 7;
const block_col_length = 7;
const [w, h] = [block_row_length, block_col_length];
const a = (block_name, { x, y }) =>
blocksMap.get(block_name).rel_poss.map(({dx, dy}) => ({ x: x + dx, y: y + dy + 0.7 }));
holdBlocks.set('J', {
  positions: a('J',  { x: (w - 2) / 2 + 1, y: (h - 3) / 2 + 1 }),
}).set('I', {
  positions: a('I',  { x: (w - 1) / 2, y: (h - 4) / 2 + 2 }),
}).set('L', {
  positions: a('L',  { x: (w - 2) / 2, y: (h - 3) / 2 + 1 }),
}).set('O', {
  positions: [
    { x: (w - 2) / 2, y: (h - 2) / 2 }, { x: (w - 2) / 2 + 1, y: (h - 2) / 2 },
    { x: (w - 2) / 2, y: (h - 2) / 2 + 1 }, { x: (w - 2) / 2 + 1, y: (h - 2) / 2 + 1 }
  ],
}).set('S', {
  positions: a('S',  { x: (w - 3) / 2 + 1, y: (h - 2) / 2 }),
}).set('T', {
  positions: a('T',  { x: (w - 3) / 2 + 1, y: (h - 2) / 2 }),
}).set('Z', {
  positions: a('Z',  { x: (w - 3) / 2 + 1, y: (h - 2) / 2 }),
})