
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
const test = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;


const formatInput = input =>
  input.split('\n')
    .map(line =>
      line.match(/-?\d+/g)
        .map(Number)
        );

const positions = formatInput(input);
const velocitys = Array(positions.length);

const applyG = (p, m, g) => {
  if (p == m) return g;
  if (p < m ) return g+1;
  if (p > m ) return g-1;
}
const calculateGravity = ([px,py,pz], velo = [0,0,0]) => positions.reduce(([gx,gy,gz], [mx,my,mz], i) => {
  return [
    applyG(px,mx,gx),
    applyG(py,my,gy),
    applyG(pz,mz,gz),
  ]
}, velo);

const updateVelocity = () => {
  positions.forEach((pos, i) => {
    velocitys[i] = calculateGravity(pos, velocitys[i]);
  })
}
const moveOne = (pos, v) => ([
  pos[0] + v[0],
  pos[1] + v[1],
  pos[2] + v[2],
]);
const move = () => {
  positions.forEach((pos, i) => {
    positions[i] = moveOne(pos, velocitys[i]);
  });
}
const getSum = (arr) => arr ? arr.map(Math.abs).reduce((sum, value) => (sum + value)) : 0; 
const getEnergy = (p, v) => (getSum(p) * getSum(v));
const getTotalEnergy = () => getSum(positions.map((pos, i) => getEnergy(pos, velocitys[i])));

const main = (step) => {
  const [initialX, initialY, initialZ] = positions[1];
  let currentStep = 0;

  while (currentStep < step) {
    updateVelocity();
    move();
    currentStep++;
  }
  
  console.log('after step', currentStep)
  console.log('pos', positions)
  console.log('vel', velocitys)
  logger.result(
    getTotalEnergy()
  );
}

// no.0 = 186117

main(1000)
