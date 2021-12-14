const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input;
const test = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

const calc = (inputData, isPart2) => {
  const [template, lines] = inputData.split('\n\n');
  const rules = lines.split('\n').reduce((acc, line) => {
    const [a, b] = line.split(' -> ');
    acc[a] = a[0] + b + a[1];
    return acc;
  }, {});

  const insert = (rule) => {
    let res = '';
    for (let p=0; p < rule.length - 1; p++) {
      res = res.slice(0, -1) + rules[rule.slice(p,p+2)];
    }
    return res;
  }
  let answer = template;
  for (let i=0; i <10; i++) {
    answer = insert(answer);
  }
  const counts = answer.split('').reduce((c,l) => {
    c[l] = (c[l] || 0) +1;
    return c;
  }, {});
  const num = Object.values(counts).sort((a,b)=> b-a);

  return num[0]-num[num.length-1];
}

const calc2 = (inputData, isPart2) => {
  const [template, lines] = inputData.split('\n\n');
  const rules = lines.split('\n').reduce((acc, line) => {
    const [a, b] = line.split(' -> ');
    acc[a] = a[0] + b + a[1];
    return acc;
  }, {});

  const insert = (rule) => {
    let res = '';
    for (let p=0; p < rule.length - 1; p++) {
      res = res.slice(0, -1) + rules[rule.slice(p,p+2)];
    }
    return res;
  }

  const after10 = (str) => {
    let answer = str;
    for (let i=0; i <10; i++) {
      answer = insert(answer);
    }
    const breakdown = {}
    for (let i=0; i <answer.length -1; i++) {
      const piece = answer.slice(i,i+2);
      breakdown[piece] = (breakdown[piece] || 0) + 1
    }
    return breakdown;
  };

  const cache = {};

  const getBreakdownAfter10 = (breakdown) => {
    let finalBreakdown = {};
    
    Object.keys(breakdown).forEach(piece => {
      const factor = breakdown[piece];
      if (!cache[piece]) cache[piece] = after10(piece);
      Object.keys(cache[piece]).forEach(k => finalBreakdown[k] = (finalBreakdown[k] || 0) + cache[piece][k] * factor);
    })

    return finalBreakdown;
  };

  const count = (breakdown) => {
    const sum = Object.keys(breakdown).reduce((c, piece) => {
      const factor = breakdown[piece];
      c[piece[0]] = (c[piece[0]] || 0) + factor;
      c[piece[1]] = (c[piece[1]] || 0) + factor;
      return c;
      }, {});
    sum[template[0]]++;
    sum[template[template.length-1]]++;
    Object.keys(sum).forEach(key => sum[key] /= 2);
    return sum;
  };

  const res10= after10(template);
  const res20 = getBreakdownAfter10(res10);
  const res30 = getBreakdownAfter10(res20);
  const res40 = getBreakdownAfter10(res30);

  const sum = count(res40);

  const num = Object.values(sum).sort((a,b)=> b-a);

  return num[0]-num[num.length-1];
}


console.log('part 1:', calc(test))
console.log('part 1:', calc(data))

console.log('\npart 2:', calc2(test, true))
console.log('part 2:', calc2(data, true))

