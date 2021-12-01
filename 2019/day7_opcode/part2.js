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

const getInstruction = n => {
  var str = `000000${n}`.slice(-5);
  const opCode = parseInt(str.slice(-2), 10);
  const mode1 = parseInt(str.slice(-3,-2), 10);
  const mode2 = parseInt(str.slice(-4,-3), 10);
  const mode3 = parseInt(str.slice(-5,-4), 10);
  return { opCode, mode1, mode2, mode3 };
}

const getValue = (mode, param, insruction) =>
  (mode ? insruction[param] : insruction[insruction[param]]);

const setValue = (mode, param, toStore, insruction) => {
  insruction[insruction[param]] = toStore;
};

const delay = (name) => {
  return new Promise(resolve => {
//  console.log(name, 'waiting');
    setTimeout(() => {
      resolve();
    }, 100);
  });
};

const waitUntilInputExist = async (input, name) => {
  while (!input.length)
    await delay(name);
};

const run = async (INPUT, insruction, outputArray, name) => {
  var OUTPUT;

  let opcode = insruction[0], increase, toStore;
  let index = 0;

  while (opcode) {
    const { opCode, mode1, mode2, mode3 } = getInstruction(opcode);
//    console.log(name, opcode, mode1, mode2, mode3, insruction)

    if (opCode == 1) {
      toStore = getValue(mode1, index+1, insruction) + getValue(mode2, index+2, insruction);
      setValue(mode3, index+3, toStore, insruction);
      index += 4;
    } else if (opCode == 2) {
      toStore = getValue(mode1, index+1, insruction) * getValue(mode2, index+2, insruction);
      setValue(mode3, index+3, toStore, insruction);
      index += 4
    } else if (opCode == 3) {
      await waitUntilInputExist(INPUT, name);

      toStore = INPUT.shift();
//      console.log(name, 'INPUT used', toStore, INPUT);
      setValue(mode3, index+1, toStore, insruction);
      index += 2;
    }  else if (opCode == 4) {
      OUTPUT = getValue(mode1, index+1, insruction);
//      console.log(name, 'OUTPUT', OUTPUT);
      outputArray.push(OUTPUT);
      index += 2;
    } else if (opCode == 5) {
      if (getValue(mode1, index+1, insruction) !== 0) {
        index = getValue(mode2, index+2, insruction);
      } else {
        index += 3;
      }
    } else if (opCode == 6) {
      if (getValue(mode1, index+1, insruction) == 0) {
        index = getValue(mode2, index+2, insruction);
      } else {
        index += 3;
      }
    } else if (opCode == 7) {
      toStore = (getValue(mode1, index+1, insruction) < getValue(mode2, index+2, insruction))
        ? 1 : 0;
      setValue(mode3, index+3, toStore, insruction);
      index += 4;
    }  else if (opCode == 8) {
      toStore = (getValue(mode1, index+1, insruction) == getValue(mode2, index+2, insruction))
        ? 1 : 0;
      setValue(mode3, index+3, toStore, insruction);
      index += 4;
    } else if (opCode == 99) {
//      console.log('STOP', insruction);
      break;
    }

    opcode = insruction[index];
  }
//  console.log(name, 'done');
  return [OUTPUT, insruction];
};

const main = (sequence) => new Promise(resolve => {
  const [A, B, C, D, E] = sequence;
  const inputA = [A, 0], inputB =[B], inputC=[C], inputD=[D], inputE=[E];
  run(inputA, input.slice(0), inputB, 'A').catch(console.log);
  run(inputB, input.slice(0), inputC, 'B').catch(console.log);
  run(inputC, input.slice(0), inputD, 'C').catch(console.log);
  run(inputD, input.slice(0), inputE, 'D').catch(console.log);
  run(inputE, input.slice(0), inputA, 'E').then(res => {
//    console.log('E done', res);
    return resolve(res[0]);
  }).catch(console.log);
});

const getCombinations = arr => {
  if (arr.length == 1) {
    return [arr];
  }
  else {
    return arr.reduce((result, focus, i) => {
      const remaining = arr.slice(0); // copy
      remaining.splice(i, 1);

      return result.concat(
        getCombinations(remaining).map(item => [focus, ...item]));
    }, []);
  }
}

const getCombinations2 = async (arr, base, result) => {
  if (arr.length == 1) {
    // run main here
    const comb = base.concat(arr);
    const output = await main(comb);
    console.log('got result', comb, output);
    result.push({ comb, output });
  }
  else {
    for(var i=0; i < arr.length; ++i) {
      const copy = arr.slice(0);
      const focus = copy.splice(i, 1);
      await getCombinations2(copy, base.concat(focus), result);
    }
  }
}
const res = [];
//getCombinations2([9,8,7,6,5], [], res).then(() => console.log('result:', res));


const findMax = () => {
  const compinations = getCombinations([9,8,7,6,5]);
  return compinations.reduce(async (sum, comb) => {
    console.log('checking comb', comb)
    const output = await main(comb);

    const { max, seq } = await sum;
    console.log('comparing, sum and output', max, output);

    if (output > max) return { max: output, seq: comb };
    else return { max, seq };

  }, { max:0, seq: undefined })
}

const getMax = arr => arr.reduce((max, value) => (max < value ? value : max));

findMax().then(res => {
  console.log('result', res);
});

//answer 2645740



