const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const makeMap = (str) => str.split('\n').reduce((m, line, y) => {
  line.split('').forEach((s, x) => {
    if (s === 'S') {
      m[`${x},${y}`] = {
        height: 'a'.charCodeAt(0),
        s: 'a',
        x,
        y,
        start: true
      }
      start = `${x},${y}`;
    }
    else if (s === 'E') {
      m[`${x},${y}`] = {
        height: 'z'.charCodeAt(0),
        s,
        x,
        y,
        end: true
      }
      end = `${x},${y}`;

    }
     else {
       m[`${x},${y}`] = {
        height: s.charCodeAt(0),
        s,
        x,
        y
      }
     }
  })
  return m;
}, {});

const main = (str) => {
  const map = makeMap(str);
  const start = Object.keys(map).find(i => map[i].start);
  const end = Object.keys(map).find(i => map[i].end);
  
  const toDo = [start];
  
  while (toDo.length) {
    const currentPos = toDo.pop();
    const {x, y, height, step} = map[currentPos];

    const a = [
      `${x-1},${y}`,
      `${x+1},${y}`,
      `${x},${y-1}`,
      `${x},${y+1}`
    ];
    a.forEach(point => {
      const next = map[point];

      if (
        next
        && (!next.step || next.step > step + 1) 
        && (next.height <= height +1)
      ) {
        next.step = (step || 0) + 1;
        toDo.push(point);
      }
    })
  }
  console.log(map[end].step);
}

const main2 = (str) => {
  const map = makeMap(str);
  
  const end = Object.keys(map).find(i => map[i].end);
  
  const toDo = [end];
  
  while (toDo.length) {
    const currentPos = toDo.pop();
    const {x, y, height, step} = map[currentPos];

    const a = [
      `${x-1},${y}`,
      `${x+1},${y}`,
      `${x},${y-1}`,
      `${x},${y+1}`
    ];
    a.forEach(point => {
      const next = map[point];

      if (
        next
        && (!next.step || next.step > step + 1)
        && (next.height >= height-1)
      ) {
        next.step = (step || 0) + 1;
        toDo.push(point);
      }
    })
  }
  console.log(Object.values(map).reduce((min, p) => {
    return p.s == 'a' && p.step < min ? p.step : min;
  }, 100000))
}

main(test)
main(input)
main2(test)
main2(input)

