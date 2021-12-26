const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');
const testData = fs.readFileSync('./test-data.txt', 'utf8');

const data = input;

const calc = (inputData) => {
  const lines = inputData.split('\n').map(l => {
    const [onOrOff, ...rest ] = l.split(/\sx\=|,y\=|,z\=/);
    const area = rest.flatMap(a => a.split('..').map(d => +d));
    return [onOrOff, ...area];
  });;
  let cubes = new Set();
  const knife = lines.reduce((k, line, i) => {
    const [onOrOff,x0,x1,y0,y1,z0,z1]  = line;
    
    k[0].add(x0).add(x1)
    k[1].add(y0).add(y1)
    k[2].add(z0).add(z1)

    return k;
  }, [new Set(), new Set(), new Set()]);

  const revLines = lines.reverse();

  console.log(knife[0].size*knife[1].size*knife[2].size);
  
  const count = (...dots) => {
    let isOn = false;
    for (let i=0; i< dots[6].length; i++) {
      const [onOrOff, ...area ] = dots[6][i];
      if (
        dots[4] >= area[4] &&
        dots[5] <= area[5]
      ) {
        isOn = onOrOff == 'on';
        const sum = isOn ? BigInt(
          (dots[1] - dots[0] + 1) * (dots[3] - dots[2] + 1) * (dots[5] - dots[4] + 1)
        ) : 0n;
        return sum;
      }
    }
    
    return 0n;
  }

  let sum = 0n;
  let loop = 0;

  // [1,4,6] => [[1,3],[4,4],[5,6],[6,6]]
  const xList = [...knife[0]].sort((a,b) => a-b).flatMap((a, i, list) => {
    if (i+1 >= list.length) return [[a, a]];
    else if (i==0) return [[a,list[i+1]-1]];
    else return [[a,a], [a+1,list[i+1]-1]];
  });
  const yList = [...knife[1]].sort((a,b) => a-b).flatMap((a, i, list) => {
    if (i+1 > list.length) return [[a, a]];
    else if (i==0) return [[a,list[i+1]-1]];
    else return [[a,a], [a+1,list[i+1]-1]];
  });;
  const zList = [...knife[2]].sort((a,b) => a-b).flatMap((a, i, list) => {
    if (i+1 > list.length) return [[a, a]];
    else if (i==0) return [[a,list[i+1]-1]];
    else return [[a,a], [a+1,list[i+1]-1]];
  });;
  xList.forEach(x => {
    yList.forEach(y => {
      const filtered = revLines.filter(l => {
        const [onOrOff, ...area ] = l;
        if (
          x[0] >= area[0] &&
          x[1] <= area[1] &&
          y[0] >= area[2] &&
          y[1] <= area[3]
        ) return true;
        else false;
      });
      
      zList.forEach(z => {
        sum += count(x[0],x[1],y[0],y[1],z[0],z[1], filtered);
        loop++;
        
        if (loop %10000000 == 0) console.log('loop', loop)
      });
    })
  })
  return sum;
}
const simple = `on x=3..5,y=10..12,z=4..7
off x=5..7,y=10..11,z=4..9
on x=3..7,y=10..10,z=7..9`;
const simple2 = `on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10`;

console.log(simple)
console.log('part 1 (test):', calc(simple, 2), 21)
console.log('part 1 (test):', calc(simple2, 2), 39)
//console.log('part 1 (test):', calc(testData, 2), 2758514936282235)
console.log('part 1:', calc(data, 2))
//console.log('part 2:', calc(data, 50))

//140727112 too low
// 1228562650531587 too low
//1234650223944734n right