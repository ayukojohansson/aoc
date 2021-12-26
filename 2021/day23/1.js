const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');
const testData = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`;
const testData2 = `#############
#...........#
###B#C#B#D###
  #D#C#B#A#
  #D#B#A#C#
  #A#D#C#A#
  #########`;

const data = `#############
#...........#
###D#D#A#A###
  #C#C#B#B#
  #########`;

const data2 = `#############
#...........#
###D#D#A#A###
  #D#C#B#A#
  #D#B#A#C#
  #C#C#B#B#
  #########`;

const mapping = {
  3: 0,
  5: 1,
  7: 2,
  9: 3
}
const idToIndex = {
  'A': 3,
  'B': 5,
  'C': 7,
  'D': 9
}
const costFactor = {
  3: 1,
  5: 10,
  7: 100,
  9: 1000
}

const calc = (inputData) => {
  const lines = inputData.split('\n');
  let hallway = [];
  let rooms = [];
  lines.forEach((line,j) => {
    line.split('').forEach((x,i) => {
      if (j==1) hallway.push(x);
      else if (/A|B|C|D/.test(x)) {
        if (!rooms[i]) {
          rooms[i] = '';
          hallway[i] = '_';
        }
        rooms[i] += idToIndex[x];
      }
    })
  })
  
  let toDo = [{ rooms, hallway, cost: 0, loss:0, openRooms: [], path: [] }];
  let minimalLoss = 0;
  
  let loop = 0;
  const hashTable = {};
  while (toDo.length) {
    loop++;
    if (loop %10000 == 0) console.log('loop', loop, toDo.length);

//    console.log(toDo)
    const world = toDo.pop();
    let newTodo = []
    const hash = world.rooms.join('') + world.hallway.join('');
    if (!hashTable[hash]) {
      hashTable[hash] = world.cost;
    } else if (hashTable[hash] < world.cost) {
      // there was better path
      continue;
    }
//    console.log('\nworld')
//    console.log('cost', world.cost)
//    console.log('loss', world.loss)
//    console.log('rooms', world.rooms)
//    console.log('hallway', world.hallway)
//    console.log('hallwayPods', world.hallwayPods)
//    console.log('path', world.path)
    
    if (world.rooms.every((r,i) => !r || (r[0]==i && r[1]==i))) {
      console.log('goal', world.rooms);
      console.log(world.path);
      console.log('cost', world.cost);
      break;
    }
    
    const openRooms = world.rooms.reduce((o, r, i) => {
      if (!r) return o;
      if (r.split('').every(a => a == '.')) o.push([i, r.length + 1]);
      else {
        const lastDot = r.lastIndexOf('.');
        if (lastDot > -1 && r.slice(lastDot+1).split('').every(a => a == i)) o.push([i, lastDot+2]);
      }
      return o;
    }, [])
//    console.log('openRooms', openRooms)

    // move rooms pod to hallway
    world.rooms.forEach((pods, roomIndex) => {
      if (!pods) return;
      let movablePod;
      const newRooms = [...world.rooms];
      const lastDot = pods.lastIndexOf('.');
      if (lastDot == pods.length -1) {
        // clean room
      } else if (lastDot > -1) {
        if (pods.slice(lastDot+1).split('').every(a => a == roomIndex)) {
          // half filled clean room
        } else {
          movablePod = [pods[lastDot+1], roomIndex, lastDot+1+2];
          newRooms[roomIndex] = newRooms[roomIndex].replace(pods[lastDot+1], '.');
        }
      } else if (pods.split('').every(a => a == roomIndex)) {
        // clean room
      } else {
        movablePod = [pods[0], roomIndex, 2]
        newRooms[roomIndex] = newRooms[roomIndex].replace(pods[0], '.');
      }

      if (!movablePod) return;
      
      const [mType, mx, my] = movablePod;
      world.hallway.forEach((x, i) => {
        if (x != '.') return;
        const way = i < mx ? world.hallway.slice(i,mx+1) : world.hallway.slice(mx, i+1);
//        console.log('way', way)
        if (!way.every(a => a == '.' || a == '_')) {
//          console.log('hallway blocked', i, mx, world.hallway);
          return;
        } else {
//          console.log('moving to ', i, x, 'from', mx)
        }
        const newHallway = [...world.hallway];
        newHallway[i] = mType;
//        console.log(newHallway, world.hallway)
        const step = Math.abs(1 - my) + Math.abs(i - mx);
        const cost = world.cost + costFactor[mType] * step;
        const overStep = Math.abs(mx-i) + Math.abs(mType-i) - Math.abs(mType - mx)
//        console.log('moving to hallway', i, 'from', mx, my, 'type', mType)
//        console.log('cost', step, cost)
//        console.log('loss', overStep, costFactor[mType]*overStep)
        newTodo.push({
          cost: cost,
          loss: world.loss + costFactor[mType] * overStep,
          rooms: newRooms,
          hallway: newHallway,
          path: [...world.path, `${mType}:${i},1`]
        })
      })
      openRooms.forEach(([x,y]) => {
        if (x == mType && mx != x) {
          const way = x < mx ? world.hallway.slice(x,mx+1) : world.hallway.slice(mx, x+1);
          if (!way.every(a => a == '.' || a == '_')) {
//          console.log('hallway blocked', i, mx, world.hallway);
            return;
          }
          const rooms = [...newRooms];
          rooms[x] = rooms[x].replace('.'+x, ''+x+x).replace(/\.$/, ''+x);
          const step = Math.abs(1 - y) + Math.abs(1 - my) + Math.abs(x - mx);
//          console.log('moving to open room', x, y, 'from', mx, my)
//          console.log('cost', costFactor[mType] * step)
          const cost = world.cost + costFactor[mType] * step;
          newTodo.push({
            cost: cost,
            loss: world.loss,
            rooms: rooms,
            hallway: [...world.hallway],
            path: [...world.path, `${mType}:${x},${y}`]
          });
        }
      })
      
    });

    // move hallway pods to room
    world.hallway.forEach((mType, mx) => {
      if (mType == '.' || mType == '#' || mType == '_') {
        return;
      }
      
      openRooms.forEach(([x,y]) => {
        if (x != mType || mx == x) return;
        
        const way = x < mx ? world.hallway.slice(x,mx) : world.hallway.slice(mx+1, x+1);
        if (!way.every(a => a == '.' || a == '_')) {
//          console.log('hallway blocked', i, mx, world.hallway);
          return;
        }

        const rooms = [...world.rooms];
        rooms[x] = rooms[x].replace('.'+x, ''+x+x).replace(/\.$/, ''+x);

        const hallway = [...world.hallway];
        hallway[mx] = '.';
        const step = Math.abs(y - 1) + Math.abs(x - mx);
//          console.log('moving hallway pods to open room', x, y, 'from', mx, 1)
//          console.log('hallway', hallway)
//          console.log('path', world.path)
//          console.log('rooms', rooms)
//          console.log('cost', costFactor[mType] * step)
        const cost = world.cost + costFactor[mType] * step;
        newTodo.push({
          cost: cost,
          loss: world.loss,
          rooms: rooms,
          hallway: hallway,
          path: [...world.path, `${mType}:${x},${y}`]
        });
      })
    });
//    console.log(newTodo)
    newTodo = newTodo.filter(w => w.loss < 1000);
    
    toDo.push(...newTodo);
    toDo = toDo.sort((a,b) => b.loss - a.loss);
  }
}

//console.log('part 1 (test):', calc(testData, 2))
console.log('part 2:', calc(data2, 2))
//console.log('part 2:', calc(data, 50))


