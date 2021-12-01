
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
const test1 = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;
const test2 = `<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`;


const formatInput = input =>
  input.split('\n')
    .map(line =>
      line.match(/-?\d+/g)
        .map(Number)
        );

const check = (p, m, g) => {
  if (p == m) return g;
  if (p < m ) return g+1;
  if (p > m ) return g-1;
}

//const getSum = (arr) => arr ? arr.map(Math.abs).reduce((sum, value) => (sum + value)) : 0; 
//const getEnergy = (p, v) => {
//  return getSum(p) * getSum(v);
//}
//
//const getTotalEnergy = () => getSum(positions.map((pos, i) => getEnergy(pos, velocitys[i])));

const main = (index) => {
  const calculateGravity = (px, velo) => positions.reduce((gx, mx, i) => {
    return check(px,mx,gx)
  }, velo);

  const updateVelocity = () => {
    positions.forEach((pos, i) => {
      velocitys[i] = calculateGravity(pos, velocitys[i]);
    })
  }
  const moveOne = (pos, v) => (pos + v);
  const move = () => {
    positions.forEach((pos, i) => {
      positions[i] = moveOne(pos, velocitys[i]);
    });
  }

  const positions = originalPositions.map(pos => pos[index]);
  const velocitys = Array(positions.length).fill(0);

    console.log('pos', positions)
    console.log('vel', velocitys)
  const initial = positions.slice(0).join(',');
  const isNotBack = x => (x.join(',') !== initial);
  let currentStep = 1;
  do {
    currentStep++;
    updateVelocity();
    move();
  } while (isNotBack(positions));
  
  console.log('after step', currentStep)
  console.log('pos', positions)
  console.log('vel', velocitys)

  return currentStep;
}

const findMatch = (x,y) => {
  const max = x > y ? x : y;
  let min = x > y ? y :x;
  let res = max;
  while (res % min) {
    res += max;
  }
  return res;
}

const originalPositions = formatInput(input);

const intervalX = main(0);
const intervalY = main(1);
const intervalZ = main(2);

console.log(findMatch(intervalX,findMatch(intervalY,intervalZ)));

