
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
    logger.error('not found', res, mode, pointer)
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
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const run = (INPUT, intruction, name) => {
  const setValue = write(intruction);
  const OUTPUT = [];
  const WIDTH = 40, HEIGHT = 30;

  let opcode = intruction[0], toStore;
  let index = 0;
  let relativebase = 0;
  let shouldHalt = false;
  let rescue = [];
  let canvas = { '0,0': { status: 'S', step: 0 } };
  let possibleMove = {};
  let SYSTEM, tempX, tempY, temp, x=0, y=0;
  // north (1), south (2), west (3), and east (4).
  const getStatus = (x,y) => canvas[`${x},${y}`];
  const getStepAt = (x,y) =>
  (canvas[`${x},${y}`] && canvas[`${x},${y}`].step !== undefined)
  ? canvas[`${x},${y}`].step
  : Number.MAX_SAFE_INTEGER;
  const getStep = (x,y) => {
    const currentStep = getStepAt(x,y);
    const n = getStepAt(x, y-1);
    const s = getStepAt(x, y+1);
    const e = getStepAt(x+1, y);
    const w = getStepAt(x-1, y);
    const min = Math.min(n,s,e,w);
//    console.log('pos', x,y)
//    console.log('min is', min, n,s,e,w)
//    console.log('currentStep', currentStep)
    return (min+1 < currentStep) ? min+1 : currentStep;
  }
  const setCanvas = (x,y,s) => {
    let c = canvas[`${x},${y}`];
    if (!canvas[`${x},${y}`])
      canvas[`${x},${y}`] = {};

    canvas[`${x},${y}`].status = s==0 ? 'WALL' : s==1 ? 'OPEN' : s==2 ?'X' : s;
    if (s==1 || s==2)
      canvas[`${x},${y}`].step = getStep(x,y);
  }
  const getPos = (direction) => {
    switch (direction) {
      case 1:
        return [x, y-1];
      case 2:
        return [x, y+1];
      case 3:
        return [x-1, y];
      case 4:
        return [x+1, y];
    }
  };
  const findInput = () => {
    if (OUTPUT.length) {
      const status = OUTPUT.shift();
      setCanvas(...temp,status);

      if (status == 0) {
      } else {
        [x, y] = temp
        if (status == 2) {
          console.log('system found at', x,y, 'step', currentStep)
          console.log(canvas[`${x},${y}`])
//          ascii(canvas);
        }
      }
    }
    let command = 1;
//    ascii(canvas);
    // north (1), south (2), west (3), and east (4).
    const commandArray = [4,2,3];
//    console.log('current',x,y)
    while (command) {
      temp = getPos(command);
      const status = getStatus(...temp)
//      console.log(temp, 'status', status)
      if (!status)
        break;
      if (status.status !== 'WALL')
        possibleMove[`${x},${y}`] = (possibleMove[`${x},${y}`] || []).concat([command]);
      command = commandArray.shift();
    }
    // all surrounding is known
    if (!command) {
//      console.log('possibleMove', possibleMove[`${x},${y}`])
      if (possibleMove[`${x},${y}`].length) {
        command = possibleMove[`${x},${y}`].shift();
        temp = getPos(command);
//        console.log('rescued');
      } else {
      }
//      setCanvas(x,y,'O');
//      ascii(Object.assign({}, canvas, { [`${x},${y}`]: {status: 'O'}}));
    }
    INPUT.push(command);
//    console.log('input is', command);
  };

  let currentStep = 0;
  while (!shouldHalt && currentStep < 30000) {
    const { opCode, mode1, mode2, mode3, mode4 } = getInstruction(opcode);
    const { code, params } = getCode(intruction, index, relativebase);
    logger.debug('\n')
    logger.debug('curernt job', code, 'params', params, 'modes', mode1, mode2, mode3)
    logger.debug('current output', OUTPUT)

    switch (code) {
      case 1:
        toStore = params[0] + params[1];
        setValue(mode3, index+3, toStore, relativebase);
        index += 4;
        break;
      case 2:
        toStore = params[0] * params[1];
        setValue(mode3, index+3, toStore, relativebase);
        index += 4
        break;
      case 3:
        if (INPUT.length == 0) {
          findInput();
        }
        currentStep++;
        if (currentStep%10000 == 0) {
          console.log('step', currentStep)
          ascii(Object.assign({}, canvas, { [`${x},${y}`]: {status: 'O'}}));
        }
        
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
        logger.debug('STOP');
        shouldHalt = true;
        break;
      }
//    currentStep++;
//    if (currentStep%10000 == 0) {
//      console.log('step', currentStep)
//      ascii(Object.assign({}, canvas, { [`${x},${y}`]: {status: 'O'}}));
//    }
    opcode = intruction[index];
  }
  findInput();
  console.log('after', currentStep)
//  console.log(canvas);
  ascii(canvas);
//  console.log(possibleMove);
  return [OUTPUT, intruction];
};

const ascii = can => {
  console.clear();
  const [minX, minY, maxX, maxY] = Object.keys(can).reduce(([x0, y0, x1, y1], dot) => {
    const [x,y] = dot.split(',').map(Number);
    return [
      x<x0 ? x: x0,
      y<y0 ? y: y0,
      x>x1 ? x: x1,
      y>y1 ? y: y1,
    ];
  }, [0,0,0,0]);
  const width = maxX - minX +1;
  const height = maxY - minY +1;

  const painted = Object.keys(can).reduce((c, pos) => {
    const [x,y] = pos.split(',').map(Number);
    
    c[(x - minX) + width * (y - minY)] = can[pos];
    return c;
  }, Array((width) * (height)).fill({ status: '.'}));

  console.log('\n')
  while (painted.length) {
    logger.result(
      painted.splice(0,width)
        .map(d => d.step ==0 ? 'S' : d.status=='WALL' ? '#': d.status=='OPEN' ? ' ': d.status)
        .join('')
    );
  }
}

return run([], input, 'test1');
// 36, fail
// 42, fail