
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
//  console.log('reverse')
  return totalLength - 1 - pos;
}

const deal = incr => pos => {
//  console.log('deal', incr)
  
  return pos * incr % totalLength;
}

const cut = incr => pos => {
//  console.log('cut', incr, pos + incr + totalLength)
  
  if (incr > 0) {
    return (pos - incr + totalLength) % totalLength;
  } else 
    return (pos - incr + totalLength) % totalLength;
}


const parseInput = line => {
  const number = line.match(/-?\d+/)
//  console.log(number, line)
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

const run = (shuffleInput, cardNo) => {
  let currentPos = cardNo;
  let round = 0, last;
//  while (round < 10020) {
  while (round < 1) {
    const shuffles = shuffleInput.split('\n');

    while (shuffles.length) {
      const shuffle = parseInput(shuffles.shift());
      currentPos = shuffle(currentPos);
    }
//    if (round %1000000 == 0)
    console.log('current position after round'  , round, currentPos, 'card', cardNo);
    last = currentPos;
    round++;
  }
  return { pos: currentPos, name: cardNo};
}

//101741582076661
//119315717514047 // card

const totalLength = 10007;
//const totalLength = 119315717514047;
const test1 = `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`;
const test2= `cut -4`;

//run(input, 0);
//run(input, 2643);
//run(input, 6226);
//run(input, 0); //6978 out of 10007
//run(input, 2019); //29438819666006 out of 119315717514047


let t = 0;
const res = [];
while (t < 10007) {
  res.push(run(input, t));
  t++;
}

//console.lg(res.sort((a,b) => a.pos - b.pos).map(d => JSON.stringify(d)).join('\n'))
//run(input, 2019);
//run(input, 2019); //6978

/*
current position after round 0 6978
current position after round 1 5004
current position after round 2 7951
current position after round 3 3303
current position after round 4 7829
current position after round 5 6324
current position after round 6 9387
current position after round 7 6624
current position after round 8 4255
current position after round 9 3285

current position after round 10005 2019
current position after round 10006 6978
current position after round 10007 5004
current position after round 10008 7951
current position after round 10009 3303
current position after round 10010 7829
current position after round 10011 6324
current position after round 10012 9387
current position after round 10013 6624
*/