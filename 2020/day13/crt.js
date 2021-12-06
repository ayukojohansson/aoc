
const input = '17,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,523,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,13,19,x,x,x,23,x,x,x,x,x,x,x,787,x,x,x,x,x,37,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,29';
const test = '7,13,x,x,59,x,31,19';

const buses = (data) => data
  .split(',')
  .flatMap((d, i) => {
    if (d == 'x') return [];
    const bus = BigInt(d);
    const reminder = i ? bus - BigInt(i) % bus : BigInt(0);
    return [[bus, reminder]];
  });

//https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
//https://ja.wikipedia.org/wiki/%E3%83%A6%E3%83%BC%E3%82%AF%E3%83%AA%E3%83%83%E3%83%89%E3%81%AE%E4%BA%92%E9%99%A4%E6%B3%95
const egcd = (m, n) => {
  let x = 1n, y = 0n, r = 0n, s = 1n;

  while (n !== 0n) {
    let c = m % n
    let q = m / n
    m = n
    n = c

    let rPrim = r
    let sPrim = s
    r = x - q * r
    s = y - q * s
    x = rPrim
    y = sPrim
  }

//  mx + ny = gcd(m,n)
  return { gcd: m, x, y }
}

const modulo = (a, b) => {
  const x = a % b
  return x < 0n ? x + b : x
}

// https://github.com/caderek/aoc2020/tree/main/src/day13
// https://qiita.com/drken/items/ae02240cd1f8edfc86fd
const crt = (congruences) =>
  modulo(
    congruences
      .map(([mod, rem]) => {
        const N = congruences.reduce((acc, [m]) => (m !== mod ? acc*m : acc), BigInt(1));
        return rem * N * egcd(N, mod).x;
      })
      .reduce((sum, s) => sum + s),
    congruences.reduce((acc, [mod]) => acc * mod, 1n)
  );

console.log(crt(buses(test)));
console.log(crt(buses(input)));

