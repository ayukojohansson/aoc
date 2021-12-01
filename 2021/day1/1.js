const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input.split('\n').map(d => parseInt(d,10));
const test = [
  199,
  200,
  208,
  210,
  200,
  207,
  240,
  269,
  260,
  263
]

const calc = (inputData, offset=1) => {
  let increase = 0;

  for (let i=0; i < inputData.length-offset; i++) {
    if (inputData[i] < inputData[i+offset]) increase++;
  }
  return increase;
}

console.log('part 1:', calc(test))
console.log('part 1:', calc(data))

console.log()
console.log('part 2(test):', calc(test, 3))
console.log('part 2:', calc(data, 3))