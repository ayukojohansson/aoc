const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

//[W] [V]     [P]                    
//[B] [T]     [C] [B]     [G]        
//[G] [S]     [V] [H] [N] [T]        
//[Z] [B] [W] [J] [D] [M] [S]        
//[R] [C] [N] [N] [F] [W] [C]     [W]
//[D] [F] [S] [M] [L] [T] [L] [Z] [Z]
//[C] [W] [B] [G] [S] [V] [F] [D] [N]
//[V] [G] [C] [Q] [T] [J] [P] [B] [M]
// 1   2   3   4   5   6   7   8   9 

const main1 = (str) => {
  const [one, two] = str.split('\n\n');
  const lines = one.split('\n');
  const stacks = {};
  for (let i=lines.length-1; i>=0; i--) {
    for (let j=1; j<=9; j++) {
      if (i == lines.length-1) {
        stacks[j] = [];
      } else {
        const s = lines[i][j*4-3]
        s != ' ' && stacks[j].push(s);
      }
    }
  }
  console.log(stacks)
  two.split('\n').forEach((line) => {
    const [m, a1, f, a2, t, a3] = line.split(' ').map(d=>parseInt(d,10))
    
    for (let i=0;i<a1;i++) {
      stacks[a3].push(stacks[a2].pop());
    }
  });
  let res =''
   for (let j=1; j<=9; j++) {
     res += stacks[j].pop()
   }
  return res;
}
const main2 = (str) => {
  const [one, two] = str.split('\n\n');
  const lines = one.split('\n');
  const stacks = {};
  for (let i=lines.length-1; i>=0; i--) {
    for (let j=1; j<=9; j++) {
      if (i == lines.length-1) {
        stacks[j] = [];
      } else {
        const s = lines[i][j*4-3]
        s != ' ' && stacks[j].push(s);
      }
    }
  }
  console.log(stacks)
  two.split('\n').forEach((line) => {
    const [m, a1, f, a2, t, a3] = line.split(' ').map(d=>parseInt(d,10))
    
    stacks[a3].push(...stacks[a2].splice(-a1));
  });
  let res =''
   for (let j=1; j<=9; j++) {
     res += stacks[j].pop()
   }
  return res;
}


console.log(main1(input));
console.log(main2(input));

