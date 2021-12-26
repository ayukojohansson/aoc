const fs = require('fs');
const input = fs.readFileSync('./input2.txt', 'utf8');
const testData = `inp w
add z w
mod z 2
div w 2
add y w
mod y 2
div w 2
add x w
mod x 2
div w 2
mod w 2`;


const cache = {};
const validate = (id, monad, numbers, initialZ = 0) => {
  const hash = `${id},${numbers},${initialZ}`;
  if (cache[hash]) return cache[hash];
  let index = 0, ni=0;
  let res = {x:0, y:0, z:initialZ};
  const z = [];
  while (index < monad.length) {
    const [com, a, bOrInt] = monad[index];
    const b = /w|x|y|z/.test(bOrInt) ? res[bOrInt] : parseInt(bOrInt);
  //  console.log(com, a, b);
    switch (com) {
      case 'inp':
        if (ni >= numbers.length) {
          throw new Error('no input left', numbers);
        }
        res[a] = parseInt(numbers[ni++]);
        z.push(res.z);
//        console.log(res);
        break;
      case 'add':
        res[a] = res[a] + b;
        break;
      case 'mul':
        res[a] = res[a] * b;
        break;
      case 'div':
        res[a] = parseInt(res[a] / b);
        break;
      case 'mod':
        res[a] = res[a] % b;
        break;
      case 'eql':
        res[a] = res[a] == b ? 1 : 0;
        break;
      default:
        throw new Error('not implemented', com)
    }
    
    index++;
  }
//  console.log(numbers, res);
  z.push(res.z);
  cache[hash] = z;
  return z;
}

const calc = (inputData) => {
 const monad = inputData.split('\n\n')
  .map(block => block.split('\n').map(line => line.split(' ')));

  let possible4 = [];
  let code = '9999';
  let index = 0;
  let monadBlock = monad.slice(0,4).flatMap(m => m);
console.log(monadBlock)

  while (true) {
    if (code.indexOf('-') >= 0) break;
    
    if (code.indexOf('0') == -1) { 
      const z = validate(1, monadBlock, code);
      if (z[z.length-1] == z[z.length-3]) {
        possible4.push({code, z: z[z.length-1]});
      }
    }
    code = String(parseInt(code) - 1).padStart(4, '0');
  }

  monadBlock = monad.slice(4,7).flatMap(m => m);
  const possible3 = [];
  possible4.forEach(({ code: code4, z: initialZ }) => {
    let code3 = '999';
    index = 0;
    while (true) {
      if (code3.indexOf('-') >= 0) break;

      if (code3.indexOf('0') == -1) { 
        const z = validate(2, monadBlock, code3, initialZ);
        if (z[z.length-1] == z[z.length-3]) {
//          console.log(code4 + code3, z);
          possible3.push({code: code4 + code3, z: z[z.length-1]});
        }
      }
      code3 = String(parseInt(code3) - 1).padStart(3, '0');
    }
  })

  monadBlock = monad.slice(7,9).flatMap(m => m);
  const possible2 = [];
  possible3.forEach(({ code: code7, z: initialZ }) => {
    let code2 = '99';
    index = 0;
    while (true) {
      if (code2.indexOf('-') >= 0) break;

      if (code2.indexOf('0') == -1) { 
        const z = validate(3, monadBlock, code2, initialZ);
        if (z[z.length-1] == z[z.length-3]) {
//          console.log(code7 + code2, z);
          possible2.push({code: code7 + code2, z: z[z.length-1]});
        }
      }
      code2 = String(parseInt(code2) - 1).padStart(2, '0');
    }
  })
  
  monadBlock = monad.slice(9,11).flatMap(m => m);
  const possible1 = [];
  possible2.forEach(({ code: code9, z: initialZ }) => {
    let code2 = '99';
    index = 0;
    while (true) {
      if (code2.indexOf('-') >= 0) break;

      if (code2.indexOf('0') == -1) { 
        const z = validate(4, monadBlock, code2, initialZ);
        if (z[z.length-1] == z[z.length-3]) {
//          console.log(code9 + code2, z);
          possible1.push({code: code9 + code2, z: z[z.length-1]});
        }
      }
      code2 = String(parseInt(code2) - 1).padStart(2, '0');
    }
  })
  
  monadBlock = monad.slice(11).flatMap(m => m);
  let stop = false;
  possible1.some(({ code: code11, z: initialZ }) => {
    let code3 = '999';
    while (true) {
      if (code3.indexOf('-') >= 0) break;

      if (code3.indexOf('0') == -1) { 
        const z = validate(5, monadBlock, code3, initialZ);
        if (z[z.length-1] == 0) {
          console.log('part1', code11 + code3, z);
          return true;
        }
      }
      code3 = String(parseInt(code3) - 1).padStart(3, '0');
    }
    return false;
  })
  
  possible1.reverse().some(({ code: code11, z: initialZ }) => {
    code3 = '111';
    while (true) {
      if (code3.length >= 4) break;

      if (code3.indexOf('0') == -1) { 
        const z = validate(5, monadBlock, code3, initialZ);
        if (z[z.length-1] == 0) {
          console.log('part2', code11 + code3, z);
          return true;
        }
      }
      code3 = String(parseInt(code3) + 1).padStart(3, '0');
    }
    return false;
  })

  return ;
  
}

console.log('part 1:', calc(input, 2))



