
/*

The image you received is 25 pixels wide and 6 pixels tall.

To make sure the image wasn't corrupted during transmission, the Elves would like you to find the layer that contains the fewest 0 digits. On that layer, what is the number of 1 digits multiplied by the number of 2 digits?
*/


const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8').split('').map(s => Number(s));
const WIDTH = 25;
const HEIGHT = 6;

//const input = '0222112222120000'.split('').map(s => Number(s));
//const WIDTH = 2;
//const HEIGHT = 2;



const image = [];

const getLayer = (input) => {
  return input.splice(0, WIDTH * HEIGHT);
};

const getImage = (input) => {
  const res = [];
  while (input.length) {
    res.push(getLayer(input));
  }
  return res;
}

const getColor = input => {
  const image = getImage(input);
  return image.reduce((final, layer) => {
    return final.map((d, i) => d == 2 ? layer[i] : d);
  })
}
const paint = (input) => {
  for (var i=0; i < HEIGHT; ++i) {
    console.log(input
                .splice(0,WIDTH)
                .map(d => d == 0 ? ' ' : '1')
                .join('')
               )
  }
}

console.log(paint(getColor(input)))


