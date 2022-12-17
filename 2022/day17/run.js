const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;

// bottom is y=0, left most is x=0;
const rocks = [
  [[0,0],[1,0],[2,0],[3,0]], // bar
  [[0,1],[1,1],[2,1],[1,0],[1,2]],// cross
  [[0,0],[1,0],[2,0],[2,1],[2,2]], // L
  [[0,0],[0,1],[0,2],[0,3]], // |
  [[0,0],[1,0],[0,1],[1,1]] // square
];

const tetris = (jets, lastRock, isPart1) => {
  let heightEvery5 = [];

  let rockIndex = 0;
  let jetIndex = 0;
  let chamber = new Set();
  let maxY = -1;
  
  const printChamber = () => {
    for (let y=maxY; y>=0; y--) {
      let buff = '';
      for (let x=0; x<7; x++) {
        buff += chamber.has(`${x},${y}`) ? '#' : '.';
      }
      console.log(buff)
    }
  }
  
  const onFloor = (rock, x, y) => {
    return rock.some(([rx, ry]) => {
      return ry+y == 0 || chamber.has(`${x+rx},${y+ry-1}`);
    });
  }
  const canSlideTo = (rock, x, y) => {
    return rock.every(([rx, ry]) => {
      return ry+x >= 0 && rx+x <7 && !chamber.has(`${x+rx},${y+ry}`);
    });
  }
  
  const jet = (rock, x, y) => {
    const nextJet = jets[jetIndex++]

    if (jetIndex == jets.length) jetIndex = 0;
    const dir = nextJet == '>' ? +1 : -1
    return (canSlideTo(rock, x+dir, y)) ? x+dir : x
  }
  
  const move = (rock, x, y) => {
    x = jet(rock, x, y);

    if (onFloor(rock, x, y)) {
      return [x, y];
    }
    return move(rock, x, y-1);
  };
  
  while (rockIndex < lastRock) {
    if (rockIndex%5 == 0) {
      heightEvery5.push(maxY)
    }

    const rock = rocks[rockIndex%5];
    let x = 2, y = maxY+4;
    [x, y] = move(rock, x, y);

    rock.forEach(([rx, ry]) => {
      chamber.add(`${x+rx},${y+ry}`);
      
      if (maxY<y+ry) {
        maxY = y+ry;
      }
    })
    
    rockIndex++;
  }
//  printChamber();

  if (isPart1) console.log('part1', maxY+1);
  else return heightEvery5;
}

const part2 = (input) => {
  const heightEvery5 = tetris(input, 10000);
  
  const sequence = heightEvery5.reduce((str, h, i) => str + ',' + (h - heightEvery5[i-1]));
  const key = sequence.slice(-50);
  const firstOccursAt = sequence.indexOf(key);
  const secondOccursAt = sequence.indexOf(key, firstOccursAt+1);

  const interval = sequence.slice(firstOccursAt, secondOccursAt).split(',').length -1;
  const increase = heightEvery5[heightEvery5.length-1] - heightEvery5[heightEvery5.length -1 - interval]

  const factor = parseInt((1000000000000-10000)/interval/5) + 1;
  const base = 1000000000000 - interval*5 * factor;
  
  console.log('answer 2 is', heightEvery5[base/5] + increase * factor + 1);
}

tetris(test, 2022, true)
tetris(input, 2022, true)
part2(test)
part2(input)


