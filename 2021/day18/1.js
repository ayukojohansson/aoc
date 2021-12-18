const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input;

const explode = (snail, index) => {
  const match = snail.slice(index).match(/\[(\d+),(\d+)\]/);
  if (!match) {
    console.error('something wrong with explode');
  };

  const [target, x, y] = match;

  let leftSnail = snail.slice(0, index + match.index);
  let rightSnail = snail.slice(index + match.index + target.length);

  const left = leftSnail.match(/(.*[^\d])(\d+)/);
  if (left) {
    let sumL = parseInt(left[2], 10) + parseInt(x, 10);
    leftSnail = leftSnail.replace(left[0], left[1] + sumL); 
  }
  const right = rightSnail.match(/([^\d])(\d+)/);
  if (right) {
    let sumR = parseInt(right[2], 10) + parseInt(y, 10);
    rightSnail = rightSnail.replace(right[0], right[1] + sumR); 
  }

  return leftSnail + '0' + rightSnail;
}

const split = (snail, index) => {
  const leftSnail = snail.slice(0, index);
  const rightSnail = snail.slice(index);
  const target = rightSnail.match(/\d+/);
  if (!target) {
    console.error('something wrong with split');
  }
  const half = parseInt(parseInt(target[0], 10) / 2);
  const roundUp = parseInt(parseInt(target[0], 10) % 2);

  return leftSnail + rightSnail.replace(target[0], `[${half},${half+roundUp}]`);
}

const reduce = (snail) => {
  let depth = 0;
  let explodeAt = 0;
  let splitAt = 0;
  let index = 0;
  let currentNumber = '';
  while (index < snail.length) {
    const current = snail[index];
    if (current == '[') {
      depth++
      if (depth > 4) {
        explodeAt = index;
        break;
      }
    };
    if (current == ']') {
      depth--;
    }
    if (/\d/.test(current)) {
      currentNumber += current;
    } else {
      if (currentNumber && parseInt(currentNumber,10) >= 10 && !splitAt) {
        splitAt = index - currentNumber.length;
      }
      currentNumber = '';
    }
    index++;     
  }

  if (explodeAt) {
    return reduce(explode(snail, explodeAt));
  } else if (splitAt) {
    return reduce(split(snail, splitAt));
  }
  return snail;
}

const magnitude = (snail) => {
  const target = snail.match(/\[(\d+),(\d+)\]/);
  if (!target) return snail;
  else {
    const m = +target[1]*3 + +target[2]*2;
    return magnitude(snail.replace(target[0], m));
  }
}

const calc = (inputData) => {
  const snails = inputData.split('\n');
  let finalSnail = snails[0];
  for (let index=1; index<snails.length; index++) {
    finalSnail = reduce(`[${finalSnail},${snails[index]}]`);
  }
  return magnitude(finalSnail);
}

const calc2 = (inputData) => {
  const snails = inputData.split('\n');
  let max = 0;
  for (let i=0; i<snails.length; i++) {
    for (let j=0; j<snails.length; j++) {
      if (i == j) {
        
      } else {
        const final = reduce(`[${snails[i]},${snails[j]}]`);
        const mag = magnitude(final);
        if (+mag > max) max = mag;
      }
    }
  }
  return max;
}

console.log('part 1:', calc(data))

console.log('part 2:', calc2(data))

