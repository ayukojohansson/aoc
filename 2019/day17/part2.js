
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
//    logger.log('\n')
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
        if (!INPUT.length) {
          INPUT.push(getInput(OUTPUT));
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
        logger.debug('STOP', intruction);
        shouldHalt = true;
        break;
      }

    opcode = intruction[index];
  }
  console.log('first', OUTPUT)
  return [OUTPUT, intruction];
};

const findRobot = (map) => {
  const row = map.findIndex(line => /<|>|\^|v/.test(line));
  const robot = map[row].match(/<|>|\^|v/);
  return [robot.index, row, robot[0]];
}
const DIRECTION = {
  '<': 3, //'W',
  '>': 1, //'E',
  '^': 0, //'N',
  'v': 2, //'S',
};

const getPos = (x,y,dir,map) => {
  switch (dir % 4) {
    case 0:
      return map[y-1] && map[y-1][x];
    case 1:
      return map[y] && map[y][x+1];
    case 2:
      return map[y+1] && map[y+1][x];
    case 3:
      return map[y] && map[y][x-1];
      
  };
}
const move = (x,y, dir) => {
  switch (dir % 4) {
    case 0:
      return [x, y-1];
    case 1:
      return [x+1, y];
    case 2:
      return [x, y+1];
    case 3:
      return [x-1, y];
      
  };
}
const getNextDirection = (x,y,dir,map) => {
  let m = dir;
  if (getPos(x,y,dir,map) == '#') {
    return ['F', dir];
  }
  if (getPos(x,y,dir+1,map) == '#') {
    return ['R', dir+1];
  }
  if (getPos(x,y,dir+3,map) == '#') {
    return ['L', dir+3];
  }
  return ['END']
}
const mapCharToString = chars => String.fromCharCode(...chars);
const getInput = (arr) => {
  console.log('getInput')
  const map = mapCharToString(arr).split('\n');
  let [x, y, caret] = findRobot(map);
  let direction = DIRECTION[caret];
  console.log(direction)

  let route = [];
  let end = false;
  let stepCounter = 0;
  while (true) {
    const [turn, nextDirection] = getNextDirection(x,y,direction,map);
    console.log('turn', turn, nextDirection)
    if (turn == 'END') {
      route.push(stepCounter);
      break;
    }
    if (turn == 'F') {
      // move forward
    } else {
      // turn
      if (stepCounter) {
        route.push(stepCounter);
      }
      route.push(turn);
      stepCounter = 0;
    }
    stepCounter++;
    direction = nextDirection;
    [x,y] = move(x,y,nextDirection);
  }
  console.log('route is ', route.join());
  const pattern = findRepeat(route.join());
  console.log(pattern)
}
const trim = str => str.replace(/^,|,$/g, '')
const withinRange = (limit, arr) => arr.filter(l => l.length).every(l => l.length <=20);
const p = 'L,10,R,12,R,12,R,6,R,10,L,10,L,10,R,12,R,12,R,10,L,10,L,12,R,6,R,6,R,10,L,10,R,10,L,10,L,12,R,6,R,6,R,10,L,10,R,10,L,10,L,12,R,6,L,10,R,12,R,12,R,10,L,10,L,12,R,6';

const findRepeat = (path, limitA=15, limitB=13, limitC=20) => {
  console.log('findRepeat', limitA, limitB)
  const repeatA = trim(path.slice(0, limitA));
  const remainA = path.replace(new RegExp(repeatA, 'g'), 'A');
  if (/^[ABC,]*$/.test(remainA)) {
    return [remainA, repeatA];
  }

  const repeatB = remainA.match(/[LR][^A]+(?=,)/)[0].slice(0, limitB);
  const remainB = remainA.replace(new RegExp(repeatB, 'g'), 'B');
  if (/^[ABC,]*$/.test(remainB)) {
    return [remainB, repeatA, repeatB];
  }

  const repeatC = remainB.match(/[LR][^AB]+(?=,)/)[0];
  const remainC = remainB.replace(new RegExp(repeatC, 'g'), 'C');
  if (/^[ABC,]*$/.test(remainC)) {
    return [repeatA, repeatB, repeatC, remainC];
  }
  console.log([remainC, repeatA, repeatB, repeatC])
  return undefined;
}

const findRepeatLoop = (path, limit=20) => {
  let repeat, a=limit, b=limit;
  do {
    repeat = findRepeat(path, a, b--)
    if (repeat) break;
    if (b==10) {
      a--;
      b = limit;
    }
  } while (a>10 && b>10);

  return repeat;
    
}
console.log(findRepeatLoop(p));


const main = () => {
  const res = run([], input, 'test1');
//  const res = run([...toAscii(moves), ...toAscii(A), ...toAscii(B), ...toAscii(C), 110, 10], input, 'test1');
//  console.log(JSON.stringify(res[0]));
  
}
// L: 76.
// R: 82
const toAscii = str => str.split('').map(d => (d.charCodeAt(0))).concat([10]);
const moves = 'A,B,A,C,B,C,B,C,A,C'
const A = 'L,10,R,12,R,12';
const B = 'R,6,R,10,L,10';
const C = 'R,10,L,10,L,12,R,6';

//main()
logger.result('final answer')
//console.log(map);

//console.log(toAscii(A))

// 2804 fail
// 6544664465446744664467446644674465446710 fail