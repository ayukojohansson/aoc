const fs = require('fs');
const realInput = fs.readFileSync('./input.txt', 'utf8');

const testInput = `.|...#....
|.-.#.....
.....|-...
........|.
..........
.........#
..../.##..
.-.-/..|..
.|....-|.#
..//.|....`;

const cache = new Set();
const energized = new Set();

const beam = (x,y,vx,vy, map) => {
  if (cache.has(`${x},${y},${vx},${vy}`)) {
    return map;
  } else {
    cache.add(`${x},${y},${vx},${vy}`)
    const nextTile = map.get(`${x+vx},${y+vy}`);
    if (!nextTile) {
      return map;
    }
    energized.add(`${x+vx},${y+vy}`);
    switch (nextTile.tile) {
      case '.':
        beam(x+vx, y+vy, vx, vy, map);
        break;
      case '/':
        if (vx == 1) {
          beam(x+vx, y+vy, 0, -1, map);
        } else if (vx == -1) {
          beam(x+vx, y+vy, 0, 1, map);
        }  else if (vy == 1) {
          beam(x+vx, y+vy, -1, 0, map);
        } else if (vy == -1) {
          beam(x+vx, y+vy, 1, 0, map);
        }
        break;
      case '#':
        // this is \
        if (vx == 1) {
          beam(x+vx, y+vy, 0, 1, map);
        } else if (vx == -1) {
          beam(x+vx, y+vy, 0, -1, map);
        }  else if (vy == 1) {
          beam(x+vx, y+vy, 1, 0, map);
        } else if (vy == -1) {
          beam(x+vx, y+vy, -1, 0, map);
        }
        break;

      case '-':
        if (vy == 0) {
          beam(x+vx, y+vy, vx, vy, map);
        } else {
          beam(x+vx, y+vy, -1, 0, map);
          beam(x+vx, y+vy, 1, 0, map);
        }
        break;

      case '|':
        if (vx == 0) {
          beam(x+vx, y+vy, vx, vy, map);
        } else {
          beam(x+vx, y+vy, 0, 1, map);

          beam(x+vx, y+vy, 0, -1, map);
        }
        break;

    }
  }
};

const main = (input) => {
  cache.clear();
  const tiles = input.split('\n').reduce((map, line, y) => {
    line.split('').forEach((d, x) => {
      map.set(`${x},${y}`, { x, y, tile: d, energized: false });
    });
    return map;
  }, new Map());
  // print(tiles)
  
  beam(-1,0,1,0,tiles);
  // print(tiles)
  console.log(energized.size);

};

const main2 = (input) => {

  const lines = input.split('\n');
  const tiles = lines.reduce((map, line, y) => {
    line.split('').forEach((d, x) => {
      map.set(`${x},${y}`, { x, y, tile: d, energized: false });
    });
    return map;
  }, new Map());
  
  let max = 0;

  //top -> down
  for (let a=0; a<lines.length; a++) {
    cache.clear();
    energized.clear()
    beam(a, -1, 0, 1, tiles);
    const count = energized.size;
    if (count > max) {
      max = count;
    }
  }

  // bottom -> top
  for (let a=0; a<lines.length; a++) {
    cache.clear();
    energized.clear()
    beam(a, lines.length, 0, -1, tiles);
    const count = energized.size;
    if (count > max) {
      max = count;
    }
  }

  // left -> right
  for (let a=0; a<lines.length; a++) {
    cache.clear();
    energized.clear()
    beam(-1, a, 1, 0, tiles);
    const count = energized.size;
    if (count > max) {
      max = count;
    }
  }

  // right -> left
  for (let a=0; a<lines.length; a++) {
    cache.clear();
    energized.clear()
    beam(lines.length, a, -1, 0, tiles);
    const count = energized.size;
    if (count > max) {
      max = count;
    }
  }
  console.log(max);

}

main(testInput)
main(realInput)

main2(testInput);
main2(realInput);