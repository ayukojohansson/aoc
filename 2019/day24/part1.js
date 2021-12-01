
/*

The image you received is 25 pixels wide and 6 pixels tall.

To make sure the image wasn't corrupted during transmission, the Elves would like you to find the layer that contains the fewest 0 digits. On that layer, what is the number of 1 digits multiplied by the number of 2 digits?
*/

const logger = {
  log: (...args) => console.log('INFO:', ...args),
  error: (...args) => console.log('\x1b[41m', 'ERROR:', ...args, "\x1b[0m"),
  result: (...args) => console.log('\x1b[32m', 'RESULT:', ...args, "\x1b[0m"),
  debug: (...args) => process.env.debug == 'true' && console.log('DEBUG:',...args),
};

const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const parseInput = txt => txt.split('\n').flatMap( l => l.split(''));


const WIDTH = 5;
const test = `....#
#..#.
#..##
..#..
#....`;

const countBugs = (pos, m) => [
  pos - WIDTH,
  pos % WIDTH == 0 ? undefined : pos - 1,
  pos % WIDTH == 4 ? undefined : pos + 1,
  pos+WIDTH,
].reduce((c, p) => {
//  console.log('count bugs', pos, p, m[p], c);
  return m[p] == '#' ? c + 1 : c;
}, 0)

const updateMap = currentMap => currentMap.map((b, i, m) => {
  const count = countBugs(i, m);
//  console.log(i, b, count)
  if (b == '#' && count !== 1) {
    return '.';
  } else if (b == '.' && (count == 1 || count == 2)) {
    return '#';
  }
  return b;
});

const map = parseInput(input);

let newMap = map;
const getHash = m => m.join('');
let hashTable = { [getHash(map)]: true };
while (true) {
  newMap = updateMap(newMap)
  const h = getHash(newMap);
  if (hashTable[h]) {
    break;
  } else
    hashTable[h] = true;
};
const getValue = m => m.reduce((s, p, i) => {
  return p == '.' ? s : s + Math.pow(2, i);
}, 0)
console.log(newMap)
console.log(getValue(newMap))
//console.log(countBugs(0, map))
