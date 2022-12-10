const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;


const main = (str) => {
  const lines = str.split('\n');
  let value = 1;
  let sum = 0;
  let index = 0;
  let cycle = 0;
  let crt = [];
  let sprits = new Set([0,1,2]);
  let tmp = [];

  const nextCycle = () => {
    cycle++;
    tmp.push(sprits.has((cycle-1) % 40) ? '#' : '.');

    if (cycle%40 == 20) {
      console.log(cycle, ':', value);
      sum += value*cycle;
    }
    if (cycle%40 == 0) {
      crt.push(tmp.join(''));
      tmp = [];
    }
  }

  while (index < lines.length) {
    nextCycle();
    const [com, v] = lines[index].split(' ');
    if (com == 'addx') {
      nextCycle();
      value += parseInt(v, 10);
      sprits = new Set([value-1, value, value+1]);
    }
    index++;
  }
  console.log('part1', sum)
  console.log('part2', crt)
}

main(test)
main(input)


