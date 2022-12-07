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
  return sacks.reduce((pakets, sack) => {
    const pSet = sack.slice(0,sack.length/2).split('').reduce((p,s)=> {
      p.add(s);
      return p;
    }, new Set());
    const duplicate = sack.slice(sack.length/2).split('').find(s=> pSet.has(s));
    const prio = duplicate.toLowerCase() == duplicate
    ? duplicate.charCodeAt(0) - 96
    : duplicate.charCodeAt(0) - 64 + 26
    
    console.log(duplicate, prio)
    return pakets + prio;
  }, 0);
}

console.log(main1(test));
console.log(main1(input));
console.log('a'.charCodeAt(0), 'A'.charCodeAt(0))
