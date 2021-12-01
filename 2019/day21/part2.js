
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
const input = fs.readFileSync('./input.txt', 'utf8').split(',').map(s => Number(s));
//const input = '123456789012'.split('').map(s => Number(s));

const getInstruction = n => {
  var str = `000000${n}`.slice(-5);
  const opCode = parseInt(str.slice(-2), 10);
  const mode1 = parseInt(str.slice(-3,-2), 10);
  const mode2 = parseInt(str.slice(-4,-3), 10);
  const mode3 = parseInt(str.slice(-5,-4), 10);
  const mode4 = parseInt(str.slice(-6,-5), 10);
  return { opCode, mode1, mode2, mode3, mode4 };
}

const getCode = (instruction, index, relativebase) => {
  const { opCode, mode1, mode2, mode3, mode4 } = getInstruction(instruction[index]);
  return {
    code: opCode,
    mode1, mode2, mode3, mode4,
    params: [
      getValue(instruction, mode1, index+1, relativebase),
      getValue(instruction, mode2, index+2, relativebase),
      getValue(instruction, mode3, index+3, relativebase),
    ],
  }
}

const getValue = (intruction, mode, pointer, base) => {
  let res;
  if (mode == 0) // parameter mode
    res = intruction[intruction[pointer]] || 0;
  else if (mode == 1) // immediate mode
    res = intruction[pointer];
  else if (mode == 2) // relative mode
    res = intruction[intruction[pointer] + base] || 0;

  logger.debug('[getValue]', 'mode:', mode, 'pointer:', pointer, 'base:', base, 'res:', res)
  if (res === undefined) {
    logger.error('not found', res)
    throw new Error('value not found');
  } else return res;
}

const write = intruction => (mode, pointer, toStore, base) => {
  if (mode == 0) 
    intruction[intruction[pointer]] = toStore;
  else if (mode == 2)
    intruction[intruction[pointer] + base] = toStore;
  else
    logger.error('!!!!!! unknown mode', mode);
};


const run = (INPUT, intruction, name) => {
  const setValue = write(intruction);
  var OUTPUT = [];

  let opcode = intruction[0], toStore;
  let index = 0;
  let relativebase = 0;
  let shouldHalt = false;

  while (!shouldHalt) {
    const { opCode, mode1, mode2, mode3, mode4 } = getInstruction(opcode);
    const { code, params } = getCode(intruction, index, relativebase);
//    console.log('\n')
//    logger.log('curernt job', code, 'params', params, 'modes', mode1, mode2, mode3)
//    logger.log('current output', OUTPUT)

    switch (code) {
      case 1:
        toStore = params[0] + params[1];
//        params[2] = toStore;
        setValue(mode3, index+3, toStore, relativebase);
        index += 4;
        break;
      case 2:
        toStore = params[0] * params[1];
        setValue(mode3, index+3, toStore, relativebase);
        index += 4
        break;
      case 3:
        OUTPUT = [];
        toStore = INPUT.shift();
        setValue(mode1, index+1, toStore, relativebase);
        index += 2;
        break;
      case 4:
        toStore = params[0];
        OUTPUT.push(toStore);
        logger.debug(name, 'OUTPUT', OUTPUT);
        index += 2;
        break;
      case 5:
        if (params[0] !== 0) {
          index = params[1];
        } else {
          index += 3;
        }
        break;
      case 6:
        if (params[0] === 0) {
          index = params[1];
        } else {
          index += 3;
        }
        break;
      case 7:
        toStore = (params[0] < params[1])
          ? 1 : 0;
        setValue(mode3, index+3, toStore, relativebase);
        index += 4;
        break;
      case 8:
        toStore = (params[0] == params[1])
          ? 1 : 0;
        setValue(mode3, index+3, toStore, relativebase);
        index += 4;
        break;
      case 9:
        relativebase += params[0];
        index += 2;
        logger.debug('relative base is now', relativebase);
        break;
      case 99:
        logger.debug('STOP', intruction);
        shouldHalt = true;
        break;
      }

    opcode = intruction[index];
  }
  console.log(name, String.fromCharCode(...OUTPUT))
  return [OUTPUT, intruction];
};
// [ 3, 32, 18, 5 ]
const toAscii = str => str.split('').map(d => (d.charCodeAt(0))).concat([10]);
const toInt = bool => bool ? 1 : 0;
const possible1 = [
  ['NOT A J', (a,b,c,d,t,j) => [a,b,c,d,t,!a] ],
  ['NOT B J', (a,b,c,d,t,j) => [a,b,c,d,t,!b] ],
  ['NOT C J', (a,b,c,d,t,j) => [a,b,c,d,t,!c] ],
  ['NOT D J', (a,b,c,d,t,j) => [a,b,c,d,t,!d] ],
  ['NOT T J', (a,b,c,d,t,j) => [a,b,c,d,t,!t] ],
  ['NOT J J', (a,b,c,d,t,j) => [a,b,c,d,t,!j] ],

  ['NOT A T', (a,b,c,d,t,j) => [a,b,c,d,!a,j] ],
  ['NOT B T', (a,b,c,d,t,j) => [a,b,c,d,!b,j] ],
  ['NOT C T', (a,b,c,d,t,j) => [a,b,c,d,!c,j] ],
  ['NOT D T', (a,b,c,d,t,j) => [a,b,c,d,!d,j] ],
  ['NOT J T', (a,b,c,d,t,j) => [a,b,c,d,!j,j] ],
  ['NOT T T', (a,b,c,d,t,j) => [a,b,c,d,!t,j] ],

  ['AND A T', (a,b,c,d,t,j) => [a,b,c,d,a&&t,j] ],
  ['AND B T', (a,b,c,d,t,j) => [a,b,c,d,b&&t,j] ],
  ['AND C T', (a,b,c,d,t,j) => [a,b,c,d,c&&t,j] ],
  ['AND D T', (a,b,c,d,t,j) => [a,b,c,d,d&&t,j] ],
  ['AND J T', (a,b,c,d,t,j) => [a,b,c,d,j&&t,j] ],
  ['AND T T', (a,b,c,d,t,j) => [a,b,c,d,t&&t,j] ],

  ['AND A J', (a,b,c,d,t,j) => [a,b,c,d,t,a&&j] ],
  ['AND B J', (a,b,c,d,t,j) => [a,b,c,d,t,b&&j] ],
  ['AND C J', (a,b,c,d,t,j) => [a,b,c,d,t,c&&j] ],
  ['AND D J', (a,b,c,d,t,j) => [a,b,c,d,t,d&&j] ],
  ['AND J J', (a,b,c,d,t,j) => [a,b,c,d,t,j&&j] ],
  ['AND T J', (a,b,c,d,t,j) => [a,b,c,d,t,t&&j] ],

  ['OR A T', (a,b,c,d,t,j) => [a,b,c,d,a||t,j] ],
  ['OR B T', (a,b,c,d,t,j) => [a,b,c,d,b||t,j] ],
  ['OR C T', (a,b,c,d,t,j) => [a,b,c,d,c||t,j] ],
  ['OR D T', (a,b,c,d,t,j) => [a,b,c,d,d||t,j] ],
  ['OR J T', (a,b,c,d,t,j) => [a,b,c,d,j||t,j] ],
  ['OR T T', (a,b,c,d,t,j) => [a,b,c,d,t||t,j] ],

  ['OR A J', (a,b,c,d,t,j) => [a,b,c,d,t,a||j] ],
  ['OR B J', (a,b,c,d,t,j) => [a,b,c,d,t,b||j] ],
  ['OR C J', (a,b,c,d,t,j) => [a,b,c,d,t,c||j] ],
  ['OR D J', (a,b,c,d,t,j) => [a,b,c,d,t,d||j] ],
  ['OR J J', (a,b,c,d,t,j) => [a,b,c,d,t,j||j] ],
  ['OR T J', (a,b,c,d,t,j) => [a,b,c,d,t,t||j] ],
];
const func = {
  NOT: (a, b) => toInt(!a),
  AND: (a, b) => toInt(a && b),
  OR: (a, b) => toInt(a || b),
};
const getFunc = (com, i1, i2) => {
  if (i2 == 10)
    return (...args) =>
      [args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], func[com](args[i1], args[i2])]
  else 
    return (...args) =>
      [args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8],func[com](args[i1], args[i2]), args[10]]
};
const generateCommand = () => {
  return ['NOT', 'AND', 'OR'].flatMap(com => {
    return ['a','b','c','d','e','f','g','h','i','t','j'].flatMap((s, i) => [
      [`${com} ${s} t`.toUpperCase(), getFunc(com, i, 9) ],
      [`${com} ${s} j`.toUpperCase(), getFunc(com, i, 10) ]
    ])
  })
}
const possible = generateCommand();

