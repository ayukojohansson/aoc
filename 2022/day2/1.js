const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `A Y
B X
C Z`;

const getScore = ([a, b]) => {
  let base = 0, score = 0;
  
  switch (b) {
    case 'X':
      base = 1;
      break;
    case 'Y':
      base = 2;
      break;
    case 'Z':
      base = 3;
      break;
  }
  switch (a) {
    case 'A':
      if (b=='Y') score = 6;
      if (b=='X') score = 3;
      break;
    case 'B':
      if (b=='Z') score = 6;
      if (b=='Y') score = 3;
      break;
    case 'C':
      if (b=='X') score = 6;
      if (b=='Z') score = 3;
      break;
  }
  return base + score
}

const main1 = (str) => {
  const series = str.split('\n');
  return series.reduce((sum, s) => {
    return sum + getScore(s.split(' '));
  }, 0);
}

console.log(main1(test));
console.log(main1(input));
