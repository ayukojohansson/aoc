const logger = {
  log: (...args) => console.log('INFO:', ...args),
  error: (...args) => console.log('\x1b[41m', 'ERROR:', ...args, "\x1b[0m"),
  result: (...args) => console.log('\x1b[32m', 'RESULT:', ...args, "\x1b[0m"),
  debug: (...args) => process.env.debug == 'true' && console.log('DEBUG:',...args),
};

const fs = require('fs');
const input = fs.readFileSync('./input_2.txt', 'utf8');

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
      if (/[a-zA-Z@%&?]/.test(d))
        mapR[d] = [x,y];
    })
    return map;
  }, {});
  return [map, mapR];
};

const findNearest = (originalMap, x, y, route) => {
  const airMap = {};
  const possible = [];

  const fillAirAt = (x, y, time) => {
    const s = originalMap[`${x},${y}`];
    if (!s) return;
    if (airMap[`${x},${y}`] !== undefined || s.isWall) {
      // already aired or wall
      return;
    }
    if (s.isDoor && !route.includes(s.status.toLowerCase())) {
      // Door locked
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
    return true;

  };

  let toFill = [[x,y]];
  fillAirAt(x,y,0)
  while (toFill.length) {
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

const run = (input) => {
  let [map, mapR] = parseInput(input);

  // Clone map with visited keys as open area
  const getCurrentMap = (map, searchingRoute) => {
    const current = Object.assign({}, map);
    searchingRoute.split('').forEach(r => {
      const [px, py] = mapR[r];
      current[`${px},${py}`] = { status: '.'};
    })
    return current;
  };

  let keys = {};
  let possibilities;
  let foundRoute = [];
  let possibleRoute = [{
    route: '@%&?',
    step: 0,
    robots: '@?%&',
  }];
  let min = Number.MAX_SAFE_INTEGER;

  // Store minimal step to get set of keys
  // last key should remain as last as position
  // but route to reach the last key doesn't matter
  const checkHash = (r, step) => {
    const hash = r.slice(0,-1).replace(/[A-Z]/g, '').split('').sort().join('') + r.slice(-1);
    if (keys[hash] == undefined || keys[hash] > step) {
      keys[hash] = step;
      return true;
    }
    return false;
  }

  do {
    const { route, step, robots } = possibleRoute.pop();
    const currentMap = getCurrentMap(map, route);
    let possibleCounter = 4;
  
    robots.split('').forEach((rob, index) => {
      const [x, y] = mapR[rob];
      possibilities = findNearest(currentMap, x, y, route);
      possibilities.forEach(p => {
        const r = route + p.status;
        const s = step + p.step;
        if (p.isKey && checkHash(r, s)) {
          if (step < min) {
            possibleRoute.push({
              route: r,
              step: s,
              robots: robots.replace(rob, p.status)
            });
          } else {
            console.log(`${route} takes too long`);
          }
        }
      });
      if (!possibilities.length) {
        possibleCounter--;
      }
    })
    if (!possibleCounter) {
      foundRoute.push({ route, step });
      if (!min || min > step) {
        min = step;
        console.error('current min is', min)
      }
    }
  } while (possibleRoute.length) 

  console.log(foundRoute, min)
}

const test1 = `#######
#a.#Cd#
##@#?##
#######
##&#%##
#cB#.b#
#######`;

const test2 = `###############
#d.ABC.#.....a#
######@#?######
###############
######&#%######
#b.....#.....c#
###############`;

const test3 = `#############
#DcBa.#.GhKl#
#.###@#?#I###
#e#d#####j#k#
###C#&#%###J#
#fEbA.#.FgHi#
#############`;
run(input)


// 2802 too high
// 2674 too high

// 2348
