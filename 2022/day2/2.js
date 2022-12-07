const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `A Y
B X
C Z`;

const getScore = ([a, b]) => {
  let base = 0, score = 0;
  
  switch (b) {
    case 'X':
      //lose
      score = 0;
      break;
    case 'Y':
      //draw
      score = 3;
      break;
    case 'Z':
      //win
      score = 6;
      break;
  }
  switch (a) {
    case 'A':
      if (b=='Z') base = 2;
      if (b=='Y') base = 1;
      if (b=='X') base = 3;
      break;
    case 'B':
      if (b=='Z') base = 3;
      if (b=='Y') base = 2;
      if (b=='X') base = 1;
      break;
    case 'C':
      if (b=='Z') base = 1;
      if (b=='Y') base = 3;
      if (b=='X') base = 2;
      break;
  }
  return base + score
}

const main = (str) => {
  const series = str.split('\n');
  return series.reduce((sum, s) => {
    return sum + getScore(s.split(' '));
  }, 0);
}

console.log(main(test));
console.log(main(input));
