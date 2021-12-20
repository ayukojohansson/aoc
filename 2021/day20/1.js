const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');
const testData = fs.readFileSync('./test-data.txt', 'utf8');

const data = input;

const printCanvas = c => {
  c.forEach(l => console.log(l.join('')))
}
const calc = (inputData, loop) => {
  const block = inputData
    .split('\n\n');
  const algo = block[0].split('')
    .reduce((a, bit, i) => {
      if (bit == '#') a.add(i);
      return a;
    }, new Set())

  const images = block[1].split('\n').map(b => b.split(''));

  let offset = loop;
  let size = images[0].length + offset*2;
  let canvas = Array(size);
  images.forEach((line, i)=> {
    canvas[i+offset] = [];
    line.forEach((b, j) => {
      canvas[i+offset][j+offset] = images[i][j] == '#' ? 1 : 0;
    })
  });

  const getValue = ([x,y]) => {
    if (canvas[y]?.[x] == undefined) return canvas[0]?.[0] || 0;
    return canvas[y][x];
  }

  const getIndex = (x,y) => {
    const binary = [
        [x-1,y-1], [x,y-1],   [x+1,y-1],
        [x-1,y],   [x,y],     [x+1,y],
        [x-1,y+1], [x,y+1], [x+1,y+1]
      ]
      .map(getValue)
      .join('');
    return parseInt(binary, 2);
  }

  while (loop) {
    const newCanvas = Array(size);
    for (let i=0; i<size; i++) {
      newCanvas[i] = [];
      for (let j=0; j<size; j++) {
        const index = getIndex(j,i);
        newCanvas[i][j] = algo.has(index) ? 1 : 0;
      }
    }
    canvas = newCanvas;
    loop--;
  }
//  printCanvas(canvas);
  
  const count = (canvas) => canvas
    .reduce((sum, l) => {
      return sum + l.reduce((s, a) => s+a)
    }, 0)

  return count(canvas, 0);
}

console.log('part 1 (test):', calc(testData, 2))
console.log('part 1:', calc(data, 2))
console.log('part 2:', calc(data, 50))


