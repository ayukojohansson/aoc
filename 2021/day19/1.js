const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');
const testData = fs.readFileSync('./test-data.txt', 'utf8');

const data = input;

const reverse = p => p.map(q => q * (-1)).reverse();

const count = (p1, p2) => {
  let res = [];
  let max = p2[p2.length-1] - p1[0];
  let min = p2[0] - p1[p1.length-1];

  for (let offset = min; offset < max; offset++) {
    const c = p2.reduce((c, p) => {
      return p1.includes(p-offset) ? c+1 : c;
    }, 0);
    if (c >= 12) {
      res.push({ offset, c })
    }
  }
  if (res.length > 1) {
    console.log('found many overlap');
    throw new Error();
  }
  return res[0];
}

const overlap = (a, b) => {
  const summary = [];
  a.projections.forEach((pa, ia) => {
    b.projections.forEach((pb, ib) => {
      const res = count(pa, pb);
      const resR = count(pa, reverse(pb));

      if (res && resR) {
        console.log('found both overlap');
        throw new Error();
      }

      if (res) {
        res.a = ia;
        res.b = ib;
        summary.push(res)
      } else if (resR) {
        resR.a = ia;
        resR.b = ib;
        resR.reverse = true;
        summary.push(resR)
      }
    });
    if (!summary.length) {
      return [];
    }
  });
  return summary
}

const align = (mapping, base, scanner) => {
  const [x,y,z] = mapping;
  scanner.beacons = scanner.beacons.map(b => ([
    b[x.b] * (x.reverse ? -1 : 1),
    b[y.b] * (y.reverse ? -1 : 1),
    b[z.b] * (z.reverse ? -1 : 1)
  ]));

  scanner.offset = [
    base.offset[0] + x.offset,
    base.offset[1] + y.offset,
    base.offset[2] + z.offset
  ]

  scanner.projections = getProjection(scanner.beacons);
  console.log('==> done rotating', scanner.offset);
}

const getProjection = beacons =>
  beacons.reduce((p, b) => {
    p[0].push(b[0]);
    p[1].push(b[1]);
    p[2].push(b[2]);
    return p;
  }, [[], [], []])
  .map(p => p.sort((a,b) => a-b));

const calc = (inputData) => {
  const scanners = inputData
    .split('\n\n')
    .map(block => {
      const beacons = block.split('\n').slice(1)
        .map(b => b.split(',').map(d => +d));
      const projections = getProjection(beacons);
      return { beacons, projections }
    })
  
  scanners[0].done = true;
  scanners[0].offset = [0,0,0];

  let identified = [scanners[0]];
  while (identified.length < scanners.length) {
    for (let i=0; i<identified.length;i++) {
      const baseScanner = identified[i];
      for (let j=0; j<scanners.length;j++) {
        const scanner = scanners[j];
        if (scanner.done) continue;
        
        const res = overlap(baseScanner, scanner);
        if (res.length == 3) {
          align(res, baseScanner, scanner);
          scanner.done = true;
          identified.push(scanner);
          break;
        } else if (res.length) {
          console.log('found partial match');
          throw new Error();
        }
      }
    }
  }
  
  const beacons = scanners.reduce((total, scanner) => {
    const { offset, beacons } = scanner;
    beacons.forEach(b => 
      total.add(`${b[0]-offset[0]},${b[1]-offset[1]},${b[2]-offset[2]}`)
    );
    return total; 
  }, new Set());

  console.log('beacons', beacons.size);

  let largest = 0;
  for (let i=0; i<scanners.length; i++) {
    const offset_i = scanners[i].offset;
    for (let j=0; j<scanners.length; j++) {
      const offset_j = scanners[j].offset;
      const distance = Math.abs(offset_i[0] - offset_j[0]) + Math.abs(offset_i[1] - offset_j[1]) +Math.abs(offset_i[2] - offset_j[2]);
      if (distance > largest) largest = distance;
    }
  }
  console.log('distance', largest)
  return beacons.size;
}

console.log('part 1:', calc(testData))
console.log('part 1:', calc(data))


