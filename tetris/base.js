const mapGetRan = map => {
  const iterator = map.values();
  let i = Math.floor(Math.random() * map.size);
  while(i--) iterator.next();
  return iterator.next().value;
};
