const spec = funcs => map => {
  let k, iterator = map.keys();
  while(k = iterator.next().value){
    map.set(k, funcs[k](map));
  }
  return map;
}
const objToMap = obj => new Map(Object.entries(obj));
const mapGetRan = map => {
  const iterator = map.values();
  let i = Math.floor(Math.random() * map.size);
  while(i--) iterator.next();
  return iterator.next().value;
};
