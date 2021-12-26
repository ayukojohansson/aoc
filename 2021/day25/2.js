const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');
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

const process = ([com, a, bOrInt], numbers, ni, res) => {
  const b = /w|x|y|z/.test(bOrInt) ? res[bOrInt] : parseInt(bOrInt);
//  console.log(com, a, b);
  switch (com) {
    case 'inp':
      res[a] = parseInt(numbers[ni]);
//      console.log(res);
      return ni+1;
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
}

const validate = (monad, numbers) => {
  let index = 0, ni=0;
  let res = {x:0, y:0, z:0}
  while (index < monad.length) {
    const incr = process(monad[index], numbers, ni, res);
    if (incr) ni = incr;
    index++;
  }
  console.log(numbers, res);
  return res.z == 0;
}

const calc = (inputData) => {
 const monad = inputData.split('\n')
  .map(line => line.split(' '));

  let code = '99979989699999';

  let index = 0;
  while (!validate(monad, code)) {
//    break;
    code = String(parseInt(code) - 1);
    console.log(code)
  }
  console.log(code);

  return ;
  
}

//console.log('part 1 (test):', validate('21718585111111'.split('')))
console.log('part 1:', calc(input, 2))

//console.log('part 2:', calc(data, 50))


