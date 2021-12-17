const testData = 'target area: x=20..30, y=-10..-5';
const data = 'target area: x=201..230, y=-99..-65';

const calc = (inputData) => {
  const [_, x1,x2,y1,y2] = inputData.match(/(-?\d+)\.{2}(-?\d+).*=(-?\d+)\.{2}(-?\d+)/);
  const minX = Math.min(x1,x2);
  const maxX = Math.max(x1,x2);
  const minY = Math.min(y1,y2);
  const maxY = Math.max(y1,y2);

  const isHit = (vx, vy) => {
    let highest = minY;
    let step = 0;
    let [x, y] = [0,0];
    while (true) {
      x = x + Math.max(vx - step, 0);
      y = y + vy - step;
      if (highest < y) highest = y;
      if (x > maxX) {
        return 'TOO_STRONG';
      } else if (y < minY) {
        return 'TOO_WEAK';
      } else if (y <= maxY && x >= minX) {
        return highest;
      }

      step++;
    }
  };

  let history = {};
  // find minvx and maxvx vy=0
  let minVx = 0;
  while (true) {
    const res = isHit(minVx, 0);
    if (res == 'TOO_WEAK') {
      minVx++;
    } else if (res == 'TOO_STRONG') {
      console.log('too strong?')
      break;
    } else {
      minVx--;
      console.log('min VX is', minVx)
      break;
    }
  }
  let maxVx = maxX;
  let maxVy = Math.abs(maxY*2);

  for (let vx=minVx; vx <= maxVx; vx++) {
    let minVy = minY;
    while (true) {
      if (minVy > maxVy) {
        break;
      }
      const res = isHit(vx, minVy);
      if (res == 'TOO_STRONG') {
        break;
      } else if (res == 'TOO_WEAK') {
      
      } else {
        history[`${vx},${minVy}`] = res;
      }
      minVy++;
    }
  }
  
  console.log('max height is', Object.keys(history).reduce((max, key) => {
    if (max[0] < history[key]) {
      return [history[key], key];
    } else return max;
  }, [-100000]))

  console.log('history size', Object.keys(history).length)

  return;
}


console.log('part 1 (test):', calc(testData))
console.log('part 1:', calc(data))

//console.log('part 2:', calc(data))

