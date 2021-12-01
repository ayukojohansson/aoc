
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
    const material = {};
    let i = match.length -2;
    while (i >= 2) {
      material[match[i-1]] = Number(match[i-2]);
      i -= 2;
    }
    if (chart[match[match.length-1]]) logger.error('already there')
    return Object.assign(chart, {
      [match[match.length-1]]: {
        unit: Number(match[match.length-2]),
        material,
      }
    });
  }, {});


const test = `10 ORE => 10 A
1 ORE => 1 B
7 A, 1 B => 1 C
7 A, 1 C => 1 D
7 A, 1 D => 1 E
7 A, 1 E => 1 FUEL`;

const test1 = `9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL`;

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

const isAllKnown = (list, known) => {
//  console.log(list)
  return Object.keys(list).every(l => !!known[l]);
}
const getMaterial = (materials, known) => {
  console.log('getMaterial', materials, known)
  let oreNeeded = 0;
  let left = {};
  known.depth.forEach(m => {
    if (!materials[m]) return;

    let neededCount = materials[m];
    const unit = known[m].unit;
    if (left[m]) {
      console.log('lucky', left)
      if (left[m] > neededCount) {
        neededCount = 0;
        left[m] = left[m] - neededCount;
      } else {
        neededCount = neededCount - left[m];
        delete left[m];
      }
      console.log('left is now', left)
    }
    const minimalSet = parseInt(neededCount / unit) + (neededCount % unit ? 1 : 0);
    console.log('getMaterial', m, 'needed', neededCount, 'minimalSet', minimalSet)
          
    oreNeeded += known[m].oreNeeded * minimalSet;
    if (minimalSet*unit - neededCount > 0) {
      left[m] = minimalSet*unit - neededCount;
    }
    Object.assign(left, known[m].left)
    console.log('after ',m, oreNeeded, left)
  });
  return [oreNeeded, left];
};

const expand = (chart, p, needed, rawMaterial) => {
  console.log('\nexpand', p, needed)
  if (rawMaterial[p])
    return [{ material: p, needed }];
  const {unit, material} = chart[p];
  return Object.keys(material).flatMap(m => {
    const res = expand(chart, m, material[m]*needed, rawMaterial);
    console.log('res', res)
    return res;
  });
}
const flatten = (arr) => {
  console.log('flattened input:', arr);
  const res = arr.reduce((sum, {material, needed}) => {
    sum[material] = (sum[material] || 0) + needed;
    return sum;
  }, {});
  console.log('flattened res:', res);
  return res;
}

const main = (chart, target, needed, rawMaterial) => {
  const material = expand(chart, target, needed, rawMaterial);
  console.log('material', material);
  const allMaterial = flatten(material)
  console.log(allMaterial);
  return allMaterial;
}

const getRawMaterial = chart =>
  Object.keys(chart).reduce((raw, p) => {
    const recipe = chart[p];
    if (recipe.material.ORE)
      raw[p] = { unit: recipe.unit, cost: recipe.material.ORE };
    return raw;
  }, {});

const pay = (obj, rawMaterial) => {
  return Object.keys(obj).reduce((sum, k) => {
    const recipe = rawMaterial[k];
    const neededCount = obj[k];
    const minimalSet = parseInt(neededCount / recipe.unit) + (neededCount % recipe.unit ? 1 : 0);
    return sum + minimalSet * recipe.cost;
  }, 0);
}

const chart = parseInput(test2);
const rawMaterial = getRawMaterial(chart);

console.log(chart)
const all = main(chart, 'FUEL', 1, rawMaterial);
logger.result('expanded', JSON.stringify(all, null, 2));
logger.result('to pay', pay(all, rawMaterial))
//console.log(JSON.stringify(chart, null, 2))


//justify(chart)(findMaterial('HVMC', 3, chart))

// test1 = 165
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