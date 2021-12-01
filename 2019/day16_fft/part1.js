const offset = 5979351;



const logger = {
  log: (...args) => console.log('INFO:', ...args),
  error: (...args) => console.log('\x1b[41m', 'ERROR:', ...args, "\x1b[0m"),
  result: (...args) => console.log('\x1b[32m', 'RESULT:', ...args, "\x1b[0m"),
  debug: (...args) => process.env.debug == 'true' && console.log('DEBUG:',...args),
};

const input = '59793513516782374825915243993822865203688298721919339628274587775705006728427921751430533510981343323758576985437451867752936052153192753660463974146842169169504066730474876587016668826124639010922391218906707376662919204980583671961374243713362170277231101686574078221791965458164785925384486127508173239563372833776841606271237694768938831709136453354321708319835083666223956618272981294631469954624760620412170069396383335680428214399523030064601263676270903213996956414287336234682903859823675958155009987384202594409175930384736760416642456784909043049471828143167853096088824339425988907292558707480725410676823614387254696304038713756368483311';

const output = [0, 1, 0, -1];

const findRepeat = (x,y) => {
  const max = x > y ? x : y;
  let min = x > y ? y :x;
  let res = max;
  while (res % min) {
    res += max;
  }
  return res;
}

const getFactor = (index, i) => {
  return output[( Math.ceil((i+2)/(index+1)) -1 ) %4];
//  return output[Math.ceil((i+1)/(index+1)) %4];
}
//const multiPly = (index, input) => {
//  const repeat = findRepeat(input.length, 4* (index+1));
////  console.log('repeating', repeat)
//  return input.slice(0, repeat).reduce((sum, d, i) => {
//    return sum + d * getFactor(index, i+offset);
//  }, 0) * repeat;
//}


const multiPly2 = (index, input) => {
  const repeat = Math.min( input.length, findRepeat(input.length, 4* (index+1)) );
//  console.log('\nrepeating every', repeat)
  const short = input.slice(0, repeat);
  let res = 0;
  let i = index-1, factor = 1;
  while (i < repeat) {
    res += factor * sum(short.slice(i, i+index))
//    console.log(i, index+1, factor, short.slice(i, index+i), short)
    i += index*2;
    factor *= -1;
  }
  return res * input.length / repeat;
}
//console.log('multi2', multiPly2(1, '12345678'))

const takeLastDigit = d => `${d}`.slice(-1);
const sum = str => {
//  console.log('sum', str, 'res', str.split('').reduce((s, d) => s + +d, 0))
  return str.split('').reduce((s, d) => s + +d, 0);
}
const getPhase = (input) => {
  let base = sum(input);
  
  let res = '';
  for (i=0;i<input.length;i++) {
    res += takeLastDigit(base);
    base -= input[i];
  }
  return res;
}

const run = (step, input) => {
  let counter = 0;
  let current = input;
  while (counter < step) {
    current = getPhase(current);
    counter++;
  }
  return current;
}
const getInput = (times, arr) => Array(times).fill(arr).join('');

const test1 = '03036732577212944063491565474664'; // 84462026
const test2 = '12345678';  // 84462026
console.log(
  'run 1 test1:',
  run(100, getInput(10000, input).slice(5979351))
)
//console.log('should be', '84462026')

/*Input signal: 12345678

1*1  + 2*0  + 3*-1 + 4*0  + 5*1  + 6*0  + 7*-1 + 8*0  = 4 ()
1*0  + 2*1  + 3*1  + 4*0  + 5*0  + 6*-1 + 7*-1 + 8*0  = 8
1*0  + 2*0  + 3*1  + 4*1  + 5*1  + 6*0  + 7*0  + 8*0  = 2
1*0  + 2*0  + 3*0  + 4*1  + 5*1  + 6*1  + 7*1  + 8*0  = 2
1*0  + 2*0  + 3*0  + 4*0  + 5*1  + 6*1  + 7*1  + 8*1  = 6
1*0  + 2*0  + 3*0  + 4*0  + 5*0  + 6*1  + 7*1  + 8*1  = 1
1*0  + 2*0  + 3*0  + 4*0  + 5*0  + 6*0  + 7*1  + 8*1  = 5
1*0  + 2*0  + 3*0  + 4*0  + 5*0  + 6*0  + 7*0  + 8*1  = 8

After 1 phase: 48226158
*/

//49254779014784758313861270414666821517894808719399691830844301833837117480017943232969761130445943389054322896447276097295165476883560960614738432855473049590997167405832585250502207695070602102000103756865642605704780639486194605036579685988296936620106099042931021608333816000887227706641796538017108728584911897917309178277860596496400723451537501536535311248960217280648085641275160635668174182077951827079453305124512272975241628029325085098860341266697161657970335638877438913372910260437139163766347578006461206730612090904392007285711883209594760806137179869695938064564022180329720721654786766022285183594310080059699646309088763201813933311
//console.log(
//  run(100, getInput(10000, test1))
////  run(100, getInput(1, input).slice(600), 600)
//);
//console.log(getInput(10000, test1))