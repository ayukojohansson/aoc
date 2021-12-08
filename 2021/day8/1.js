const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input;
const test = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

const calc = (inputData) => {
  const lines = inputData.split('\n');
  
  return lines.reduce((sum, line) => {
    const count = line
      .split(' | ')[1]
      .split(' ')
      .reduce((s, d) => {
        return (d.length <= 4 || d.length == 7 )? s+1 : s;
      }, 0)
    return sum + count;
  }, 0);
  
}

const numbers = {
  'abcefg':0,
  'cf': 1,
  'acdeg': 2,
  'acdfg': 3,
  'bcdf': 4,
  'abdfg': 5,
  'abdefg': 6,
  'acf': 7,
  'abcdefg': 8,
  'abcdfg': 9
}
const counts = Object.keys(numbers).reduce((c, n) => {
  n.split('').forEach(a => c[a] = (c[a] || 0 ) +1);
  return c;
}, {})
console.log(counts)

const getOutput = ([digits, output]) => {
  const res = digits
    .split(' ')
    .reduce((acc, code) => {
      const length = code.length;
      if (length == 7) {
        acc['abcdefg'] = code;
      } else if (length == 4) {
        acc['bcdf'] = code;
      } else if (length == 2) {
        acc['cf'] = code;
      }
      code.split('').forEach(a => acc['counts'][a] = (acc['counts'][a] || 0 ) +1);
      return acc
    }, { counts: {} });

  Object.keys(res.counts).forEach(c => {
    switch (res.counts[c]) {
      case 6:
        res['b'] = c;
        break;
      case 4:
        res['e'] = c;
        break;
      case 9:
        res['f'] = c;
        break;
      case 8:
        res['ac'] = (res['ac'] || '') + c;
        break;
      case 7:
        res['dg'] = (res['dg'] || '') + c;
        break;
    }
  });
  res['c'] = res['cf'].replace(res.f, '');
  res['d'] = res['bcdf'].replace(res.b, '').replace(res.c, '').replace(res.f, '');
  res['a'] = res['ac'].replace(res.c, '');
  res['g'] = res['dg'].replace(res.d, '');

  const lookup = Object.keys(numbers).reduce((l,n) => {
    const code = n.split('').map(m => res[m]).sort().join('');
    l[code] = numbers[n];
    return l;
  }, {})

  return output 
    .split(' ')
    .reduce((acc, o) => {
      const code = o.split('').sort().join('');
      return acc + lookup[code]
    }, '');

}

const calc2 = (inputData) => {
  const lines = inputData.split('\n');
  const outputs = lines.map(l => getOutput(l.split(' | ')));
  return outputs.reduce((a,b)=> a + parseInt(b,10), 0)
  
}

console.log('part 1:', calc(test))
console.log('part 1:', calc(data))

console.log('\npart 2:', calc2(test))
console.log('part 2:', calc2(data))
