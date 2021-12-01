
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
    const materials = [];
    let i = match.length -2;
    let cost;
    while (i >= 2) {
      if (match[i-1] == 'ORE') {
        cost = Number(match[i-2]);
      } else {
        // {product: 'A', amount: 3}
        materials.push({
          product: match[i-1],
          amount: Number(match[i-2]),
        });
      }
      i -= 2;
    }
    return Object.assign(chart, {
      [match[match.length-1]]: {
        unit: Number(match[match.length-2]),
        cost,
        materials,
      }
    });
  }, {});

const produce = (recipe, toProduce, inventory, paid) => {
  if (!toProduce.length) {
//    console.log('end')
    return {
      paid,
      inventory,
    };
  }

  const { product, amount } = toProduce.shift();

  let neededCount = amount;
  const { unit, cost, materials } = recipe[product];

  // consume first from inventory if any
  if (inventory[product]) {
    if (inventory[product] >= amount) {
      inventory[product] = inventory[product] - amount;
      return produce(recipe, toProduce, inventory, paid);
    } else {
      neededCount = amount - inventory[product];
      inventory[product] = 0;
    }
  }

  const minimalSet = Math.ceil(neededCount / unit);
  inventory[product] = unit * minimalSet - neededCount;

  if (cost) {
    paid += cost * minimalSet;
    return produce(recipe, toProduce, inventory, paid);
  }
  const addition = materials.map(({ product, amount }) => ({ product, amount: amount*minimalSet}));
  return produce(recipe, [...addition, ...toProduce], inventory, paid);
}


const recipe = parseInput(test1);
// part1
console.log(JSON.stringify(recipe,null, 2));
console.log(produce(recipe, [{product: 'FUEL', amount: 1}], {}, 0));

//part2 answer is 8845261
const value = 8845262;
const all = produce(recipe, [{product: 'FUEL', amount: value}], {}, 0);
logger.result('value:', value, all.paid, all.paid > 1000000000000);


//6984557.144154275
1000000000000
789638238434
789638342532
