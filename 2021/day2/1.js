const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input.split('\n');
const test = `forward 5
down 5
forward 8
up 3
down 8
forward 2`.split('\n');


const calc = (inputData, aimed = false) => {
  let horizontal = 0, depth = 0, aimedDepth = 0;

  for (let i=0; i < inputData.length; i++) {
    const [command, step] = inputData[i].split(' ');
    const stepCount = parseInt(step, 10);

    switch (command) {
      case 'forward':
        horizontal += stepCount;
        aimedDepth += depth * stepCount;
        break;
      case 'down':
        depth += stepCount;
        break;
      case 'up':
        depth -= stepCount;
        break;
    }
  }
  return horizontal * (aimed ? aimedDepth : depth);
}

console.log('part 1:', calc(test))
console.log('part 1:', calc(data))

console.log()
console.log('part 2(test):', calc(test, true))
console.log('part 2:', calc(data, true))