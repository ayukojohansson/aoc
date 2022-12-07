const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');


const main1 = (str, marketLength=4) => {
  let index = 0;

  const isFistMarker = i => {
    const list = new Set(str.slice(i, i + marketLength));
    return list.size === marketLength;
  }

  while (!isFistMarker(index++)) {
  }
  return index + marketLength - 1;
}


console.log(main1('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'));
console.log(main1(input));

console.log(main1('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 14));
console.log(main1(input, 14));

