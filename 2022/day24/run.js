const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;


const main = (input, round=10) => {
  const winds = new Map();
  let maxX, maxY;
  input.split('\n').forEach((line, y) => {
    maxX = line.length-1;
    maxY = y
    line.split('').forEach((d, x) => {
      if (d !=='#' && d!== '.') {
        winds.set(`${x},${y}`, d);
      }
    })
  })
  console.log(maxX,maxY)
  
  const windsAt = { 0: winds };
  
  const getNextPos = (x,y,w) => {
    switch (w) {
      case '>':
        return (x == maxX-1) ? `${1},${y}` :`${x+1},${y}`;
      case '<':
        return (x == 1) ? `${maxX-1},${y}` :`${x-1},${y}`;
      case '^':
        return (y == 1) ? `${x},${maxY-1}` :`${x},${y-1}`;
      case 'v':
        return (y == maxY-1) ? `${x},${1}` :`${x},${y+1}`;
    }
  }
  const getWinds = (time) => {
    if (windsAt[time]) return windsAt[time];
    
    const nextWinds = new Map();
    for (let [pos, winds] of windsAt[time-1]) {
      const [x,y] = pos.split(',').map(d => +d);
      winds.split('').forEach(w => {
        const nextPos = getNextPos(x,y, w);
        nextWinds.set(
          nextPos,
          nextWinds.has(nextPos) ? nextWinds.get(nextPos) + w : w
        )
      })
    }
    windsAt[time] = nextWinds;

    return nextWinds;
  }
  const getSurroundings = ([x,y]) => {
    return [
      [x,y],
      [x-1,y],
      [x+1,y],
      [x,y-1],
      [x,y+1]
    ].filter(([a,b]) => (a>0 && b>0 && a<maxX && b<maxY) || (a==end[0]&&b==end[1]) || (a==1&&b==0));
  }
  const remaining = ([x,y]) => {
    return Math.abs(end[0] - x) + Math.abs(end[1] - y);
  }
 
  const part1 = (start, end, startTime) => {
    let toDo = [{ pos: start, time: startTime, estimate: remaining(start) }];
    let goal;
    let loop =0;
    const checked = new Set();
    while (toDo.length) {
      loop++;
      toDo = toDo.sort((a,b) => b.estimate - a.estimate);

      const { pos, time } = toDo.pop();

      if (pos[0] == end[0] && pos[1] == end[1]) {
        // goal
        if (goal == undefined || goal > time) {
          goal = time;
          console.log('goal at', time);
          break;
        }
      }
      const nextWinds = getWinds(time+1);
      getSurroundings(pos).forEach(([x,y]) => {
        if (!nextWinds.has(`${x},${y}`) && !checked.has(`${x},${y},${time+1}`)) {
          checked.add(`${x},${y},${time+1}`);
          toDo.push({
            pos: [x,y],
            time: time+1,
            estimate: time + 1 + remaining([x,y])
          })
        }
      })
    }
    return goal;
  }
  
  let start = [1,0];
  let end = [maxX-1,maxY];
  let goal1 = part1(start, end, 0);
  let goal2 = part1(end, start, goal1);
  let goal3 = part1(start, end, goal2);
  
  
}

main(test)
main(input)



