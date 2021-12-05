const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input.split('\n');
const test = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`.split('\n');

const calc = (inputData, includeDiagonal=false) => {
  const result = inputData.reduce((canvas, segments) => {
    const [x1,y1,x2,y2] = segments.split(/,|\s->\s/).map(d => parseInt(d, 10));

    const vectorX = (x2-x1)/Math.abs(x2-x1) || 0;
    const vectorY = (y2-y1)/Math.abs(y2-y1) || 0;
    if (vectorX && vectorY && !(includeDiagonal && Math.abs(x2-x1) == Math.abs(y2-y1))) {
      console.log('    not counting', segments);
      return canvas;
    }

    const end = vectorX*(x2-x1) || vectorY*(y2-y1);
    for (i=0; i<=end; i++) {
      const x = vectorX * i + x1;
      const y = vectorY * i + y1;
      canvas[`${x},${y}`] = (canvas[`${x},${y}`] || 0) + 1;
    }
    return canvas;
  }, {});

  return Object.keys(result).reduce((point, key) => {
    return result[key] >=2 ? point +1 : point;
  },0)
}

console.log('part 1:', calc(test))
console.log('part 1:', calc(data))

console.log('\npart 2:', calc(test, true))
console.log('part 2:', calc(data, true))
