
const logger = {
  log: (...args) => console.log('INFO:', ...args),
  error: (...args) => console.log('\x1b[41m', 'ERROR:', ...args, "\x1b[0m"),
  result: (...args) => console.log('\x1b[32m', 'RESULT:', ...args, "\x1b[0m"),
  debug: (...args) => process.env.debug == 'true' && console.log('DEBUG:',...args),
};

const input = '59793513516782374825915243993822865203688298721919339628274587775705006728427921751430533510981343323758576985437451867752936052153192753660463974146842169169504066730474876587016668826124639010922391218906707376662919204980583671961374243713362170277231101686574078221791965458164785925384486127508173239563372833776841606271237694768938831709136453354321708319835083666223956618272981294631469954624760620412170069396383335680428214399523030064601263676270903213996956414287336234682903859823675958155009987384202594409175930384736760416642456784909043049471828143167853096088824339425988907292558707480725410676823614387254696304038713756368483311';

const test1 = '12345678';
const output = [0, 1, 0, -1];

const getFactor = (index, i) => {
  return output[( Math.ceil((i+2)/(index+1)) -1 ) %4];
//  return output[Math.ceil((i+1)/(index+1)) %4];
}
const multiPly = (index, input) => {
  return input.reduce((sum, d, i) => {
    return sum + d * getFactor(index, i);
  }, 0)
}

const takeLastDigit = d => `${d}`.slice(-1);

const getPhase = input => {
  const arr = input.split('');
  let res = '';
  for (i=0;i<arr.length;i++) {
    res += takeLastDigit(
      multiPly(i, arr)
    );
  }
  return res;
}

const run = (step, input) => {
  let counter = 0;
  let current = input;
  while (counter < step) {
    current = getPhase(current);
    counter++;
    if(counter%1000 == 0)
      console.log('at', counter);
  }
  return current;
}

//console.log(getFactor(1,0))
//console.log(getFactor(1,1))
//console.log(getFactor(1,2))
//console.log(getFactor(1,3))
//console.log(getFactor(1,4))
//console.log(getFactor(1,5))
//console.log(getFactor(1,6))
//console.log(getFactor(1,7))
//
//console.log('\n')
//console.log(getFactor(2,0))
//console.log(getFactor(2,1))
//console.log(getFactor(2,2))
//console.log(getFactor(2,3))
//console.log(getFactor(2,4))
//console.log(getFactor(2,5))
//console.log(getFactor(2,6))
//console.log(getFactor(2,7))
//console.log('\n')
//
//console.log(getFactor(3,0))
//console.log(getFactor(3,1))
//console.log(getFactor(3,2))
//console.log(getFactor(3,3))
//console.log(getFactor(3,4))
//console.log(getFactor(3,5))
//console.log(getFactor(3,6))
//console.log(getFactor(3,7))
console.log('result after 100*10000', run(100, input));
//console.log(takeLastDigit(
//      multiPly(0, test1.split(''))
//    ))
//console.log(takeLastDigit(
//      multiPly(1, test1.split(''))
//    ))
//console.log(takeLastDigit(
//      multiPly(2, test1.split(''))
//    ))
//console.log(takeLastDigit(
//      multiPly(3, test1.split(''))
//    ))