const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input;
const test = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

const calc = (inputData, isPart2) => {
  const lines = inputData.split('\n');
  const paths = lines.reduce((acc, line) => {
    const [a, b] = line.split('-');
    if (a == 'start') {
      acc[a] = [...(acc[a] || []), b];
    } else if (b == 'start') {
      acc[b] = [...(acc[b] || []), a];
    } else {
      acc[a] = [...(acc[a] || []), b];
      acc[b] = [...(acc[b] || []), a];
    }
    return acc;
  }, {});

  const route = [];
  const toCheck = [['start']];
  while (toCheck.length) {
    const current = toCheck.pop();
    const possible = paths[current[current.length -1]];
    possible.forEach(p => {
      if (p == 'end') {
        route.push(current);
      } else if (p == p.toLowerCase()) {
        if (!current.includes(p)) toCheck.push([...current, p]);
        else if (isPart2 && current[0] !== 'NO_MORE_SMALL') toCheck.push(['NO_MORE_SMALL', ...current, p]);
      } else {
        toCheck.push([...current, p])
      }
    });
  }
  return route.length;
}


console.log('part 1:', calc(test))
console.log('part 1:', calc(data))

console.log('\npart 2:', calc(test, true))
console.log('part 2:', calc(data, true))

