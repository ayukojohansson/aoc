const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const monkeys = require('./monkeys.js');
const monkeys2 = require('./monkeys2.js');

const test = {
  0: {
    items: [79, 98],
    operation: old => old * 19,
    test: value => value % 23 == 0 ? 2 : 3,
  },
  1: {
    items: [54, 65, 75, 74],
    operation: old => old + 6,
    test: value => value % 19 == 0 ? 2 : 0,
  },
  2: {
    items: [79, 60, 97],
    operation: old => old * old,
    test: value => value % 13 == 0 ? 1 : 3,
  },
  3: {
  items: [74],
  operation: old => old + 3,
  test: value => value % 17 == 0 ? 0 : 1,
  }
}
const test2 = {
  0: {
    items: [79, 98],
    operation: old => old * 19n,
    test: value => value % 23n == 0n ? 2 : 3,
  },
  1: {
    items: [54, 65, 75, 74],
    operation: old => old + 6n,
    test: value => value % 19n == 0n ? 2 : 0,
  },
  2: {
    items: [79, 60, 97],
    operation: old => old * old,
    test: value => value % 13n == 0n ? 1 : 3,
  },
  3: {
  items: [74],
  operation: old => old + 3n,
  test: value => value % 17n == 0n ? 0 : 1,
  }
}

const main = (monkeys, end) => {
  let round = 1;
  while (round <= end) {
    Object.keys(monkeys).forEach(id => {
      const monkey = monkeys[id]
      monkey.items.forEach(item => {
        const newValue = parseInt(monkey.operation(item)/3, 10);
        const target = monkey.test(newValue);
        monkeys[target].items.push(newValue);
      })
      monkey.total = (monkey.total || 0) + monkey.items.length;
      monkey.items = [];
    })
    round++;
  }
  const total = Object.values(monkeys).map(m => m.total).sort((a,b)=> b-a)
  const part1 = total[0]*total[1];
  console.log(total)
  console.log(part1)
}

const main2 = (monkeys, end, common) => {
  let round = 1;
  while (round <= end) {
    if (round%1000==0) {
      console.log(Object.values(monkeys).map(m => m.total).join('\t'))
      console.log(Object.values(monkeys).map(m => m.items))
    }
    Object.keys(monkeys).forEach(id => {
      const monkey = monkeys[id]
      monkey.items.forEach(item => {
        const newValue = monkey.operation(BigInt(item))%common;
        const target = monkey.test(newValue);
        monkeys[target].items.push(newValue);
      })
      monkey.total = (monkey.total || 0) + monkey.items.length;
      monkey.items = [];
    })
    round++;
//    console.log(Object.values(monkeys).map(m => m.items))
  }
  const total = Object.values(monkeys).map(m => m.total).sort((a,b)=> b-a)
  const part1 = total[0]*total[1];
  console.log(total)
  console.log(part1)
}

//main(test, 20)
//main(monkeys, 20)

main2(test2, 10000, BigInt(13*17*19*23))
main2(monkeys2, 10000, BigInt(11*19*7*17*3*5*13*2))
// too high 13173759585


