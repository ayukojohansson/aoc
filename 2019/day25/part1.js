
/*

The image you received is 25 pixels wide and 6 pixels tall.

To make sure the image wasn't corrupted during transmission, the Elves would like you to find the layer that contains the fewest 0 digits. On that layer, what is the number of 1 digits multiplied by the number of 2 digits?
*/
const rlp = require('readline');

const rl = rlp.createInterface({
  input: process.stdin,
  output: process.stdout
});

function command() {
  return new Promise((resolve, reject) => {
    rl.question('Enter command: ', (input) => resolve(input) );
  });
}
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
const toAscii = str => str.split('').map(d => (d.charCodeAt(0))).concat([10]);

const run = async (INPUT, intruction, name) => {
  const setValue = write(intruction);
  var OUTPUT = [];

  let opcode = intruction[0], toStore;
  let index = 0;
  let relativebase = 0;
  let shouldHalt = false;
  let message;
  let choises = {};
  let lastLocation;
  let inventory = [];
  const manual = [
    'west',
    'south',
    'south',
    'south',
//    'take asterisk',
    'north',
    'north',
    'north',
    'west',
    'west',
    'west',
    'take dark matter',
    'east',
    'south',
    'take fixed point',
    'west',
    'take food ration',
    'east',
    'north',
    'east',
    'south',
    'take astronaut ice cream',
    'south',
    'take polygon',
    'east',
    'take easter egg',
    'east',
    'take weather machine',
    'north',
    'north',
    'inv'
  ];
  const items = [
    'polygon',
    'fixed point',
    'easter egg',
    'dark matter',
    'food ration',
    'astronaut ice cream',
    'weather machine'
  ];
//  for (var i=0; i< 4; i++) {
//    manual.push(
//      `drop ${items[i]}`
//    );
//    for (var j=i+1; j< 5; j++) {
//      manual.push(
//        `drop ${items[j]}`
//      );
//      for (var k=j+1; k< 6; k++) {
//        manual.push(
//          `drop ${items[k]}`
//        )
//        for (var l=k+1; l< 7; l++) {
//          manual.push(
//            `drop ${items[l]}`,
//            'north',
//            `take ${items[l]}`
//          );
//        }
//        manual.push(
//          `take ${items[k]}`
//        )
//      }
//      manual.push(
//        `take ${items[j]}`
//      )
//    }
//    manual.push(
//      `take ${items[i]}`
//    );
//  }
  manual.push(...items.map(i => `drop ${i}`));
  for (var i=0;i<4;i++) {
    manual.push(`take ${items[i]}`);
    for (var j=i+1;j<5;j++) {
      manual.push(`take ${items[j]}`);
      for (var k=j+1;k<6;k++) {
        manual.push(`take ${items[k]}`);
          for (var l=k+1;l<7;l++) {
          manual.push(
            `take ${items[l]}`,
            'inv',
            'north',
            `drop ${items[l]}`
          );
        }
        manual.push(`drop ${items[k]}`);
      }
      manual.push(`drop ${items[j]}`);
    }
    manual.push(`drop ${items[i]}`);
  }
  const getInput = async () => {
//    let msg = message.split('\n').filter(s => s.length > 0);
//    if (msg.length == 0) {
//      return;
//    }
//    let commands = [];
//    let move = false, take = false;
//   
//    const location = lastLocation || msg.shift().match(/==\s(.*)\s==/)[1];
//    lastLocation = null;
//  
//    if (!choises[location] || !choises[location].length) {
//      choises[location] = [];
//      while (msg.length) {
//        const line = msg.shift();
//        if (line.includes('Doors here lead')) {
//          move = true;
//        } else if (line.includes('Items here')) {
//          take = true;
//          move = false;
//        } else if (line.includes('- ')) {
//          if (move) {
//            choises[location].push(line.replace('- ', ''));
//          }
//          if (take && line.indexOf('infinite loop') == -1) {
//            choises[location].push(`take ${line.replace('- ', '')}`);
//          }        
//        } else {
//          move = false;
//          take = false;
//        }
//      }
//    }
//    console.log('possible choices', location, choises[location]);
//    const action = choises[location].shift();
//    console.log('action to take', action);
//    if (action.includes('take')) {
//      lastLocation = location;
//      inventory.push(action);
//    }
    const action = manual.length ? manual.shift() : await command();
//    const action = await command();
    console.log('action is', action)
    INPUT.push(
      ...toAscii(action)
    );
  }
  

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
        if (!INPUT.length) {
          message = String.fromCharCode(...OUTPUT);
          OUTPUT = [];
          console.log(message);
          await getInput();
        }
        toStore = INPUT.shift();
        setValue(mode1, index+1, toStore, relativebase);
        index += 2;
        break;
      case 4:
        toStore = params[0];
        OUTPUT.push(toStore);
//        logger.debug(name, 'OUTPUT', OUTPUT);
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
  console.log(String.fromCharCode(...OUTPUT));
  return [OUTPUT, intruction];
};

logger.result('final answer', run([], input, 'test1'));
//console.log('final answer', run([], test2, 'test2'));
//console.log('final answer', run([], test3, 'test3'));
//logger.result('final answer2', run([1], input, 'hej'));

//1205 fail
// 3601950151
//3601950151