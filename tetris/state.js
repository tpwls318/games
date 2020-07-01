let state = {};
const setState = changes => state = ({ ...state, ...changes });
let status = {
  score: 0,
  hold: null,
  line: 0,
  level: 0,
};
const setStatus = changes => status = ({ ...status, ...changes });