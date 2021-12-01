
/*

The image you received is 25 pixels wide and 6 pixels tall.

To make sure the image wasn't corrupted during transmission, the Elves would like you to find the layer that contains the fewest 0 digits. On that layer, what is the number of 1 digits multiplied by the number of 2 digits?
*/

const logger = {
  log: (...args) => console.log('INFO:', ...args),
  error: (...args) => console.log('\x1b[41m', 'ERROR:', ...args, "\x1b[0m"),
  result: (...args) => console.log('\x1b[32m', 'RESULT:', ...args, "\x1b[0m"),
  debug: (...args) => process.env.debug == 'true' && console.log('DEBUG:',...args),
};

const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const reverse = (pos) => {
  return totalLength - 1 - pos;
}

const deal = incr => pos => {
  let i = 0;
  while ((pos + totalLength * i) % incr)
    i++

  return (pos + totalLength * i) / incr;
}

const cut = incr => pos => {
  
  if (incr > 0) {
    return (pos + incr + totalLength) % totalLength;
  } else 
    return (pos + incr + totalLength) % totalLength;
}

const parseInput = line => {
  const number = line.match(/-?\d+/)
  if (line.indexOf('deal into') > -1) {
    return reverse;
  }
  if (line.indexOf('deal with') > -1) {
    return deal(Number(number[0]));
  }
  if (line.indexOf('cut') > -1) {
    return cut(Number(number[0]));
  }
  else
    console.log('unknown shuffle')
}

const run = (shuffleInput, cardNo, roundLimit) => {
  let currentPosSlow = cardNo;
  let round = 0, last;
  while (round < roundLimit) {
    const shuffles = shuffleInput.split('\n');

    while (shuffles.length) {
      const shuffle = parseInput(shuffles.pop());
      currentPosSlow = shuffle(currentPosSlow);
    }

    round++;
  }
  return currentPosSlow;
}

//101741582076661
//119315717514047 // card

//const totalLength = 10;
//const totalLength = 10007;
const totalLength = 119315717514047;
const totalLengthBig = BigInt(totalLength);

const lim = 10000;

const findFomula = round => {
  const pos0 = run(input, 0, round);
  const pos1 = run(input, 1, round);
  const pos2 = run(input, 2, round);

  const pad = n => n<0 ? n+totalLength : n;
  return [pad(pos1 - pos0), pos0]
}

console.log('fomula 1', findFomula(1));
console.log('fomula 10', findFomula(10));
console.log('fomula 10000', findFomula(10000));
console.log('fomula 100000', findFomula(100000));


// fomula for 1: (3541 * pos + 204) % 10007
// fomula for 2: (9917 * pos + 2064) % 10007


// fomula for                1: (75713548004544 * pos + 92481105708589 ) % 119315717514047
// formula for              10: (26553796955007 * pos + 88645327874573) % 119315717514047
// formula for           10000: (90243144897616 * pos + 53106952409701) % 119315717514047
// formula for          100000: (68358243020783 * pos + 70481814651839) % 119315717514047
// formula for     10000000000: (5687321550242 * pos + 107658063945267) % 119315717514047
// formula for 100000000000000: (59724652204633 * pos + 99823381766678) % 119315717514047


const fomula = (a, b, times) => pos => {
  let round = 0;
  let newPos = pos;
  while (round < times) {
    newPos = (BigInt(a) * newPos + BigInt(b)) % totalLengthBig;
    round++;
  }
  return newPos;
}

const res_100000000000000 = fomula(59724652204633, 99823381766678, 1)(BigInt(2020));
const res_101740000000000 = fomula(5687321550242, 107658063945267, 174)(res_100000000000000);
const res_101741582000000 = fomula(68358243020783, 70481814651839, 15820)(res_101740000000000);
const res_101741582070000 = fomula(90243144897616, 53106952409701, 7)(res_101741582000000);
const res_101741582076660 = fomula(26553796955007, 88645327874573, 666)(res_101741582070000);
const res_101741582076661 = fomula(75713548004544, 92481105708589, 1)(res_101741582076660);

console.log(res_101741582076661)

// 101741582076661
//              10
//           10000
//          100000
//     10000000000
// 100000000000000