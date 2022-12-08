const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test =`30373
25512
65332
33549
35390`;

const main1 = (str) => {
  const lines = str.split('\n');
  const visible = new Set();
  const sizeX = lines[0].length-1
  const sizeY = lines.length-1

  for (let y=0; y<=sizeY;y++) {
    let highest = [-1, -1, -1, -1];
    for (let x=0; x<=sizeX;x++) {
      let current = lines[y][x];

      // left to right
      if (highest[0] < current) {
        visible.add(`${x},${y}`);
        highest[0] = current;
      }

      // right to left
      current = lines[y][sizeX-x];
      if (highest[1] < current) {
        visible.add(`${sizeX-x},${y}`);
        highest[1] = current;
      }
      
      // bottom to top
      current = lines[sizeX-x][y];
      if (highest[2] < current) {
        visible.add(`${y},${sizeX-x}`);
        highest[2] = current;
      }
      
      // top to bottom
      current = lines[x][y];
      if (highest[3] < current) {
        visible.add(`${y},${x}`);
        highest[3] = current;
      }
    }
  }
  console.log(visible.size)
}

const main2 = (str) => {
  const lines = str.split('\n');
  const maxX = lines[0].length-1
  const maxY = lines.length-1
  
  let highest = 0
  
  const getLine = (x1,x2,y1,y2) => {
    const res = [];
    for (let y=y1; y<=y2; y++) {
      for (let x=x1; x<=x2; x++) {
        res.push(lines[y][x])
      }
    }
    return res;
  }

  const getScore = (line, base) => {
    const index = line.findIndex(l => l >= base);
    return index == -1 ? line.length : index+1;
  }

  for (let y=1; y<maxY;y++) {
    for (let x=1; x<maxX;x++) {
      const current = lines[y][x];
      const a = getScore(getLine(0, x-1, y, y).reverse(), current);
      const b = getScore(getLine(x+1, maxX, y, y), current);
      const c = getScore(getLine(x, x, 0, y-1).reverse(), current);
      const d = getScore(getLine(x, x, y+1, maxY), current);

      const totalScore = a*b*c*d;
      if (totalScore > highest) highest = totalScore;
    }
  }
  console.log(highest)
}


main1(test);
main1(input);
main2(test)
main2(input)


