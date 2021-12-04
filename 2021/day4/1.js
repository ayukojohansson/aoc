const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input.split('\n\n');
const test = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7  `.split('\n\n');

const getScore = ({ bingoAt, card }, calls) => {
  const sum = calls.slice(bingoAt + 1).reduce((sum, call) => {
    return card.has(call) ? sum + parseInt(call, 10) : sum;
  }, 0);
  return sum * calls[bingoAt]
}

const calc = (inputData) => {
  const [callsLine, ...cardLines] = inputData;
  const calls = callsLine.split(',');
  const points = calls.reduce((point, call, i) => ({ ...point, [call]: i }), {});

  let winner = { 'bingoAt': 100 };
  let loser = { 'bingoAt': 0 };

  // Card
  cardLines.forEach((cardLine) => {
    const card = new Set();
    let cardBingo = 100;
    let cols = []

    // Row
    cardLine.split('\n').forEach(row => {
      let rowBingo = 0;
      row.trim().split(/\s+/).forEach((number, i) => {
        cols[i] = [...(cols[i] || []), number];
        rowBingo = Math.max(rowBingo, points[number]);
        card.add(number);
      });
      cardBingo = Math.min(rowBingo, cardBingo);
    });

    // Col
    cols.forEach(col => {
      const colBingo = col.reduce((colBingo, number) => {
        return Math.max(colBingo, points[number])
      }, 0)
      cardBingo = Math.min(colBingo, cardBingo);
    });

    if (winner.bingoAt > cardBingo) {
      winner.bingoAt = cardBingo;
      winner.card = card;
    }
    
    if (loser.bingoAt < cardBingo) {
      loser.bingoAt = cardBingo;
      loser.card = card;
    }

  });
  
  return [getScore(winner, calls), getScore(loser, calls)]
}

console.log('part 1 and 2:', calc(test))
console.log('part 1 and 2:', calc(data))
