const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

const main = (input, size, is3D) => {
  const blocks = input.split('\n\n');

  const map = new Map();
  let start, last= [];
  blocks[0].split('\n').forEach((line, y) => {
    line.split('').forEach((d, x) => {
      if (d=='.' || d=='#') {
        if (d=='.' && !start) start = [x,y];
        map.set(`${x},${y}`, { isWall: d == '#', relativeX: x%size, relativeY: y%size });
      }
    })
    if (!last[0] || last[0] < line.length) {
      last[0] = line.length-1
    }
    last[1] = y;
  });

  const path = blocks[1].match(/(\d+|R|L)/g);
  
  const dir = [
    [1,0],
    [0,1],
    [-1,0],
    [0,-1]
  ];
  
  let dirIndex = 0;
  let curr=start;
  
  const findNext2D = (pos, index) => {
    const direction = dir[index];
    let nextX = pos[0] + direction[0];
    let nextY = pos[1] + direction[1];
    let next = map.get(`${nextX},${nextY}`);
    if (!next) {
      nextX = direction[0] == 0 ? pos[0] : direction[0] > 0 ? 0 : last[0]
      nextY = direction[1] == 0 ? pos[1] : direction[1] > 0 ? 0 : last[1]

      next = map.get(`${nextX},${nextY}`);
      while (!next) {
        nextX += direction[0];
        nextY += direction[1];
        next = map.get(`${nextX},${nextY}`);
      }
    }
    return [nextX, nextY, index];
  }

  const findNext3D = (pos, index) => {
    const direction = dir[index];
    let nextDirIndex = index;
    let nextX = pos[0] + direction[0];
    let nextY = pos[1] + direction[1];
    if (!map.has(`${nextX},${nextY}`)) {
      if (dirIndex == 0) { // right
        if (nextY >= 150) {
          nextX = 50 + map.get(`${pos[0]},${pos[1]}`).relativeY;
          nextY = 149;
          nextDirIndex = 3;
        } else if (nextY >= 100) {
          nextX = 149;
          nextY = 49 - map.get(`${pos[0]},${pos[1]}`).relativeY;
          nextDirIndex = 2;  
        } else if (nextY >= 50) {
          nextX = 100 + map.get(`${pos[0]},${pos[1]}`).relativeY;
          nextY = 49;
          nextDirIndex = 3;  
        } else {
          nextX = 99;
          nextY = 149 - map.get(`${pos[0]},${pos[1]}`).relativeY;
          nextDirIndex = 2;
        }
      } else if (dirIndex == 2) { //left
        if (nextY >= 150) {
          nextX = 50 + map.get(`${pos[0]},${pos[1]}`).relativeY;
          nextY = 0;
          nextDirIndex = 1;
        } else if (nextY >= 100) {
          nextX = 50;
          nextY = 49 - map.get(`${pos[0]},${pos[1]}`).relativeY;
          nextDirIndex = 0;  
        } else if (nextY >= 50) {
          nextX = map.get(`${pos[0]},${pos[1]}`).relativeY;
          nextY = 100;
          nextDirIndex = 1;  
        } else {
          nextX = 0;
          nextY = 149 - map.get(`${pos[0]},${pos[1]}`).relativeY;
          nextDirIndex = 0;
        }
      } else if (dirIndex == 1) { //down
        if (nextY >= 200) {
          nextX = 100 + map.get(`${pos[0]},${pos[1]}`).relativeX;
          nextY = 0;
          nextDirIndex = 1;
        } else if (nextY >= 100) {
          nextX = 49;
          nextY = 150 + map.get(`${pos[0]},${pos[1]}`).relativeX;
          nextDirIndex = 2;  
        } else if (nextY >= 50) {
          nextX = 99;
          nextY = 50 + map.get(`${pos[0]},${pos[1]}`).relativeX;
          nextDirIndex = 2;  
        }
      } else if (dirIndex == 3) { //up
        if (nextX >= 100) {
          nextX = map.get(`${pos[0]},${pos[1]}`).relativeX;
          nextY = 199;
          nextDirIndex = 3;
        } else if (nextX >= 50) {
          nextX = 0;
          nextY = 150 + map.get(`${pos[0]},${pos[1]}`).relativeX;
          nextDirIndex = 0;  
        } else {
          nextX = 50;
          nextY = 50 + map.get(`${pos[0]},${pos[1]}`).relativeX;
          nextDirIndex = 0;  
        }
      }
      
    }
    return [nextX, nextY, nextDirIndex]
  }
  
  const findNext = is3D ? findNext3D : findNext2D;
    
  const move = (step) => {
    while (step > 0) {
      const [nextX, nextY, nextDirIndex] = findNext(curr, dirIndex);
      let next = map.get(`${nextX},${nextY}`);

      if (next.isWall) {
        return;
      }
      curr = [nextX, nextY];
      dirIndex = nextDirIndex;
      step--;
    };
    return;
  }

  while (path.length) {
    const com = path.shift();
    switch (com) {
      case 'R':
        dirIndex = (dirIndex+1)%4;
        break;
      case 'L':
        dirIndex = (dirIndex+3)%4;
        break;
      default:
        const step = parseInt(com, 10);
        move(step);
    }
  }
  console.log('ended at', curr)
  console.log('answer is', (curr[0] +1)*4 + (curr[1]+1)*1000 + dirIndex)

}

//main(test,4)
main(input,50, false)
main(input,50, true)



