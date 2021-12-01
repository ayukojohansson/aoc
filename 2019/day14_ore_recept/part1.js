
/*

The image you received is 25 pixels wide and 6 pixels tall.

To make sure the image wasn't corrupted during transmission, the Elves would like you to find the layer that contains the fewest 0 digits. On that layer, what is the number of 1 digits multiplied by the number of 2 digits?
*/

const logger = {
  log: (...args) => console.log('INFO:', ...args),
  error: (...args) => console.log('\x1b[41m', 'ERROR:', ...args, "\x1b[0m"),
  result: (...args) => console.log('\x1b[32m', 'RESULT:', ...args, "\x1b[0m"),
  debug: (...args) => process.env.debug == 'true' && console.log('DEBUG:',...args),
};

const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const parseInput = input => input.split('\n')
  .reduce((chart, line) => {
    const match = line.match(/\d+|\w+/g);
    const material = [];
    let i = match.length -2;
    while (i >= 2) {
      material.push([match[i-1], match[i-2]]);
      i -= 2;
    }
    if (chart[match[match.length-1]]) logger.error('already there')
    return Object.assign(chart, {
      [match[match.length-1]]: {
        count: match[match.length-2],
        material,
      }
    });
  }, {});

const findMaterial = (product, neededCount, chart) => {
  const materials = chart[product].material;
  const unit = chart[product].count;
  const minimalSet = parseInt(neededCount / unit) + (neededCount % unit ? 1 : 0)
  console.log('\nfindMAterial', product, neededCount)
  console.log('minimalSet=', minimalSet, 'unit=', unit);

  if (materials.length == 1 && materials[0][0] == 'ORE') {
    return { neededOre: materials[0][1] * minimalSet, left: [[product, minimalSet*unit - neededCount]] };
  }
  const res = materials.map(([m, count]) => {
    return findMaterial(m, count * minimalSet, chart);
  }).reduce((list, data, i, arr) => {
    console.log('data', i, data, list)
    console.log('current left', list.left)
    const updatedLeft = data.left ? list.left.concat(data.left) : list.left;
    console.log('updatedLeft', updatedLeft)
    return {
      neededOre: list.neededOre + data.neededOre,
      left: updatedLeft,
    };
  }, { neededOre: 0, left: [[product, minimalSet*unit - neededCount]] });
  console.log('findMAterial res', neededCount, 'of', product, res, '\n');
  return res;
}

const test = `10 ORE => 10 A
1 ORE => 1 B
7 A, 1 B => 1 C
7 A, 1 C => 1 D
7 A, 1 D => 1 E
7 A, 1 E => 1 FUEL`;

const test2 = `157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT`;

const test3 = `2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
17 NVRVD, 3 JNWZP => 8 VPVL
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM
139 ORE => 4 NVRVD
144 ORE => 7 JNWZP
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
145 ORE => 6 MNCFX
1 NVRVD => 8 CXFTF
1 VJHF, 6 MNCFX => 4 RFSQX
176 ORE => 6 VJHF`;

const test4 = `171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX`;

const minimizeWaste = (savings, chart) => {
  let possibleSaving = 0;
  const created = [];
  Object.keys(savings).forEach(p => {
    const unit = chart[p].count;
    const saving = parseInt(savings[p] / unit);
    logger.result('possible saving unit for', p, savings[p], '/', unit, saving)
    if (saving > 0) {
      const {neededOre, left} = findMaterial(p, saving * unit, chart);
      console.log('saving for',p, neededOre, left)
      possibleSaving += neededOre;
      created.push(...left, [p, saving * unit]);
//      primaryOre - = saving* findMaterial(product, saving * chart[product].count)
      console.log('current saving', possibleSaving, '\n');
    }
  })
  const possibleTooMuch = flatten(created);
  console.log('possibleSaving',possibleSaving, 'created', possibleTooMuch);
  if (!possibleSaving) return 0;
  const over = Object.keys(possibleTooMuch).reduce((tooMuch, p) => {
    console.log('too much?', possibleTooMuch[p], savings[p])
    if (possibleTooMuch[p] > savings[p]) {
      const s = findMaterial(p, possibleTooMuch[p] - savings[p], chart);
      return tooMuch + s.neededOre;
    } else return tooMuch;
  }, 0);
  console.log('was too much.', over);
  return possibleSaving - over;
};
const a = {
  FUEL: 0,
  GNMV: 5,
  CXFTF: 24, //139, 'NVRVD', 1
  NVRVD: 13, // 556
  VPVL: 11,
  JNWZP: 3,
  MNCFX: 13,
  VJHF: 11,
  HVMC: 0,
  FWMGM: 5,
  RFSQX: 3,
  STKFG: 0
};
// 183849 - 180697 = 3152
const flatten = (arr) => arr.reduce((savings, [p, c]) => {
    savings[p] = (savings[p] || 0) + c;
    return savings;
  }, {});
//console.log(minimizeWaste(a,parseInput(test3)));


const justify = chart => sum => {
  console.log('justify', sum);

  const savings = flatten(sum.left);
  console.log('justify savings', savings);
  const possibleSaving = minimizeWaste(savings, chart);

  logger.result(sum.neededOre - possibleSaving);
}

const chart = parseInput(test4);
justify(chart)(findMaterial('FUEL', 1, chart))
//justify(chart)(findMaterial('HVMC', 3, chart))

// test2 = 13312
// test3 = 180697
/*
Consume 45 ORE to produce 10 A.
Consume 64 ORE to produce 24 B.
Consume 56 ORE to produce 40 C.
Consume 6 A, 8 B to produce 2 AB.
Consume 15 B, 21 C to produce 3 BC.
Consume 16 C, 4 A to produce 4 CA.
Consume 2 AB, 3 BC, 4 CA to produce 1 FUEL.
*/