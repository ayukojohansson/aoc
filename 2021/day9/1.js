const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input;
const test = `2199943210
3987894921
9856789892
8767896789
9899965678`;

const getCheckpoints = (x, y, lines) => {
  return [
    lines[y-1]?.[x] || 100,
    lines[y+1]?.[x] || 100,
    lines[y]?.[x-1] || 100,
    lines[y]?.[x+1] || 100,
  ]
}

const calc = (inputData) => {
  const lines = inputData.split('\n');
  const maxX = lines[0].length;
  const maxY = lines.length;
  
  return lines.reduce((sum, line, y) => {
    for (let x =0; x< maxX; x++) {
      const isLowest = getCheckpoints(x, y, lines).every(p => p > line[x]);
      if (isLowest) sum += +line[x] +1;
    }
    return sum;
  }, 0);
}

const calc2 = (inputData) => {
  const lines = inputData.split('\n');
  const maxX = lines[0].length;
  const maxY = lines.length;
  const basinMap = {};
  let nextColor = 1;
  const colorMap = {};

  lines.forEach((line, y) => {
    for (let x =0; x< maxX; x++) {
      const left = basinMap[`${x-1},${y}`];
      const up = basinMap[`${x},${y-1}`];

      if (line[x] == 9) {
        basinMap[`${x},${y}`] = 0;
      } else if (!left && !up) {
        basinMap[`${x},${y}`] = nextColor;
        colorMap[nextColor] = [`${x},${y}`];
        nextColor++;
      } else if (left) {
        basinMap[`${x},${y}`] = left;
        colorMap[left].push(`${x},${y}`);
 
        // repaint with color of up
        if (up && left !== up) {
          colorMap[left].forEach(point => {
            basinMap[point] = up;
          })
          colorMap[up].push(...colorMap[left])
          colorMap[left] = [];
        }
      } else if (up) {
        basinMap[`${x},${y}`] = up;
        colorMap[up].push(`${x},${y}`);
      }
    }
  });

  return Object.values(colorMap)
    .map(x => x.length)
    .sort((a,b) => b-a)
    .slice(0,3)
    .reduce((a,b) => a*b)
}

console.log('part 1:', calc(test))
console.log('part 1:', calc(data))

console.log('\npart 2:', calc2(test))
console.log('part 2:', calc2(data))

