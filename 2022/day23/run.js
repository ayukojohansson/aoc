const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `.....
..##.
..#..
.....
..##.
.....`;

const test2 = `..............
..............
.......#......
.....###.#....
...#...#.#....
....#...##....
...#.###......
...##.#.##....
....#..#......
..............
..............
..............`;

const main = (input, maxRound) => {
  let elfs = new Set();
  
  input.split('\n').forEach((line, y) => {
    line.split('').forEach((d, x) => {
      if (d=='#') {
        elfs.add(`${x},${y}`);
      }
    })
  });
  
  const getPos = (x,y, dir) => {
    switch (dir) {
      case 'N':
        return `${x},${y-1}`;
      case 'S':
        return `${x},${y+1}`;
      case 'W':
        return `${x-1},${y}`;
      case 'E':
        return `${x+1},${y}`;
    }
  }
  const allClear = (x,y) => {
    return !elfs.has(`${x-1},${y-1}`) && !elfs.has(`${x},${y-1}`) && !elfs.has(`${x+1},${y-1}`)
      && !elfs.has(`${x-1},${y}`) && !elfs.has(`${x+1},${y}`)
      && !elfs.has(`${x-1},${y+1}`) && !elfs.has(`${x},${y+1}`) && !elfs.has(`${x+1},${y+1}`);
  }
  const isClear = (x,y, dir) => {
//    console.log('isclear', x,y,dir)
//    console.log(!elfs.has(`${x-1},${y-1}`) && !elfs.has(`${x},${y-1}`) && !elfs.has(`${x+1},${y-1}`))
    switch (dir) {
      case 'N':
        return !elfs.has(`${x-1},${y-1}`) && !elfs.has(`${x},${y-1}`) && !elfs.has(`${x+1},${y-1}`);
      case 'S':
        return !elfs.has(`${x-1},${y+1}`) && !elfs.has(`${x},${y+1}`) && !elfs.has(`${x+1},${y+1}`);
      case 'W':
        return !elfs.has(`${x-1},${y-1}`) && !elfs.has(`${x-1},${y}`) && !elfs.has(`${x-1},${y+1}`);
      case 'E':
        return !elfs.has(`${x+1},${y-1}`) && !elfs.has(`${x+1},${y}`) && !elfs.has(`${x+1},${y+1}`);
    }
  }
  const getSuggestion = (elf, index) => {
    const [x,y] = elf.split(',').map(d=>parseInt(d,10));
    if (allClear(x,y)) return elf;
    let i = index;
    while (!isClear(x,y, directions[i%4]) && i < index+4) {
      i++;
    }
//    console.log('getSuggestion', elf, directions[i%4], i, index)
    return i == index+4 ? elf : getPos(x, y, directions[i%4]);
  }
  let directions = ['N', 'S', 'W', 'E'];
  let dirIndex = 0;
  let hasMoved = true;
  let round = 1;
  while (hasMoved) {
    hasMoved=false;
    const moves = new Map();
    for (const elf of elfs) {
      const suggestion = getSuggestion(elf, dirIndex);
      moves.set(suggestion, [
        ...(moves.get(suggestion) || []),
        elf
      ])
    }
    const newElfs = new Set();
    for (const [pos, candidates] of moves) {
      if (candidates.length == 1) {
        newElfs.add(pos);
        if (candidates[0] !== pos) hasMoved = true;
      } else {
        candidates.forEach(c => {
          newElfs.add(c);
        })
      }
    }
    elfs = newElfs;
    round++;
    dirIndex = (dirIndex+1)%4;
    
    if (round > maxRound) {
      break;
    }
  }
  
  let minX, minY, maxX, maxY;
  for (const elf of elfs) {
    const [x,y] = elf.split(',').map(d=>parseInt(d,10));
    if (minX == undefined) {
      minX = x;
      minY = y;
      maxX = x;
      maxY = y;
    }
    if (minX > x) minX = x;
    if (minY > y) minY = y;
    if (maxX < x) maxX = x;
    if (maxY < y) maxY = y;
  }
  for (let y=minY;y<=maxY;y++) {
    let buff = '';
    for (let x=minX;x<=maxX;x++) {
      buff += elfs.has(`${x},${y}`) ? '#' : '.';
    }
    console.log(buff)
  }
  console.log('round is', round-1)
  console.log('answer is', (maxY-minY+1)*(maxX-minX+1) - elfs.size)
}

main(test2, 10)
main(input, 10)
main(test2)
main(input)



