// pivot point rotation clockwise
const rotatePoint = ({ dx, dy }) => ({ dx: -dy, dy: dx });
const rotateDiff = rel_poss => rel_poss.map(rel_pos => rotatePoint(rel_pos));
const blocksMap = new Map();
const applyRotate = (pp, rel_poss) => rel_poss.map(rel_pos => ({ x: pp.x + rel_pos.dx, y: pp.y + rel_pos.dy }));
// TODO: I, L, O, S, T, Z shapes
blocksMap.set('J', {
  pivot: 2,
  start: [{ x: 4, y: -1 }, { x: 5, y: -1 }, { x: 5, y: -2 }, { x: 5, y: -3 }],
  rel_poss: [{ dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 0, dy: 0 }, { dx: 0, dy: -1 }],
});