const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input.split('\n');
const test = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`.split('\n');

const inverse = bits => bits.map(b => b == 1 ? 0 : 1);
const toNumber = bits => parseInt(bits.join(''), 2);
const calc = (inputData) => {
  const sum = inputData.reduce((acc, line) => {
      for (let i=0; i< line.length; i++) {
        acc[i] += (line[i] == '0' ? -1 : +1);
      }
      return acc;
    }, Array(inputData[0].length).fill(0))
    .map(d => d > 0 ? 1 : 0);
  return toNumber(sum) * toNumber(inverse(sum));
}

const filter = (inputData, index, priority) => {
  const partitioned = inputData.reduce((acc, line) => {
    acc[line[index]].push(line);
    return acc;
  },[[], []]);

  if (partitioned[0].length == partitioned[1].length) {
    return partitioned[priority];
  }
  if (priority) {
    return partitioned[0].length > partitioned[1].length ? partitioned[0] : partitioned[1];
  } else 
    return partitioned[0].length < partitioned[1].length ? partitioned[0] : partitioned[1];
}

const getRating = (inputData, priority) => {
  let rating = inputData;
  let index = 0;
  while (rating.length > 1) {
    rating = filter(rating, index, priority);
    index++;
  }
  return rating;
}

const calc2 = (inputData) => {
  const O2Rating = getRating(inputData, 1);
  const CO2Rating = getRating(inputData, 0);

  return toNumber(O2Rating) * toNumber(CO2Rating)
}

console.log('part 1:', calc(test))
console.log('part 1:', calc(data))

console.log()
console.log('part 2(test):', calc2(test))
console.log('part 2:', calc2(data))