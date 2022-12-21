const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

const main = (input, boost=1, mix=1) => {
  const lines = input.split('\n');
  const monkeys = lines.reduce((m, line) => {
    const [name, value] = line.split(': ');
    console.log(name, value)
    const args = value.split(' ');
    if (args.length == 1) m[name] = parseInt(args[0], 10);
    else m[name] = args;
    return m;
  }, {})
  
  const yell = name => {
    const monkey = monkeys[name]
    if (Number.isInteger(monkey)) {
      return monkey;
    } else {
      const left = yell(monkey[0]);
      const right = yell(monkey[2]);
      switch (monkey[1]) {
        case '-':
          return left - right;
        case '+':
          return left + right;
        case '*':
          return left * right;
        case '/':
          return left / right;
      }
    }
  }
  console.log(yell('root'))
}

const main2 = (input, boost=1, mix=1) => {
  const lines = input.split('\n');
  const monkeys = lines.reduce((m, line) => {
    const [name, value] = line.split(': ');
    const args = value.split(' ');
    if (args.length == 1) m[name] = BigInt(args[0]);
    else m[name] = args;
    return m;
  }, {})
  
  const yell = (name, humn) => {
    const monkey = monkeys[name]
    if (!monkey.length) {
      return monkey;
    } else {
      const left = yell(monkey[0]);
      const right = yell(monkey[2]);
      switch (name=='root'? '=' : monkey[1]) {
        case '=':
          return [left == right, left, right];
        case '-':
          return left - right;
        case '+':
          return left + right;
        case '*':
          return left * right;
        case '/':
          return left / right;
      }
    }
  }
  
  let answer = false;
  let left = BigInt(Number.MIN_SAFE_INTEGER);
  let right = BigInt(Number.MAX_SAFE_INTEGER);
  const abs = (v) => v>0 ? v : -v
  while (true) {

    monkeys['humn'] = left;
    const resL = yell('root');
    monkeys['humn'] = right;
    const resR = yell('root');

    const middle = BigInt((left + right) /2n);
    monkeys['humn'] = middle;
    const resM = yell('root');
    
    if (resM[0]) {
      answer = middle;
      break;
      break;
    } else {
      if (abs(resL[2]-resL[1]) < abs(resR[2]-resR[1])) {
        right = middle;
      } else {
        left = middle;
      }
    }
  }
  console.log('answer is', answer)
}

main(test)
main(input)
main2(test)
main2(input)



