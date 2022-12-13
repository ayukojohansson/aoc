const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

const isInOrderArray = (a1, a2) => {
  let index = 0;
  while (isInOrder(a1[index], a2[index]) == 'Q') {
    index++;
  }
  const res = isInOrder(a1[index], a2[index]);
  return res == undefined ? 'Q' : res;
}

const isInOrder = (p1, p2) => {
  if (Number.isInteger(p1) && Number.isInteger(p2)) {
    return p1 == p2 ? 'Q' : p1 < p2;
  } else if (p1 !== undefined && p2 == undefined) {
    return false;
  } else if (p1 == undefined && p2 !== undefined) {
    return true;
  } else if (Array.isArray(p1) && Array.isArray(p2)) {
    return isInOrderArray(p1, p2);
  } else if (Array.isArray(p1) && !Array.isArray(p2)) {
    return isInOrderArray(p1, [p2]);
  } else if (!Array.isArray(p1) && Array.isArray(p2)) {
    return isInOrderArray([p1], p2);
  }
}

const main = (str) => {
  const pairs = str.split('\n\n');
  const packages = pairs.map(pair => {
    return pair.split('\n').map(eval)
  })
  
  const part1 = packages.reduce((sum, package, index) => {
    const res = isInOrder(...package);
    return res ? sum + index+1 : sum;
  }, 0)
  console.log(part1)
}

const main2 = (str) => {
  const pairs = str.split('\n\n');
  const packages = pairs.flatMap(pair => {
    return pair.split('\n').map(eval)
  })
  .concat([[[2]],[[6]]])
  .sort((a, b) => isInOrder(a,b) ? -1 : 1)
  
  const res = packages.reduce((res, p, i) => {
    if (JSON.stringify(p) == JSON.stringify([[2]])) {
      return res * (i+1);
    }
    if (JSON.stringify(p) == JSON.stringify([[6]])) {
      return res * (i+1);
    }
    return res;
  }, 1);
  console.log(res)
}


main(test)
main(input)
main2(test)
main2(input)

