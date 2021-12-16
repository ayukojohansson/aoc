const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input;
const test = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

const around = (pos) => {
  const [x,y] = pos.split(',');
  return [
    `${+x-1},${+y}`,
    `${+x+1},${+y}`,
    `${+x},${+y-1}`,
    `${+x},${+y+1}`
  ];
};

// Optimal risk, assume all risk is 1
const lowestRisk = (pos, size) => {
  const [x,y] = pos.split(',');
  return size - x - 1 + size - y - 1;
}

const findMinimalRisk = (riskMap, size) => {
  const minRisk = { '0,0': 0 };
  const goal = `${size-1},${size-1}`;
  let toCheck = [['0,0', lowestRisk('0,0', size)]];

  while (toCheck.length)  {
    toCheck = toCheck.sort((a,b) => b[1] - a[1]);
    const [current] = toCheck.pop();

    if (current == goal) {
      return minRisk[goal];
    }

    around(current).forEach((xy) => {
      const risk = riskMap[xy];
      if (risk !== undefined) {
        const nextRisk = minRisk[current] + risk;
        if (minRisk[xy] == undefined || minRisk[xy] > nextRisk) {
          minRisk[xy] = nextRisk;
          toCheck.push([xy, minRisk[xy] + lowestRisk(xy, size)]);
        }
      }
    });
  }
}

const calc = (inputData, size) => {
  const riskMap = inputData.split('\n').reduce((acc, line, y) => {
    line.split('').forEach((d, x) => { acc[`${x},${y}`] = +d; });
    return acc;
  }, {});

  return findMinimalRisk(riskMap, size);
}

const calc2 = (inputData, size) => {
  const riskMap = inputData.split('\n').reduce((acc, line, y) => {
    line.split('').forEach((d, x) => {
      let risk = +d
      acc[`${x},${y}`] = risk;

      risk = risk % 9 + 1;
      [`${x+1*size},${y}`, `${x},${y+1*size}`].forEach(p => acc[p] = risk);
      risk = risk % 9 + 1;
      [`${x+2*size},${y}`, `${x+1*size},${y+1*size}`, `${x},${y+2*size}`].forEach(p => acc[p] = risk);
      risk = risk % 9 + 1;
      [`${x+3*size},${y}`, `${x+2*size},${y+1*size}`, `${x+1*size},${y+2*size}`, `${x},${y+3*size}`].forEach(p => acc[p] = risk);
      risk = risk % 9 + 1;
      [`${x+4*size},${y}`, `${x+3*size},${y+1*size}`, `${x+2*size},${y+2*size}`, `${x+1*size},${y+3*size}`, `${x},${y+4*size}`].forEach(p => acc[p] = risk);
      risk = risk % 9 + 1;
      [`${x+4*size},${y+1*size}`, `${x+3*size},${y+2*size}`, `${x+2*size},${y+3*size}`, `${x+1*size},${y+4*size}`].forEach(p => acc[p] = risk);
      risk = risk % 9 + 1;
      [`${x+4*size},${y+2*size}`,`${x+3*size},${y+3*size}`, `${x+2*size},${y+4*size}`].forEach(p => acc[p] = risk);
      risk = risk % 9 + 1;
      [`${x+4*size},${y+3*size}`, `${x+3*size},${y+4*size}`].forEach(p => acc[p] = risk);
      risk = risk % 9 + 1;
      [`${x+4*size},${y+4*size}`].forEach(p => acc[p] = risk);
    });
    return acc;
  }, {});

  return findMinimalRisk(riskMap, size*5);
}


console.log('part 1:', calc(test, 10))
console.log('part 1:', calc(data, 100))

console.log('\npart 2:', calc2(test, 10))
console.log('part 2:', calc2(data, 100))