const generateInput = () => Array(16*16*2).fill(0).map((p,index) => {
  return `000000000${Number(index).toString(2)}`.slice(-9);
});
const possibleInput = generateInput();
//console.log(possible)

const calc = comArr => d => {
  return comArr.reduce((args, comIndex) => {
//    console.log(possible[comIndex])
    return possible[comIndex][1](...args);
  }, [...d.split('').map(Number), 0, 0])
}

const getHash = comArr => {
  return possibleInput.map(calc(comArr)).map(d=> d.slice(-1)).join('');
};
//console.log(getHash([24]));
//console.log(getHash([25]));

const expand = com => {
//  console.log('expand', com)
  return possible.map((p, i) => [...com, i])
    .filter(commandArr => {
      return commandArr.map(c => c % 11).sort().join('');
    });
};

const findCommand = (arr) => {
  return arr.map(i => possible[i][0]).concat(['RUN']);
};

const hasJump = com => {
  return com.some(c => c.indexOf('J') > -1);
}

let toTest = possible.map((arr,i) => [i]);

let hashTable = {};
//while (toTest.length) {
//  const commandArr = toTest.shift();
////  console.log(commandArr);
//
//  const command = findCommand(commandArr);
//  if (hasJump(command)) {
//    const hash = getHash(commandArr);
//    console.log(command);
//    
//    if (!hashTable[hash]) {
//      const res = run(command.flatMap(toAscii), input.slice(0), `testing ${commandArr}`);
//      if (res[0].some(d => d > 128)) {
//        console.log('YAY', res[0])
//        break;
//      }
//    }
//    if (commandArr.length > 15) {
////      console.log('command too long');
//    } else if (!hashTable[hash] || hashTable[hash] > commandArr.length) {
//      hashTable[hash] = commandArr.length;
//      toTest.push(...expand(commandArr));
//    } else {
////      console.log('command already tested')
//    }
//  } else {
////    console.log('no jump, skipping')
//  }
//}

const manual = [
  'NOT C T',
  'NOT T T',
//  'AND B T',
  'NOT T T',

  'NOT A J',
  'OR T J',
  'AND D J',

  'NOT E T',
  'NOT T T',
  'OR H T',
  'AND T J',
  'RUN'
]

console.log(run(manual.flatMap(toAscii), input.slice(0), `testing ${manual}`))
