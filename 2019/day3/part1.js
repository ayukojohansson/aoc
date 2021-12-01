

/*

R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83 = distance 159
R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = distance 135
*/

//const fs = require('fs');
//const [input, input2] = fs.readFileSync('./input.txt', 'utf8').split('\n');

//const input ='R8,U5,L5,D3';
//const input2 ='U7,R6,D4,L4';
//const input ='R75,D30,R83,U83,L12,D49,R71,U7,L72';
//const input2 ='U62,R66,U55,R34,D71,R55,D58,R83';
const input ='R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51';
const input2 ='U98,R91,D20,R16,D67,R40,U7,R15,U6,R7';


const getPath = (route) =>
  route.split(',').reduce((path, instruction) => {
    const direction = instruction[0];
    const step = instruction.slice(1);
    console.log(direction, step)
    let newPaths = Array(Number(step))
        .fill(path[path.length-1]);
    if (direction === 'R') {
      newPaths = newPaths.map((p, index) => ([p[0] + 1 + index, p[1]]));
    } else if (direction === 'L') {
      newPaths = newPaths.map((p, index) => ([p[0] - 1 - index, p[1]]));
    } else if (direction === 'U') {
      newPaths = newPaths.map((p, index) => ([p[0], p[1] + 1 + index]));
    } else if (direction === 'D') {
      newPaths = newPaths.map((p, index) => ([p[0], p[1] - 1 - index]));
    }
    return path.concat(newPaths);
  }, [[0,0]]);

const path1 = getPath(input);
const path2 = getPath(input2);

const getHash = d => `${d[0]}:${d[1]}`;

const findCrossing = (path1, path2) =>
  path1.reduce((cross, p1) => {
    path2.some(p2 => {
      if (getHash(p2) == getHash(p1)) {
        cross.push(p2);
        return true;
      }
      return false;
    });
    return cross;
  }, []);

const getDistance = ([x,y]) => (Math.abs(x)+Math.abs(y));

const getShortestDistance = crossings =>
  crossings.slice(1).reduce((shortest, crossing) => {
    if (!shortest || getDistance(crossing) < shortest) {
      return getDistance(crossing);
    }
    return shortest;
  }, 0);


const distanceMaping = paths => paths.reduce((obj, p, index) => {
  console.log('distanceMapping', p)
  const distance = getDistance(p);
  if (obj[distance]) {
    obj[distance] = obj[distance].concat([[...p, index]]);
  } else {
    obj[distance] = [[...p, index]];
  }
  return obj;
}, {});

const findCrossing2 = (path1, path2) => {
  
  const mapping1 = distanceMaping(path1);
  const mapping2 = distanceMaping(path2);
  
  console.log('mapping1', mapping1)
  console.log('mapping2', mapping2)
  let crossings = [];
  
  Object.keys(mapping1).forEach(distance => {
    if (mapping2[distance]) {
      const foundCrossing = findCrossing(mapping1[distance], mapping2[distance])
      console.log('foundCrossing', foundCrossing)
      foundCrossing.length && crossings.push(...foundCrossing);
    }
  });
  console.log('crossings', crossings);
  return crossings;
}

console.log(getShortestDistance(findCrossing2(path1, path2)));