
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

//const input = '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99'.split(',').map(s => Number(s));
//const input = '3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9'.split(',').map(s => Number(s));

const getInstruction = n => {
  var str = n.toString();
  const opCode = parseInt(str.slice(-2), 10);
  const mode1 = str.length >= 3 ? parseInt(str.slice(-3,-2), 10) : 0;
  const mode2 = str.length >= 4 ? parseInt(str.slice(-4,-3), 10) : 0;
  const mode3 = str.length >= 5 ? parseInt(str.slice(-5,-4), 10) : 0;
  return { opCode, mode1, mode2, mode3 };
}

const getValue = (mode, param) => (mode ? param : input[param]);
const setValue = (mode, param, toStore) => {
  if (mode) param = toStore;
  else input[param] = toStore;
};

var INPUT=5, OUTPUT;

let opcode = input[0], increase, canFinish =false, toStore;
let index = 0;

while (opcode !== 99) {
  const { opCode, mode1, mode2, mode3 } = getInstruction(opcode);
  console.log(opcode, mode1, mode2, mode3)

  if (opCode == 1) {
    toStore = getValue(mode1, input[index+1]) + getValue(mode2, input[index+2]);
    setValue(mode3, input[index+3], toStore);
    index += 4;
    canFinish = false;
  } else if (opCode == 2) {
    toStore = getValue(mode1, input[index+1]) * getValue(mode2, input[index+2]);
    setValue(mode3, input[index+3], toStore);
    index += 4
    canFinish = false;
  } else if (opCode == 3) {
    toStore = INPUT;
    setValue(mode3, input[index+1], toStore);
    index += 2;
    canFinish = false;
  }  else if (opCode == 4) {
    OUTPUT = getValue(mode1, input[index+1]);
    console.log('OUTPUT', OUTPUT);
    index += 2;
    canFinish = true;
  } else if (opCode == 5) {
    if (getValue(mode1, input[index+1]) !== 0) {
      index = getValue(mode2, input[index+2]);
    } else {
      index += 3;
    }
    canFinish = false;
  } else if (opCode == 6) {
    if (getValue(mode1, input[index+1]) == 0) {
      index = getValue(mode2, input[index+2]);
    } else {
      index += 3;
    }
    canFinish = false;
  } else if (opCode == 7) {
    toStore = (getValue(mode1, input[index+1]) < getValue(mode2, input[index+2]))
      ? 1 : 0;
    setValue(mode3, input[index+3], toStore);
    index += 4;
    canFinish = false;
  }  else if (opCode == 8) {
    toStore = (getValue(mode1, input[index+1]) == getValue(mode2, input[index+2]))
      ? 1 : 0;
    setValue(mode3, input[index+3], toStore);
    index += 4;
    canFinish = false;
  } else if (opCode == 99 && canFinish) {
    console.log('STOP', input);
    break;
  }

  opcode = input[index];
//  console.log(input)
}
