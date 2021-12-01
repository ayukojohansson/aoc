const ascii = can => {
  console.clear();
  const [minX, minY, maxX, maxY] = Object.keys(can).reduce(([x0, y0, x1, y1], dot) => {
    const [x,y] = dot.split(',').map(Number);
    return [
      x<x0 ? x: x0,
      y<y0 ? y: y0,
      x>x1 ? x: x1,
      y>y1 ? y: y1,
    ];
  }, [0,0,0,0]);
  const width = maxX - minX +1;
  const height = maxY - minY +1;

  const painted = Object.keys(can).reduce((c, pos) => {
    const [x,y] = pos.split(',').map(Number);
    
    c[(x - minX) + width * (y - minY)] = can[pos];
    return c;
  }, Array((width) * (height)).fill({ status: '.'}));

  console.log('\n')
  while (painted.length) {
    logger.result(
      painted.splice(0,width)
        .map(d => d.step ==0 ? 'S' : d.status=='WALL' ? '#': d.status=='OPEN' ? ' ': d.status)
        .join('')
    );
  }
}

const logger = {
  log: (...args) => console.log('INFO:', ...args),
  error: (...args) => console.log('\x1b[41m', 'ERROR:', ...args, "\x1b[0m"),
  result: (...args) => console.log('\x1b[32m', 'RESULT:', ...args, "\x1b[0m"),
  debug: (...args) => process.env.debug == 'true' && console.log('DEBUG:',...args),
};

const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const parseInput = input => {
  let arr = [], mapR = {};
  const map = input.split('\n').reduce((map, line, y) => {
    line.split('').forEach((d, x) => {
      map[`${x},${y}`] = {
        status: d,
        isWall: d == '#',
        isOpen: d== '.',
      };
      if (/[A-Z]/.test(d)) {
        arr.push([x, y, d]);
      }
    })
    return map;
  }, {});

  const getStatus = (x, y) => map[`${x},${y}`];
  
  arr.forEach(p => {
    console.log(p)
    const [x, y, status] = p;
    const down = getStatus(x, y+1);
    const up = getStatus(x, y-1);

    if (down && down.isOpen) {
      const name = `${up.status}${status}`;
      if (mapR[name]) {
        map[`${x},${y+1}`].isPortal = name;
        mapR[`${name}1`] = [x, y+1];
      } else {
        map[`${x},${+y+1}`].isPortal = `${name}1`;
        mapR[name] = [x, y+1];
      }
      return;
    } else if (up && up.isOpen) {
      const name = `${status}${down.status}`
      if (mapR[name]) {
        map[`${x},${y-1}`].isPortal = name;
        mapR[`${name}1`] = [x, y-1];
      } else { 
        map[`${x},${y-1}`].isPortal = `${name}1`;
        mapR[name] = [x, y-1];
      }
      return;
    }

    const left = getStatus(x-1, y);
    const right = getStatus(x+1, y);
    if (left && left.isOpen) {
      const name = `${status}${right.status}`;
      if (mapR[name]) {
        map[`${x-1},${y}`].isPortal = name;
        mapR[`${name}1`] = [x-1, y];
      } else { 
        map[`${x-1},${y}`].isPortal = `${name}1`;
        mapR[name] = [x-1, y];
      }
      return;
    } else if (right && right.isOpen) {
      const name = `${left.status}${status}`;
      if (mapR[name]) {
        map[`${x+1},${y}`].isPortal = name;
        mapR[`${name}1`] = [x+1, y];
      } else {
        map[`${x+1},${y}`].isPortal = `${name}1`;
        mapR[name] = [x+1, y];
      }
      return;
    }
  });
  return [map, mapR];
};

  
const findNearest = (originalMap, x, y, mapR) => {
  const airMap = {};
  const possible = [];

  const getStatus = (x, y) => originalMap[`${x},${y}`];

  const fillAirAt = (x, y, time) => {
//    console.log('fill air', x, y, time )
    const s = getStatus(x,y);
    if (!s) return;
    if (!s.isOpen && !s.isPortal) {
      return;
    }

    if (airMap[`${x},${y}`] !== undefined) {
      if (airMap[`${x},${y}`] < time)
        return false;
    }
    airMap[`${x},${y}`] = time;
    return true;

  };

  let toFill = [[x,y]];

  fillAirAt(x,y,0)
  while (toFill.length) {
    // fill around
    const [px,py] = toFill.shift();
    time = airMap[`${px},${py}`] || 0;
    [
      [px-1, py],
      [px+1, py],
      [px, py+1],
      [px, py-1],
    ].forEach(pos => {
      if (fillAirAt(pos[0], pos[1], time+1))
        toFill.push(pos);

      const p = getStatus(pos[0], pos[1]);

      if (p && p.isPortal) {
        const otherPortal = mapR[p.isPortal];
        if (otherPortal && fillAirAt(otherPortal[0], otherPortal[1], time+2)) {
          toFill.push(otherPortal);
        }
      }
    });
  }
  return airMap;
}

const run = (input) => {
  let [map, mapR] = parseInput(input);

  let [x,y] = mapR['AA'];
  const steps = findNearest(map, x, y, mapR);

  const [zx,zy] = mapR['ZZ'];
  console.log('ZZ', steps[`${zx},${zy}`]);
}

const test1 = `         A           
         A           
  #######.#########  
  #######.........#  
  #######.#######.#  
  #######.#######.#  
  #######.#######.#  
  #####  B    ###.#  
BC...##  C    ###.#  
  ##.##       ###.#  
  ##...DE  F  ###.#  
  #####    G  ###.#  
  #########.#####.#  
DE..#######...###.#  
  #.#########.###.#  
FG..#########.....#  
  ###########.#####  
             Z       
             Z      `;

const test2 = `                   A               
                   A               
  #################.#############  
  #.#...#...................#.#.#  
  #.#.#.###.###.###.#########.#.#  
  #.#.#.......#...#.....#.#.#...#  
  #.#########.###.#####.#.#.###.#  
  #.............#.#.....#.......#  
  ###.###########.###.#####.#.#.#  
  #.....#        A   C    #.#.#.#  
  #######        S   P    #####.#  
  #.#...#                 #......VT
  #.#.#.#                 #.#####  
  #...#.#               YN....#.#  
  #.###.#                 #####.#  
DI....#.#                 #.....#  
  #####.#                 #.###.#  
ZZ......#               QG....#..AS
  ###.###                 #######  
JO..#.#.#                 #.....#  
  #.#.#.#                 ###.#.#  
  #...#..DI             BU....#..LF
  #####.#                 #.#####  
YN......#               VT..#....QG
  #.###.#                 #.###.#  
  #.#...#                 #.....#  
  ###.###    J L     J    #.#.###  
  #.....#    O F     P    #.#...#  
  #.###.#####.#.#####.#####.###.#  
  #...#.#.#...#.....#.....#.#...#  
  #.#####.###.###.#.#.#########.#  
  #...#.#.....#...#.#.#.#.....#.#  
  #.###.#####.###.###.#.#.#######  
  #.#.........#...#.............#  
  #########.###.###.#############  
           B   J   C               
           U   P   P             `;

//console.log(parseInput(input))

run(input)