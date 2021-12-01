
/*
Opcode 3 takes a single integer as input and saves it to the address given by its only parameter. For example, the instruction 3,50 would take an input value and store it at address 50.
Opcode 4 outputs the value of its only parameter. For example, the instruction 4,50 would output the value at address 50.


ABCDE
 1002

DE - two-digit opcode,      02 == opcode 2
 C - mode of 1st parameter,  0 == position mode
 B - mode of 2nd parameter,  1 == immediate mode
 A - mode of 3rd parameter,  0 == position mode,
*/

const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8').split(',').map(s => Number(s));

//const input = '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0'.split(',').map(s => Number(s));
//const input = '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0'.split(',').map(s => Number(s));

const getInstruction = n => {
  var str = n.toString();
  const opCode = parseInt(str.slice(-2), 10);
  const mode1 = str.length >= 3 ? parseInt(str.slice(-3,-2), 10) : 0;
  const mode2 = str.length >= 4 ? parseInt(str.slice(-4,-3), 10) : 0;
  const mode3 = str.length >= 5 ? parseInt(str.slice(-5,-4), 10) : 0;
  return { opCode, mode1, mode2, mode3 };
}

const getValue = (mode, param, insruction) => (mode ? insruction[param] : insruction[insruction[param]]);
const setValue = (mode, param, toStore, insruction) => {
  insruction[insruction[param]] = toStore;
};

const getOutput = (INPUT, insruction) => {
  var OUTPUT;

  let opcode = insruction[0], increase, canFinish =false, toStore;
  let index = 0;

  while (opcode) {
    const { opCode, mode1, mode2, mode3 } = getInstruction(opcode);
    console.log(opcode, mode1, mode2, mode3, insruction)

    if (opCode == 1) {
      toStore = getValue(mode1, index+1, insruction) + getValue(mode2, index+2, insruction);
      setValue(mode3, index+3, toStore, insruction);
      index += 4;
      canFinish = false;
    } else if (opCode == 2) {
      toStore = getValue(mode1, index+1, insruction) * getValue(mode2, index+2, insruction);
      setValue(mode3, index+3, toStore, insruction);
      index += 4
      canFinish = false;
    } else if (opCode == 3) {
      toStore = INPUT.shift();console.log('INOUT used', toStore, INPUT);
      setValue(mode3, index+1, toStore, insruction);
      index += 2;
      canFinish = false;
    }  else if (opCode == 4) {
      OUTPUT = getValue(mode1, index+1, insruction);
      console.log('OUTPUT', OUTPUT);
      index += 2;
      canFinish = true;
    } else if (opCode == 5) {
      if (getValue(mode1, index+1, insruction) !== 0) {
        index = getValue(mode2, index+2, insruction);
      } else {
        index += 3;
      }
      canFinish = false;
    } else if (opCode == 6) {
      if (getValue(mode1, index+1, insruction) == 0) {
        index = getValue(mode2, index+2, insruction);
      } else {
        index += 3;
      }
      canFinish = false;
    } else if (opCode == 7) {
      toStore = (getValue(mode1, index+1, insruction) < getValue(mode2, index+2, insruction))
        ? 1 : 0;
      setValue(mode3, index+3, toStore, insruction);
      index += 4;
      canFinish = false;
    }  else if (opCode == 8) {
      toStore = (getValue(mode1, index+1, insruction) == getValue(mode2, index+2, insruction))
        ? 1 : 0;
      setValue(mode3, index+3, toStore, insruction);
      index += 4;
      canFinish = false;
    } else if (opCode == 99 && canFinish) {
      console.log('STOP', insruction);
      break;
    }

    opcode = insruction[index];
  }
  return [OUTPUT, insruction];
}

const main = (sequence) => {
  console.log('input', input)
  const [A, B, C, D, E] = sequence;
  const outputA = getOutput([A, 0], input);
  const outputB = getOutput([B, outputA[0]], input);
  const outputC = getOutput([C, outputB[0]], input);
  const outputD = getOutput([D, outputC[0]], input);
  const outputE = getOutput([E, outputD[0]], input);

  console.log('after E', sequence, outputE);
  return outputE[0];
}

const getCombinations = arr => {
  if (arr.length == 2) {
    const [a, b] = arr;
    return [ [a, b], [b, a] ];
  }
  else {
    return arr.reduce((res, d, i) => {
      const remaining = arr.slice(0);
      remaining.splice(i, 1);
      return res.concat(
        getCombinations(remaining).map(item => [d, ...item]));
    }, []);
  }
}
//console.log(getCombinations([0,1,2,3,4]).length);

const findMax = () => {
  const compinations = getCombinations([0,1,2,3,4]);
  return compinations.reduce(({max, seq}, comb) => {
    const output = main(comb);
    if (output > max) return { max: output, seq: comb };
    else return {max, seq};
  }, { max:0, seq: undefined })
}

console.log(findMax());


