const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

const part1 = (input) => {
  const cubes = input.split('\n').reduce((map, c) => {
    map[c] = c.split(',').map(d=>parseInt(d,10))
    return map
  }, {});
  
  const sum = Object.values(cubes).reduce((s, [cx,cy,cz]) => {
    const visible = [
      `${cx-1},${cy},${cz}`,
      `${cx+1},${cy},${cz}`,
      `${cx},${cy-1},${cz}`,
      `${cx},${cy+1},${cz}`,
      `${cx},${cy},${cz-1}`,
      `${cx},${cy},${cz+1}`,
    ].reduce((s, pos) => s + (cubes[pos] ? 0 : 1), 0);
    return s + visible;
  }, 0)
  console.log(sum)
}

const part2 = (input) => {
  const cubes = input.split('\n').reduce((map, c) => {
    map[c] = c.split(',').map(d=>parseInt(d,10))
    return map
  }, {});
  
  const [mx,my,mz] = Object.values(cubes).reduce((max, [cx,cy,cz]) => {
    if (!cx || cx > max[0]) max[0] = cx
    if (!cy || cy > max[1]) max[1] = cy
    if (!cz || cz > max[2]) max[2] = cz
    return max;
  }, [0,0,0])
  
  const djik = {};
  const toDo = [[-1,-1,-1, 0]];
  while (toDo.length) {
    const [cx,cy,cz, step] = toDo.pop();
    [
      [cx-1,cy,cz],
      [cx+1,cy,cz],
      [cx,cy-1,cz],
      [cx,cy+1,cz],
      [cx,cy,cz-1],
      [cx,cy,cz+1],
    ].forEach(([x,y,z]) => {
      if (
        cx > mx+2 || cx < -1 ||
        cy > my+2 || cy < -1 ||
        cz > mz+2 || cz < -1 
      ) {
        // out of range
      } else {
        const pos = `${x},${y},${z}`;
        if (!cubes[pos] && (djik[pos] == undefined || djik[pos] > step + 1)) {
          djik[pos] = step+1;
          toDo.push([x,y,z, step+1]);
        }
      }
    })
  }
  
  const sum = Object.values(cubes).reduce((s, [cx,cy,cz]) => {
    const visible = [
      `${cx-1},${cy},${cz}`,
      `${cx+1},${cy},${cz}`,
      `${cx},${cy-1},${cz}`,
      `${cx},${cy+1},${cz}`,
      `${cx},${cy},${cz-1}`,
      `${cx},${cy},${cz+1}`,
    ].reduce((s, pos) => {
      return s + (djik[pos] == undefined ? 0 : 1);
    }, 0);
    
    return s + visible;
  }, 0)

  console.log(sum)
}

part1(test)
part1(input)
part2(test)
part2(input)


