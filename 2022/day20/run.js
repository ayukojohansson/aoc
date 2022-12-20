const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const test = `1
2
-3
3
-2
0
4`;

const main2 = (input, boost=1, mix=1) => {
  const lines = input.split('\n');
  let zero;
  const coors = lines.reduce((coor, line, i) => {
    const id = i;
    const value = parseInt(line, 10) * boost;
    coor[id] = { id, value, prev: i>0 ? coor[i-1] : undefined };
    return coor;
  }, {});

  coors[0].prev = coors[lines.length-1]
  coors[lines.length-1].next = coors[0]
  
  let index = 0;
  while (index < lines.length-1) {
    if (coors[index].value == 0) {
      zero=coors[index];
    }

    coors[index].next = coors[index+1]
    index++;
  } 
  
  const move = (item, step) => {
    let res = item;
    for (let i=0; i<=Math.abs(step); i= i + 1) {
      res = step > 0 ? res.next : res.prev;
    }
    return step > 0 ? res : res.next;
  }


  for (let loop=0; loop<mix; loop++) {
    index = 0;
    while (index<lines.length) {
      const self = coors[index]
      if (self.value !== 0) {
        self.prev.next=self.next;
        self.next.prev=self.prev;

        const target = move(self, self.value%(lines.length-1));

        target.prev.next = self;
        self.prev=target.prev;
        self.next=target;
        target.prev=self;
      }
      index++;
    }
  }
  const a = move(zero, 1000).prev;
  const b = move(zero, 2000).prev;
  const c = move(zero, 3000).prev;
  console.log(
    a.value + 
    b.value +
    c.value
  )
}

main(test)
main(input)

main(test, 811589153, 10)
main(input, 811589153, 10)


