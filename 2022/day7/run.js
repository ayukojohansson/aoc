const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test =`$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

const main1 = (str, marketLength=4) => {
  const commands = str.split('\n');
  const tree = {};
  let index = 1;
  let current = tree;
  
  while (index < commands.length) {
    const [a, b, c] = commands[index].split(' ');
    if (a == '$') {
      if (b == 'ls') {
        
      } else if (b == 'cd') {
        if (c == '..') {
          current = current.parent;
        } else {
          current = current[c];
        }
      }
      
    } else if (a == 'dir') {
      current[b] = { parent: current };
    } else {
      current [b] = { size: parseInt(a, 10) };
    }
    
    index++
  }

  let part1 = 0; let sizes = [];
  const getSize = (t) => {
    const size = Object.keys(t).reduce((s, key) => {
      if (key == 'parent') return s;
      if (t[key].size) return s + t[key].size;
      return s + getSize(t[key]);
    }, 0);
    
    t.size = size;
    sizes.push(size)
    if (size <= 100000) part1 += size;

    return size;
  }

  getSize(tree);
  console.log('part1', part1)
  
  const needed = 30000000 - (70000000 - tree.size);

  const part2 = sizes.reduce((res, s) => {
    return (s >= needed && s < res) ? s : res;
  }, tree.size)
  
  console.log('part2', part2)
}


main1(test);
main1(input);


