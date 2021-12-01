
/*
1,9,10,70,
2,3,11,0,
99,
30,40,50
Step forward 4 positions to reach the next opcode, 2. This opcode works just like the previous, but it multiplies instead of adding. The inputs are at positions 3 and 11; these positions contain 70 and 50 respectively. Multiplying these produces 3500; this is stored at position 0:

3500,9,10,70,
2,3,11,0,
99,
30,40,50
Stepping forward 4 more positions arrives at opcode 99, halting the program.

Here are the initial and final states of a few more small programs:

1,0,0,0,99 becomes 2,0,0,0,99 (1 + 1 = 2).
2,3,0,3,99 becomes 2,3,0,6,99 (3 * 2 = 6).
2,4,4,5,99,0 becomes 2,4,4,5,99,9801 (99 * 99 = 9801).
1,1,1,4,99,5,6,0,99 becomes 30,1,1,4,2,5,6,0,99.
*/




const fs = require('fs');
const original = fs.readFileSync('./input.txt', 'utf8').split(',').map(s => Number(s));

//const input = '1,1,1,4,99,5,6,0,99'.split(',').map(s => Number(s));

for (let noun = 0; noun < 100; noun++) {
  for (let verb = 0; verb < 100; verb++) {
    const input = original.slice(0);
    input[1] = noun;
    input[2] = verb;

    let index = 0;

    let opcode = input[0];
    index = 0;
    while (opcode !== 99) {
      if (opcode == 1) {
        input[input[index+3]] = input[input[index+1]] + input[input[index+2]];
      } else if (opcode == 2) {
        input[input[index+3]] = input[input[index+1]] * input[input[index+2]];
      } else if (opcode == 99) {
        console.log('end', input);
      }
      index += 4;
      opcode = input[index];
    }

    console.log('end', noun, verb, input);
    if (19690720 === input[0]) {
      console.log('Done', noun, verb);
      throw new Error();
    }
 
}}

