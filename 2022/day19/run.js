const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `Blueprint 1:Each ore robot costs 4 ore.Each clay robot costs 2 ore.Each obsidian robot costs 3 ore and 14 clay.Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2:Each ore robot costs 2 ore.Each clay robot costs 3 ore.Each obsidian robot costs 3 ore and 8 clay.Each geode robot costs 3 ore and 12 obsidian.`;

const main = (input, timeLimit = 24) => {
  const blueprints = input.split('\n').reduce((bp, line) => {
    const [id, oreBotCost, clayBotCost, obsidianOre, obsidianCray, geodeOre, geodeOb] = line.match(/\d+/g).map(d=>parseInt(d,10));
    bp[id] = {
      id,
      oreBotCost,
      clayBotCost,
      obsidianOre, obsidianCray,
      geodeOre, geodeOb
    }
    return bp;
  }, {});
  
  const optimize = (bp, timeLimit) => {
    let oreLimit = Math.max(bp.oreBotCost, bp.clayBotCost, bp.obsidianOre, bp.geodeOre);
    let clayLimit = bp.obsidianCray;
    let numOreBot = 1;
    let time = 0;
    const production = {};
    
    let toDo = [{
      time: 0,
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0,
      oreBot: 1,
      clayBot: 0,
      obsidianBot: 0,
      geodeBot: 0
    }];

    let max = {geode: 0};

    let hashTable = {};
    
    const isBetter = (a,b) => {
      return Object.keys(a).every(key => a[key] >= b[key])
    }
    const isWorse = (a,b) => {
      return Object.keys(a).every(key => a[key] <= b[key])
    }
    
    while (toDo.length) {
      const state = toDo.shift();

      if (!hashTable[state.time]) {
        hashTable[state.time] = [state];
      } else if (hashTable[state.time].some(s => isBetter(s, state))) {
        continue;
      } else {
        const worse = hashTable[state.time].findIndex(s => isWorse(s, state));
        if (worse >= 0) {
          hashTable[state.time].splice(worse, 1, state);
        } else {
          hashTable[state.time].push(state);
        }
      }

      if (state.time >= timeLimit) {
        if ( max.geode < state.geode ) max = state
        continue;
      }

      if (state.ore >= bp.geodeOre && state.obsidian >= bp.geodeOb) {
        toDo.push({
          time: state.time + 1,
          ore: state.ore - bp.geodeOre + state.oreBot,
          clay: state.clay + state.clayBot,
          obsidian: state.obsidian - bp.geodeOb + state.obsidianBot,
          geode: state.geode + state.geodeBot,
          oreBot: state.oreBot,
          clayBot: state.clayBot,
          obsidianBot: state.obsidianBot,
          geodeBot: state.geodeBot + 1,
        })
        continue;
      }
      if (state.ore >= bp.obsidianOre && state.clay >= bp.obsidianCray) {
        toDo.push({
          time: state.time + 1,
          ore: state.ore - bp.obsidianOre + state.oreBot,
          clay: state.clay - bp.obsidianCray + state.clayBot,
          obsidian: state.obsidian + state.obsidianBot,
          geode: state.geode + state.geodeBot,
          oreBot: state.oreBot,
          clayBot: state.clayBot,
          obsidianBot: state.obsidianBot + 1,
          geodeBot: state.geodeBot
        });
      }
      if (state.ore >= bp.clayBotCost && state.clay <= clayLimit*2) {
        toDo.push({
          time: state.time + 1,
          ore: state.ore - bp.clayBotCost + state.oreBot,
          clay: state.clay + state.clayBot,
          obsidian: state.obsidian + state.obsidianBot,
          geode: state.geode + state.geodeBot,
          oreBot: state.oreBot,
          clayBot: state.clayBot + 1,
          obsidianBot: state.obsidianBot,
          geodeBot: state.geodeBot
        })
      }
      if (state.ore >= bp.oreBotCost && state.ore <= oreLimit*2) {
        toDo.push({
          time: state.time + 1,
          ore: state.ore - bp.oreBotCost + state.oreBot,
          clay: state.clay + state.clayBot,
          obsidian: state.obsidian + state.obsidianBot,
          geode: state.geode + state.geodeBot,
          oreBot: state.oreBot + 1,
          clayBot: state.clayBot,
          obsidianBot: state.obsidianBot,
          geodeBot: state.geodeBot
        })
      }
      if (state.ore <= oreLimit*2 || state.clay <= clayLimit*2) {
        toDo.push({
          time: state.time + 1,
          ore: state.ore + state.oreBot,
          clay: state.clay + state.clayBot,
          obsidian: state.obsidian + state.obsidianBot,
          geode: state.geode + state.geodeBot,
          oreBot: state.oreBot,
          clayBot: state.clayBot,
          obsidianBot: state.obsidianBot,
          geodeBot: state.geodeBot
        })
      }

    }
    console.log(bp.id, max)
    return max;
  };

  
  const part1 = Object.values(blueprints).reduce((sum, bp) => {
    return sum + optimize(bp, 24).geode * bp.id;
  }, 0);
  console.log('part1', part1)
  
  const part2 = Object.values(blueprints).reduce((sum, bp) => {
    if (bp.id > 3) return sum;
    return sum * optimize(bp, 32).geode;
  }, 1);
  console.log('part2', part2)
}

//part1(test)
main(input)


