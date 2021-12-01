
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
  return [OUTPUT, intruction];
};


const main = () => {
  const square = 99;
  const WIDTH = 2000;
  const offsetX = 0;
  const offsetY = 0;
  let res=[];
  let sum = 0;
  let painted = [];
  let pointer = 0;
  let nextStart, nextStop, lastStart, lastStop;
  const test = (leftEnd) => {
    if (painted[leftEnd] != 1) {
      console.error('left end was not in range');
      return false;
    }
    const otherEnd = leftEnd - square* (WIDTH - 1)
    if (painted[otherEnd] == 1)
      return true;
    return false;
  }
  while (pointer !== -1 && pointer < 100000000) {
    const x = pointer%WIDTH;
    const y =parseInt(pointer/WIDTH);

    if (nextStop && lastStart && pointer >= lastStart && pointer < nextStop) {
//      console.log('is I')
      painted.push('X');
//      painted.push(1);
    } else if (lastStop && nextStart && pointer > lastStop && pointer < nextStart) {
//      console.log('is _')
      
//      painted.push(0);
      painted.push('_');
    } else {
//      console.log('computing', x, y)
      const out = run([x+offsetX, y+offsetY], input.slice(0), 'test1')[0][0];
      painted.push(out);
      
      if (out && !lastStart) {
        lastStart = pointer;
        nextStart = pointer + WIDTH;
        lastStop = null;
      }
      if (!out && !lastStop) {
        // right edge
        if (test(lastStart)) {
          console.log('yay', lastStart, lastStart%WIDTH, lastStart/WIDTH-99);
          break;
        }
        nextStop = pointer + WIDTH;
        lastStart = null;
        lastStop = pointer;
      }  
    }

    pointer++
  }
//  while (painted.length) {
//    console.log(
//      painted.splice(0,WIDTH)
////        .map(d => d == 'O' ? 0 : d=='I' ? 1 : d)
//        .join('')
//    );
//  }
  console.log(pointer/WIDTH)
}
main()

//1205 fail
// 3601950151
3601950151