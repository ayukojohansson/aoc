//let input = '^ENWWW(NEEE|SSE(EE|N))$'.slice(1,-1);
//let input = '^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$'.slice(1,-1);
//let input = '^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$'.slice(1,-1);
//let input = '^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$'.slice(1,-1);
//let input = '^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$'.slice(1,-1);

const fs = require('fs');
let input = fs.readFileSync('./input.txt', 'utf8').slice(1,-1);

const unWrap = i =>
i.replace(/\([^()]*\)/, minimizer);

const unWrap2 = i =>
i.replace(/\([^()]*\)/, minimizer2);

const hasWrap = i => /\(/.test(i);

const minimizer2 = i => {
  let daytour = false;
  let rooms = 0;
  const res = i.slice(1,-1).split('|').reduce((max, path) => {
    if (!max) max = path;
    if (!path.length) daytour = true;
    rooms += path.length;
    return max.length < path.length ? path : max;
  }, null);
  console.log(i, res, rooms);
  return `${daytour ? Array(res.length/2).fill('_').join('') : res}${Array(rooms - res.length).fill('r').join('')}`;
}
const minimizer = i => {
  let daytour = false;
  const res = i.slice(1,-1).split('|').reduce((max, path) => {
    if (!path.length) daytour = true;
    return max.length < path.length ? path : max;
  });
//  console.log(i, res);
  return daytour ? Array(res.length/2).fill('_').join('') : res;
}

while (hasWrap(input)) {
  console.log(input);
  input = unWrap2(input);
}


console.log(input);
const result = [];
while (input.indexOf('_') > -1) {
  const match = input.match(/^[^_]*_+/);
  const d = match[0].length;
  if (d > 1000) {
    console.log(d)
    console.log(input);
    break;
  }
  input = input.replace(match[0], match[0].replace(/_+r*/, ''))
}

console.log(input.slice(1000).length);


// 3089 too low
// 9174 fail