const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input;
const test = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`;

const points = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137 
}
const points2 = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4 
}
const closing = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>'
}
const analize = (line, getRemaining) => {
  let i=0;
  const expected = [];
  let invalid = 0;
  while(!invalid && i < line.length) {
    const nextClosing = closing[line[i]];
    if (nextClosing) expected.push(nextClosing);
    else if (expected.pop() == line[i]) {
      // matching close tag
    } else {
      invalid = points[line[i]];
    }
    i++;
  }
  if (getRemaining) return invalid ? [] : expected;
  return invalid;
}
const calc = (inputData) => {
  const lines = inputData.split('\n');
  
  return lines.reduce((sum, line) => {
    return sum + analize(line);
  }, 0);
}

const calc2 = (inputData) => {
  const lines = inputData.split('\n');
  
  const result = lines.reduce((sum, line) => {
    const remains = analize(line, true);
    remains.length && sum.push(
      remains.reverse().reduce((s, r) => s*5 + points2[r], 0)
    )
    return sum; 
  }, []).sort((a,b) => a-b);

  return result[parseInt(result.length/2)]
}


console.log(validate('[({(<(())[]>[[{[]{<()<>>'))
console.log('part 1:', calc(test))
console.log('part 1:', calc(data))

console.log('\npart 2:', calc2(test, true))
console.log('part 2:', calc2(data, true))

