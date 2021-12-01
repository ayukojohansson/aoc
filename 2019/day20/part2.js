
const logger = {
  log: (...args) => console.log('INFO:', ...args),
  error: (...args) => console.log('\x1b[41m', 'ERROR:', ...args, "\x1b[0m"),
  result: (...args) => console.log('\x1b[32m', 'RESULT:', ...args, "\x1b[0m"),
  debug: (...args) => process.env.debug == 'true' && console.log('DEBUG:',...args),
};

const fs = require('fs');
const input = fs.readFileSync('./input2.txt', 'utf8');

const parseInput = input => {
  let arr = [], mapR = {};
  const map = input.split('\n').reduce((map, line, y) => {
    line.split('').forEach((d, x) => {
      map[`${x},${y}`] = {
        status: d,
        isWall: d == '#',
        isOpen: /[.01]/.test(d),
        isInner: d == 1,
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
  const fillAirAt = (fx, fy, time) => {
//    console.log('fill air', fx, fy, time )
    const s = getStatus(fx,fy);
    if (!s) return;
    if (!s.isOpen && !s.isPortal) {
      return;
    }
    if (s.isPortal && (fx !== x || fy !== y)) {
      possible.push(Object.assign({
        step: time,
        pos: [fx,fy],
      }, s));
      return;
    }

    if (airMap[`${fx},${fy}`] !== undefined) {
      if (airMap[`${fx},${fy}`] < time)
        return false;
    }
    airMap[`${fx},${fy}`] = time;
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
    });
  }
  return possible;
}

const run = (input, LIMIT = 100) => {
  let [map, mapR] = parseInput(input);
  console.log(map)
  console.log(mapR)

  let chart = {};
  Object.keys(mapR).forEach(key => {
    let [x,y] = mapR[key];
    chart[key] = findNearest(map, x, y, mapR);
  });

  const possibleRoute = [{ route: ['AA'], level: 1, step: 0, maxLevel: 1 }];
  const foundRoute = [];
//  let min = 6293;
  let min = 7000;
  while (possibleRoute.length) {
    const { route, level, step, maxLevel } = possibleRoute.pop();
    const currentPos = route;
    const nextPortals = chart[currentPos];
    nextPortals.forEach(next => {
      const newStep = step + next.step + 1;
      if (level > LIMIT) {
        // do nothing, too deep
      } else if (next.isPortal == 'ZZ1') {
        if (level == 1) {
          foundRoute.push({
            step: newStep,
            maxLevel,
          });
          if (!min || min > newStep)
            min = newStep;
        }
      } else if (next.isPortal == 'AA1'){
        // do nothing
      } else if (level == 1 && !next.isInner) {
        // do nothing, all outer portal is wall
      } else {
        if (newStep < min)
        possibleRoute.push({
          route: next.isPortal,
          level: next.isInner ? level + 1 : level -1,
          step: newStep,
          maxLevel: maxLevel < level ? level : maxLevel,
        });
      }
    })
  }
  console.log(foundRoute);
  console.log('min is', min -1);
}

const test1 = `         A           
         A           
  #######.#########  
  #######.........#  
  #######.#######.#  
  #######.#######.#  
  #######1#######.#  
  #####  B    ###.#  
BC0..##  C    ###.#  
  ##.##       ###.#  
  ##..1DE  F  ###.#  
  #####    G  ###.#  
  #########1#####.#  
DE0.#######...###.#  
  #.#########.###.#  
FG0.#########.....#  
  ###########.#####  
             Z       
             Z      `;

const test2 = `             Z L X W       C                 
             Z P Q B       K                 
  ###########.#.#.#.#######.###############  
  #...#.......#.#.......#.#.......#.#.#...#  
  ###.#.#.#.#.#.#.#.###.#.#.#######.#.#.###  
  #.#...#.#.#...#.#.#...#...#...#.#.......#  
  #.###.#######.###.###.#.###.###.#.#######  
  #...#.......#.#...#...#.............#...#  
  #.#########1#######1#1#######1#######.###  
  #...#.#    F       R I       Z    #.#.#.#  
  #.###.#    D       E C       H    #.#.#.#  
  #.#...#                           #...#.#  
  #.###.#                           #.###.#  
  #.#...1OA                       WB1.#.#..ZH
  #.###.#                           #.#.#.#  
CJ......#                           #.....#  
  #######                           #######  
  #.#...1CK                         #......IC
  #.###.#                           #.###.#  
  #.....#                           #...#.#  
  ###.###                           #.#.#.#  
XF....#.#                         RF1.#.#.#  
  #####.#                           #######  
  #.....1CJ                       NM1.#...#  
  ###.#.#                           #.###.#  
RE....#.#                           #......RF
  ###.###        X   X       L      #.#.#.#  
  #.....#        F   Q       P      #.#.#.#  
  ###.###########1###1#######1#########.###  
  #.....#...#.....#.......#...#.....#.#...#  
  #####.#.###.#######.#######.###.###.#.#.#  
  #.......#.......#.#.#.#.#...#...#...#.#.#  
  #####.###.#####.#.#.#.#.###.###.#.###.###  
  #.......#.....#.#...#...............#...#  
  #############.#.#.###.###################  
               A O F   N                     
               A A D   M                   `;


run(input)