//At the first Go / No Go poll, every Elf is Go until the Fuel Counter-Upper. They haven't determined the amount of fuel required yet.
//
//Fuel required to launch a given module is based on its mass. Specifically, to find the fuel required for a module, take its mass, divide by three, round down, and subtract 2.
//
//For example:
//
//For a mass of 12, divide by 3 and round down to get 4, then subtract 2 to get 2.
//For a mass of 14, dividing by 3 and rounding down still yields 4, so the fuel required is also 2.
//For a mass of 1969, the fuel required is 654.
//For a mass of 100756, the fuel required is 33583.


const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input.split('\n');

//console.log(data);

const getNeededFuel = mass => (parseInt(Number(mass) / 3) - 2);

const sum = data.reduce((total, module) => (total + getNeededFuel(module)), 0);
const sumTest = ['12','14'].reduce((total, module) => (total + getNeededFuel(module)), 0);

console.log(sum)
