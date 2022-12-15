const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;


const main = (str, watch) => {
  const noop = new Set();
  const beacons = new Set();
  str.split('\n').forEach((line) => {
    const [sx, sy, bx, by] = line.match(/(-?\d+)/g).map(d=>parseInt(d,10))
    beacons.add(`${bx},${by}`);
    const distance = Math.abs(sx-bx) + Math.abs(sy-by);
    if (Math.abs(sy-watch) <= distance) {
      const left = distance - Math.abs(sy-watch);
      for (let x=sx-left; x<=sx+left; x++) {
        noop.add(x);
      }
      if (by == watch) {
        noop.delete(bx)
      }
    }
  })
  console.log(noop.size)
}

const abs = (n) => (n < 0) ? -n : n;

const main2 = (str, range) => {
  const noopList = [];
  const beacons = [];
  str.split('\n').forEach((line) => {
    const noop = new Set();
    const [sx, sy, bx, by] = line.match(/(-?\d+)/g).map(d=>parseInt(d,10))
    const distance = abs(sx-bx) + abs(sy-by);
    beacons.push({
      sx,
      sy,
      distance
    });
  })
  
  const inRange = (x, y, beacons) => beacons.some(({sx, sy, distance}) => {
    if (x<0 || x>range || y<0 || y>range) return true;
    
    return abs(x-sx) + abs(y-sy) <= distance
  })
  beacons.forEach((beacon) => {
    const {sx, sy, distance} = beacon;
    for (let y=sy-distance-1; y<=sy+distance+1; y++) {
      if (y<0 || y>range) {
        
      } else {
        const left = distance - abs(sy-y-1)
        const left1 = sx-left
        const left2 = sx+left
        if (left1>=0 && left1<=range && !inRange(left1, y, beacons)) console.log('ans', left1, y)
        if (left2>=0 && left2<=range && !inRange(left2, y, beacons)) console.log('ans', left2, y)
      }
    }
    
  })

}


main(test, 10)
main(input, 2000000)
main2(test, 20)
main2(input, 4000000)

