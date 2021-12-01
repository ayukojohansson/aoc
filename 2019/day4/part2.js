
/*
However, they do remember a few key facts about the password:

It is a six-digit number.
The value is within the range given in your puzzle input.
Two adjacent digits are the same (like 22 in 122345).
Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
Other than the range rule, the following are true:

111111 meets these criteria (double 11, never decreases).
223450 does not meet these criteria (decreasing pair of digits 50).
123789 does not meet these criteria (no double).
How many different passwords within the range given in your puzzle input meet these criteria?

Your puzzle input is 158126-624574.

112233 meets these criteria because the digits never decrease and all repeated digits are exactly two digits long.
123444 no longer meets the criteria (the repeated 44 is part of a larger group of 444).
111122 meets the criteria (even though 1 is repeated more than twice, it still contains a double 22).

*/


const hasDouble = str => str.split('')
  .some((d, i) => {
    return (d == str.charAt(i+1));
  });

const isIncrease = str => str.split('')
  .every((d, i) => {
    return i+1 == str.length || (d <= str.charAt(i+1));
  });

console.log(isIncrease('111111'));
console.log(isIncrease('223450'));
console.log(isIncrease('123789'));

//var input = 200;
//var result = [];
//while (input < 599) {
//  if (isIncrease(`${input}`)) {
//    result.push(input);
//    console.log(input);
//  }
//  input++;
//}
//console.log('result:', result.length)

var input = 158126;
var result = [];
var result2 = [];
while (input < 624574) {
  if (hasDouble(`${input}`) && isIncrease(`${input}`)) {
    result.push(input);
    console.log(input);
  }
  input++;
}

console.log('result:', result.length)

const hasOnlyDouble = str => str.split('')
  .some((d, i) => {
    console.log(d,str.charAt(i+1), str.charAt(i+2), (d == str.charAt(i+1)) , (d != str.charAt(i+2)));
    return (d == str.charAt(i+1)) && (d != str.charAt(i+2)) && (d != str.charAt(i-1));
  });
console.log(result.filter( d => hasOnlyDouble(`${d}`)).length)