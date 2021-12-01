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
  let start, mapR ={};
  const map = input.split('\n').reduce((map, line, y) => {
    line.split('').forEach((d, x) => {
      map[`${x},${y}`] = {
        status: d,
        isWall: d == '#',
        isDoor: /[A-Z]/.test(d),
        isKey: /[a-z]/.test(d),
      };
      if (/[a-zA-Z@]/.test(d)) mapR[d] = [x,y];
    })
    return map;
  }, {});
  return [map, mapR];
};

  
const findNearest = (originalMap, x, y, route) => {
  const airMap = {};
  const possible = [];
  const getStatus = (x, y) => originalMap[`${x},${y}`];
  const fillAirAt = (x, y, time) => {
//    console.log('fill air', x, y, time )
    const s = getStatus(x,y);
    if (!s) return;
    if (airMap[`${x},${y}`] !== undefined || s.isWall) {
      // already aired or wall
//      console.log('already aired', x,y)
      return;
    }
    if (s.isDoor && !route.includes(s.status.toLowerCase())) {
//      console.log('Door locked', s, route)
      return;
    }
    if (s.isKey) {
      possible.push(Object.assign({
        step: time,
        pos: [x,y],
      }, s));
      return;
    }
    airMap[`${x},${y}`] = time;
//    originalMap[`${x},${y}`].status = 'O';
    return true;

  };
  let toFill = [[x,y]];
  fillAirAt(x,y,0)
  while (toFill.length) {
//    ascii(originalMap);
//    console.log(originalMap)
    
    // fill around
//    console.log('to fill', toFill,toFill)
    const [px,py] = toFill.shift();
    time = airMap[`${px},${py}`] || 0;
//    console.log(px,py, 'time',time);
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

const run = (input) => {
  let [map, mapR] = parseInput(input);
//  console.log(mapR)
  const getCurrentMap = (map, searchingRoute) => {
    const current = Object.assign({}, map);
//    console.log('getCurrentMap', searchingRoute)
    searchingRoute.split('').forEach(r => {
      const [px, py] = mapR[r];
      current[`${px},${py}`] = { status: '.'};
    })
    return current;
  };
//  let x, y;
  let keys = {};
  let toGet = {};
  let nearestDoor;
  let possibilities;
  let foundRoute = [];
  let possibleRoute = [{ route:'@', step: 0 }];
  let currentPath = '@';
  let min = Number.MAX_SAFE_INTEGER;
  const checkHash = (r, step) => {
    const hash = r.slice(0,-1).replace(/[A-Z]/g, '').split('').sort().join('') + r.slice(-1);
//    console.log('check hash', hash, keys[hash], step)
    if (keys[hash] == undefined || keys[hash] > step) {
      keys[hash] = step;
      return true;
    }
//    console.log('thowing', r, hash, keys[hash], step)
    return false;
  }
  do {
    const { route, step } = possibleRoute.pop();
    const currentMap = getCurrentMap(map, route);
    
    const [x, y] = mapR[route.slice(-1)];
    possibilities = findNearest(currentMap, x, y,route);
//    console.log('possibilities', possibilities)
    possibilities.forEach(p => {
//      console.log(p)
      const r = route + p.status;
      const s = step + p.step;
      if (p.isKey && checkHash(r, s) ) {
        if (step < min) {
          possibleRoute.push({
            route: r,
            step: s,
          });
        } else {
          console.log(`${route} takes too long`);
        }
//        console.log('possibleRoute', possibleRoute)
      }
    });
    if (!possibilities.length) {
      foundRoute.push({ route, step });
      if (!min || min > step) {
        min = step;
        console.error('current min is', min)
      }
    }
  } while (possibleRoute.length) 
    console.log(foundRoute, min)
//    console.log(Math.min(...foundRoute.map(r => r.step)))
//  const simpleRoutes = new Set(foundRoute.map(r => r.replace(/[A-Z]/g, '')));
}

const test1 = `########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################`;

const test2 = `########################
#...............b.C.D.f#
#.######################
#.....@.a.B.c.d.A.e.F.g#
########################`;

const test3 = `########################
#@..............ac.GI.b#
###d#e#f################
###A#B#C################
###g#h#i################
########################`;
run(input)

// 4350