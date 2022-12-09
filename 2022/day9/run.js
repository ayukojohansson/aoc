const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;
const test2 =`R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

const moveKnot = (head, tail) => {
  const diff0 = head[0] - tail[0];
  const diff1 = head[1] - tail[1];

  if (diff1 == 0 && Math.abs(diff0) == 2){
      tail[0] += diff0 > 0 ? +1 : -1;
  } else if (diff0 == 0 && Math.abs(diff1) == 2){
      tail[1] += diff1 > 0 ? +1 : -1;
  } else if (Math.abs(diff0) == 2 || Math.abs(diff1) == 2) {
    tail[0] += diff0 > 0 ? +1 : -1;
    tail[1] += diff1 > 0 ? +1 : -1;
  }
}

const main = (str, size=2) => {
  const lines = str.split('\n');
  const visited = new Set(['0,0']);
  const tail = size - 1;

  let knots = Array(size);
  knots[0] = [0,0];

  for (let l=0; l< lines.length; l++) {
    const [dir, step] = lines[l].split(' ');
    for (let s=0; s<step; s++) {
      switch (dir) {
        case 'R':
          knots[0][0] += 1;
          break;
        case 'L':
          knots[0][0] -= 1;
          break;
        case 'U':
          knots[0][1] += 1;
          break;
        case 'D':
          knots[0][1] -= 1;
          break;
      }
      
      for (let t=1; t<size; t++) {
        if (!knots[t]) knots[t] = [0,0]; // initialize first time

        moveKnot(knots[t-1], knots[t]);
      }
      visited.add(`${knots[tail][0]},${knots[tail][1]}`)
    }
  }
  console.log(visited.size)
}

main(test, 2)
main(input, 2)
main(test2, 10)
main(input, 10)


