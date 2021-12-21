const calc = ([a, b], goal) => {
  const player1 = { id: 1, score:0, pos:a };
  const player2 = { id: 2, score:0, pos:b };
  player1.next = player2;
  player2.next = player1;

  const move = (p, round) => {
    const sum = p.pos + (round*3 -1) * 3;
    const newPos = sum %10 || 10 ;
    p.score += newPos;
    p.pos = newPos;
  }
  let player = player1;
  let round = 1;
  while (true) {
    move(player, round);
    if (player.score >= 1000) break;
    player = player.next;
    round++;
  }
  
  const rolls = 3 * round;
  return rolls * player.next.score;
}

// sum, times
const possibility = [
  [3, 1],
  [4, 3],
  [5, 6],
  [6, 7],
  [7, 6],
  [8, 3],
  [9, 1]
];

const calc2 = ([a, b], goal) => {
  const player1 = { id: 0, score:0, pos:a };
  const player2 = { id: 1, score:0, pos:b };

  const move = (p, dice) => {
    const sum = p.pos + dice;
    const newPos = sum %10 || 10 ;
    return { id: p.id, score: p.score+newPos, pos: newPos };
  }

  let pending = [{
    times: 1,
    players: [player1, player2]
  }];
  const result = [0, 0];
  let round = 0;
  while (pending.length) {
    const univ = pending.pop();
    const [current, next] = univ.players;
    possibility.forEach(possible => {
      const [sum, times] = possible;
      const after = move(current, sum);
      if (after.score >= goal) {
        result[after.id] += times * univ.times;
      } else {
        pending.push({
          times: times * univ.times,
          players: [{...next}, {...after}]
        })
      }
    })
  }
  
  return result;
}

console.log('part 1 (test):', calc([4,8], 1000))
console.log('part 1:', calc([1,5], 1000))

console.log('part 2 (test):', calc2([4,8], 21))
console.log('part 1:', calc2([1,5], 21))

