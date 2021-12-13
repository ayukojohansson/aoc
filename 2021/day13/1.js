const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input;
const test = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;

const calc = (inputData, isPart2) => {
  const [lines, folds] = inputData.split('\n\n');
  
  const dots = lines.split('\n').reduce((acc, line) => {
    const [x,y] = line.split(',');
    acc.add(`${x},${y}`);
    return acc;
  }, new Set());
  const instructions = folds.split('\n');

  let i = 0;
  while (i < instructions.length) {
    const xFold = +instructions[i].split('fold along x=')[1];
    const yFold = +instructions[i].split('fold along y=')[1];

    dots.forEach(dot => {
      const [x,y] = dot.split(',');
      if (xFold && x > xFold) {
        dots.add(`${xFold - x + xFold},${y}`)
        dots.delete(dot);
      }
      if (yFold && y > yFold) {
        dots.add(`${x},${yFold - y + yFold}`)
        dots.delete(dot);
      }
    })
    if (!isPart2) return dots.size;
    i++;
  }

  for (let y=0; y< 20; y++) {
    console.log(Array(100).fill(0).map((_,x) => dots.has(`${x},${y}`) ? '@' : ' ').join(''));
  }
  
  return dots.size;
}


console.log('part 1:', calc(test))
console.log('part 1:', calc(data))

console.log('\npart 2:', calc(test, true))
console.log('part 2:', calc(data, true))

