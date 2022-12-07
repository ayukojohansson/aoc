const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const answer1 = input.split('\n\n').reduce((max, elf) => {
  const total = elf.split('\n').reduce((sum, d) => sum + parseInt(d, 10), 0);
  return (max < total) ? total : max;
}, 0);

console.log(answer1)

const answer2 = input.split('\n\n').reduce((all, elf) => {
  const total = elf.split('\n').reduce((sum, d) => sum+parseInt(d, 10), 0);
  all.push(total);
  return all;
}, []).sort((a, b)=> b-a).slice(0, 3).reduce((sum, cal) => sum + cal, 0);

console.log(answer2)

