

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
//K)YOU
//I)SAN
//`.trim().split('\n');

const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');

console.log(input);

const getMap = input => input.reduce((m, o) => {
  const [left, right] = o.split(')');
  return Object.assign(m, {[right]: left});
}, {});

const map = getMap(input)
console.log(map);

const getOrbits = (target, map) => {
  let pointer=target;
  let route = [];
  while(map[pointer]!=='COM') {
    pointer = map[pointer];
    route.push(pointer);
    if (!pointer) process.exit();
  }
  return route;
};

const youRoute = getOrbits('YOU', map).reverse();
const santaRoute = getOrbits('SAN', map).reverse();

let youOointer = youRoute.shift();
let santaOointer = santaRoute.shift();
while (youOointer == santaOointer) {
  youOointer = youRoute.shift();
  santaOointer = santaRoute.shift();
  console.log(youOointer, santaOointer)
}

// +2 because it removes too much in while loop
console.log(youRoute.length + santaRoute.length + 2);
