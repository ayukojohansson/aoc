
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
#.?##
..#..
#....`;

const getCount = (l, pos, m) => {
  return (m[l] && m[l][pos] == '#' ) ? 1 : 0;
}
const getCounts = (l, arr, m) => {
  return arr.reduce((sum, p) => sum + getCount(l,p,m), 0)
}

const countBugs = (pos, l, m) => {
  switch (pos) {
    case 7:
    case 11:
    case 13:
    case 17:
      return [
        pos == 17 ? getCounts(l+1, [20,21,22,23,24], m) : getCount(l, pos - WIDTH, m),
        pos == 13 ? getCounts(l+1, [4,9,14,19,24], m) : getCount(l, pos - 1, m),
        pos == 11 ? getCounts(l+1, [0,5,10,15,20], m) : getCount(l, pos + 1, m),
        pos == 7 ? getCounts(l+1, [0,1,2,3,4], m) : getCount(l, pos + WIDTH, m),
      ].reduce((c, p) => {
    //  console.log('count bugs', pos, p, m[p], c);
        return c + p;
      }, 0);
    default:
      return [
        pos < WIDTH ? getCount(l-1, 7, m) : getCount(l, pos - WIDTH, m),
        pos % WIDTH == 0 ? getCount(l-1, 11, m) : getCount(l, pos - 1, m),
        pos % WIDTH == 4 ? getCount(l-1, 13, m) : getCount(l, pos + 1, m),
        pos + WIDTH >= 25 ? getCount(l-1, 17, m) : getCount(l, pos + WIDTH, m),
      ].reduce((c, p, a, b) => {
        if (pos == 20) console.log(l, b)
        return c + p;
      }, 0);
  }
}

const updateMap = currentMap => {
  let res = {};
  Object.keys(currentMap)
    .forEach(level => {
      const newLevelMap = currentMap[level].map((b, i) => {
        if (i == 12) return '?';
        const count = countBugs(i, Number(level), currentMap);
//        console.log(level, i, b, count)
        if (b == '#' && count !== 1) {
          return '.';
        } else if (b == '.' && (count == 1 || count == 2)) {
          return '#';
        }
        return b;
      });
      res[level] = newLevelMap;
  });
  return res;
};

const map = parseInput(input);
let recursiveMap = { 0: map };
const limit = 200;
let step = 0;
const pretty = m => {
  Object.keys(m).sort().map(l => {
    console.log('\nlevel', l);
    console.log(m[l].join('').slice(0,5));
    console.log(m[l].join('').slice(5,10));
    console.log(m[l].join('').slice(10,15));
    console.log(m[l].join('').slice(15,20));
    console.log(m[l].join('').slice(20,25));
  })
}
while (step < limit) {
  if (step % 2 == 0) {
    recursiveMap[step/2 + 1] = Array(25).fill('.');
    recursiveMap[- (step/2 + 1)] = Array(25).fill('.');
  }
  recursiveMap = updateMap(recursiveMap)
  pretty(recursiveMap);
  step++;
};

const total = map => map.join('').replace(/\.|\?/g, '').length;
console.log(
  Object.values(recursiveMap).reduce((sum, m) => {
    console.log(total(m), m)
    return sum + total(m);
  }, 0)
);

