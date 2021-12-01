

/*

COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L

*/

const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');

//const input =`
//COM)B
//B)C
//C)D
//D)E
//E)F
//B)G
//G)H
//D)I
//E)J
//J)K
//K)L
//`.trim().split('\n');

console.log(input);

const getMap = input => input.reduce((m, o) => {
  const [left, right] = o.split(')');
  return Object.assign(m, {[right]: left});
}, {});

const map = getMap(input)
console.log(map);

const getOrbits = (target, map) => {
  let pointer=target;
  let count =1;
  while(map[pointer]!=='COM') {
    pointer = map[pointer];
    count++;
    console.log('pointer', pointer);
    if (!pointer) process.exit();
  }
  return count;
};

//console.log(getOrbits('L', map))

const getAllOrbits = map => Object.keys(map).reduce((total, orbit) => {
  console.log(orbit)
  return total + getOrbits(orbit, map);
}, 0);

console.log(getAllOrbits(map))