const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input;
const test = `3,4,3,1,2`;

const calc = (inputData, timer=80) => {
  const data = inputData.split(',').map(d => parseInt(d,10));
  const fishes = data.reduce((schedule, fish) => {
    schedule[fish]++;
    return schedule;
  }, Array(7).fill(0));

  let now = 1;
  let newBorns = [0, 0];
  while (now <= timer) {
    const today = now % 7;
    const dayBefore = (today + 6) % 7;
    newBorns.push(fishes[dayBefore]);
    const newBorn = newBorns.shift();
    if (newBorn) {
      fishes[dayBefore] += newBorn;
    }
    now++;
  }
  return fishes.reduce((a,b) => a+b) + newBorns.reduce((a,b) => a+b)
}

console.log('part 1:', calc(test))
console.log('part 1:', calc(data))

console.log('\npart 2:', calc(test, 256))
console.log('part 2:', calc(data, 256))
