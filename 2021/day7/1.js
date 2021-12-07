const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input;
const test = `16,1,2,0,4,2,7,1,2,14`;

const getCost = (crabs, offset, weighted) => {
  return crabs.reduce((sum, crab) => {
    const distance = Math.abs(crab - offset);
    const weight = weighted ? (distance + 1) / 2 : 1;
    return sum + distance * weight;
  }, 0);
};

const calc = (inputData, weighted = false) => {
  const crabs = inputData.split(',').map(d => parseInt(d,10));
  const h_min = Math.min(...crabs);
  const h_max = Math.max(...crabs);
  
  let offset = h_min, lowestCost;
  while (offset <= h_max) {
    const cost = getCost(crabs, offset, weighted);
    if (!lowestCost || lowestCost > cost) {
      lowestCost = cost;
    }
    offset++;
  }
  return lowestCost;
}

console.log('part 1:', calc(test))
console.log('part 1:', calc(data))

console.log('\npart 2:', calc(test, true))
console.log('part 2:', calc(data, true))
