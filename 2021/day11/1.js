const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input;
const test = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

const calc = (inputData, condition) => {
  const lines = inputData.split('\n');
  const octpus = lines.map(l => l.split('').map(d => parseInt(d,10)))
  let flashed = [];
  let sum = 0;
  let loop = 0;
  
  const increase = (x,y) => {
    if (octpus[y]?.[x] == undefined ) return;

    octpus[y][x]++;
    if (octpus[y][x] == 10) flashed.push([x,y]);
  }

  while (condition(loop, flashed.length)) {
    let nextFlash = 0
    flashed = [];

    octpus.forEach((line, y) => line.forEach((d,x) => {
      increase(x,y);
    }));

    while(flashed[nextFlash]) {
      const [x,y] = flashed[nextFlash];
      increase(x-1,y-1);
      increase(x,y-1);
      increase(x+1,y-1);
    
      increase(x-1,y);
      increase(x+1,y);
    
      increase(x-1,y+1);
      increase(x,y+1);
      increase(x+1,y+1);

      nextFlash++;
    }
    
    flashed.forEach(([x,y]) => octpus[y][x] = 0);
    sum += flashed.length;
    loop++;
  }
  return [loop, sum]
}


console.log('part 1:', calc(test, (loop, length) => (loop < 100)))
console.log('part 1:', calc(data, (loop, length) => (loop < 100)))

console.log('\npart 2:', calc(test, (loop, length) => (length != 100)))
console.log('part 2:', calc(data, (loop, length) => (length != 100)))

