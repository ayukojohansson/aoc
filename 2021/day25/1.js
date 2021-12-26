const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');
const testData = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`;


const calc = (inputData) => {
  let right = new Set();
  let down = new Set();
  const lines = inputData.split('\n');
  const width = lines[0].length;
  const height = lines.length;
  
  lines.forEach((line, y) => line.split('').forEach((c,x) => {
    if (c == '>') right.add(x + y*width)
    if (c == 'v') down.add(x + y*width)
  }));

  const move = () => {
    let count = 0;
    const newR = new Set();
    const newD = new Set();
    right.forEach(c => {
      const x = c % width;
      const next = x == width -1 ? c-width +1 : c+1;
      if (right.has(next) || down.has(next)) {
        newR.add(c);
      } else {
        newR.add(next);
        count++;
      }
    })
    down.forEach(c => {
      const y = parseInt(c / width);
      const next = y == height -1 ? c-width*y : c+width;
      if (newR.has(next) || down.has(next)) {
        newD.add(c);
      } else {
        newD.add(next);
        count++;
      }
    })
    right = newR;
    down = newD;
    return count;
  }

  let step = 1;
  while (move() > 0) {
    step++;
    console.log(step);
  }

  return step;
  
}

console.log('part 1 (test):', calc(testData))
console.log('part 1:', calc(input))


