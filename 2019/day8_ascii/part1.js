
/*

The image you received is 25 pixels wide and 6 pixels tall.

To make sure the image wasn't corrupted during transmission, the Elves would like you to find the layer that contains the fewest 0 digits. On that layer, what is the number of 1 digits multiplied by the number of 2 digits?
*/


const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8').split('').map(s => Number(s));
console.log('input', input.length)
//const input = '123456789012'.split('').map(s => Number(s));


const WIDTH = 25;
const HEIGHT = 6;

const getLayer = (input) => {
  if (input.length < WIDTH * HEIGHT) console.log('uneven!!', input)
  return input.splice(0, WIDTH * HEIGHT);
};

const getImage = (input) => {
  const res = [];
  while (input.length) {
    res.push(getLayer(input));
  }
  return res;
}

const counter = (layer) =>
  layer.reduce((countObj, d) => {
    countObj[d] = (countObj[d] || 0) + 1;
    return countObj;
  }, {});

const findLayerWithMost0 = image =>
  image.reduce(({ min, layerId, hash }, layer, i) => {
    const count = counter(layer);
    if (!min || count['0'] < min) {
      return {
        min: count['0'],
        layerId: i,
        hash: count['1'] * count['2'],
      };
    }
    return { min, layerId, hash };
  }, { min: undefined, layerId: undefined});

console.log(findLayerWithMost0(getImage(input)))

// 2115 fail
// 1690 ok
