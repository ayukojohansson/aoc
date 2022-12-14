const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

const posToXY = pos => pos.split(',').map(d=>parseInt(d,10))

const main = (str, isPart1 = false) => {
  const map = {};
  let maxY = 0;
  const printMap = () => {
    for (let y=0; y<=maxY+2;y++) {
      const buff = [];
      for (let x=200; x<800; x++) {
        buff.push(map[`${x},${y}`] || '.')
      }
      console.log(buff.join(''))
    }
  }
  
  // plot map
  str.split('\n').forEach(line => {
    const points = line.split(' -> ').map(posToXY);
    let index = 1;
    let [x,y] = points[index-1];
    while (index < points.length) {
      const [cx,cy] = points[index];
      const [dirx, diry] = [cx-x, cy-y];
      if (dirx == 0) {
        const inc = diry > 0 ? +1 : -1;
        let t=y;
        while(t!==cy) {
          map[`${x},${t}`] = '#';
          t=t+inc
          map[`${x},${t}`] = '#';
        }
      }
      if (diry == 0) {
        const inc = dirx > 0 ? +1 : -1;
        let t=x;
        while(t!==cx) {
          map[`${t},${y}`] = '#';
          t=t+inc
          map[`${t},${y}`] = '#';
        }
      }
      index++
      x=cx,y=cy
      if (maxY < cy)  {
        maxY = cy;
      }
    }
  })

  // fill the horizon
  for (let x=0; x<1000; x++) {
    map[`${x},${maxY+2}`] = '#'
  }

  const fall = ([x,y]) => {
    if (isPart1 && y > maxY) return false;

    const next = [[x,y+1], [x-1,y+1], [x+1,y+1]].find(([tx,ty]) => map[`${tx},${ty}`] == undefined);

    if (next) {
      return fall(next);
    } else {
      if (map[`${x},${y}`] == 'o') {
        // when reaching top
        return false;
      }

      map[`${x},${y}`] = 'o'
      return true;
    }
  }
  
  const start = [500,0]
  let settled = true;
  let unit = 0;
  while (settled) {
    settled = fall(start);
    unit++
  }
  console.log('unit', unit-1)
  printMap();
}



main(test, true)
main(input, true)
main(test)
main(input)

