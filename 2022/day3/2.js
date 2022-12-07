const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

const main1 = (str) => {
  const sacks = str.split('\n');
  let sum = 0;
  for (let i=0; i<=sacks.length-3; i=i+3) {
    
    let packets = new Set();
    sacks[i].split('').forEach(s=> packets.add(s));
    
    let duplicates = new Set(sacks[i+1].split('').filter(s => packets.has(s)));
    let duplicate = sacks[i+2].split('').find(s=>duplicates.has(s));
    
    
    const prio = duplicate.toLowerCase() == duplicate
    ? duplicate.charCodeAt(0) - 96
    : duplicate.charCodeAt(0) - 64 + 26
    
    console.log(duplicate, prio)
    sum += prio;
  };
  return sum
}

console.log(main1(test));
console.log(main1(input));
