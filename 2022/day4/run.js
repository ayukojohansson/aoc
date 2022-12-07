const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

const main1 = (str) => {
  const lines = str.split('\n');
  return lines.reduce((hit, line) => {
    const [a1, a2, b1, b2] = line.split(/[,-]/).map(d=>parseInt(d,10))
    
    return (a1 <= b1 && a2 >= b2) || (a1 >= b1 && a2 <= b2) ? hit+1 : hit;
  }, 0);
}
const main2 = (str) => {
  const lines = str.split('\n');
  return lines.reduce((hit, line) => {
    const [a1, a2, b1, b2] = line.split(/[,-]/).map(d=>parseInt(d,10))
    
    return (a1 < b1 && a2 < b1) || (a1 > b2 && a2 > b2) ? hit : hit+1;
  }, 0);
}

console.log(main1(input));
console.log(main2(input));

