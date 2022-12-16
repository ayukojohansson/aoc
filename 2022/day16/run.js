const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;


const part1 = (valves, timeLimit) => {

  // dijkstra paths between openable valves and AA
  const shortestPaths = {};
  Object.values(valves).forEach(valve => {
    if (valve.rate > 0 || valve.id == 'AA') {
      let toDo = [[valve.id, 0]];
      let tmp = {};
      while (toDo.length) {
        const [id, step] = toDo.pop();
        const nextPoints = valves[id].valves;
        nextPoints.forEach(point => {
          if (tmp[point] == undefined || tmp[point] > step+1) {
            tmp[point] = step+1;
            toDo.push([point, step+1])
          }
        })
      }
      shortestPaths[valve.id] = tmp;
    }
  })

  const neededTime = (m) => {
    let curr = 'AA';
    let time = 0;
    let index = 0;
    while (index < m.length) {
      time += shortestPaths[curr][m[index]] + 1 /* time to open */;
      curr = m[index];
      index++;
    }
    return time;
  }

  const permutator = (inputArr) => {
    let result = [];

    const permute = (arr, m = []) => {
        if (neededTime(m) < timeLimit){
          if (m.length) result.push(m)
          for (let i = 0; i < arr.length; i++) {
            let curr = arr.slice();
            let next = curr.splice(i, 1);
            permute(curr.slice(), m.concat(next))
           }
         }
     }

     permute(inputArr)

     return result;
  }

  const allPaths = permutator(
    Object.values(valves).filter(v => v.rate > 0).map(v => v.id)
  );

  const result = allPaths.map((path) => {
    let sum = 0;
    let time = timeLimit;
    let index = 0;
    let curr = 'AA';
    while (time > 0 && index < path.length) {
      const nextValve = path[index];
      time -= shortestPaths[curr][nextValve] +1;
      sum += valves[nextValve].rate * (time > 0 ? time : 0);
      index++;
      curr = nextValve;
    }

    return { sum, path };
  });

  return result;
}


const part2 = (valves) => {
  const possiblePaths = part1(valves, 26);
  const normalizePath = path => path.sort().join();

  // normalize valves to open and keep only the best score
  const normalized = possiblePaths.reduce((paths, item) => {
    const key = normalizePath(item.path);
    if (paths[key] == undefined || paths[key].sum < item.sum) {
      paths[key] = item;
    }
    return paths;
  }, {});

  const hasDuplicate = (left, right) => {
    return left.path.some(l => right.path.includes(l));
  }

  const result = Object.values(normalized)
    .sort((a,b) => b.sum - a.sum)
    .reduce((max, item, index, array) => {
      if (index == array.length-1) {
        // elf opened all valves
        return item.sum > max ? item.sum : max;
      }

      // list is sorted, so first found pair is the best
      let i = index+1;
      while (hasDuplicate(item, array[i])) {
        i++;
        if (i == array.length) {
          // didn't find non-duplicate path
          // means elf worked alone
          return item.sum > max ? item.sum : max;
        }
      }

      const sum = item.sum + array[i].sum;
      return sum > max ? sum : max;
    }, 0);
  
  return result;
}


const main = (str) => {
  const valves = {};
  str.split('\n').forEach(line => {
    const [,id,,, rate,,,,, ...v] = line.split(' ');
    const rateValue = rate.match(/\d+/)[0];
    valves[id] = {
      id,
      rate: parseInt(rateValue, 10),
      valves: v.map(id => id.replace(',',''))
    }
  });
  
  const anser1 = part1(valves, 30).reduce((max, s) => { return max < s.sum ? s.sum : max }, 0);
  console.log('part1', anser1);
  
  const answer2 = part2(valves);
  console.log('part2', answer2);
}


main(test)
main(input)

