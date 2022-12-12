module.exports = {
0: {
  items: [98, 70, 75, 80, 84, 89, 55, 98],
  operation: old => old * 2n,
  test: value => value % 11n == 0n ? 1 : 4,
},
1: {
  items: [59],
  operation: old => old * old,
  test: value => value % 19n == 0n ? 7 : 3,
},
2: {
  items: [77, 95, 54, 65, 89],
  operation: old => old + 6n,
  test: value => value % 7n == 0n ? 0 : 5,
},
3: {
  items: [71, 64, 75],
  operation: old => old + 2n,
  test: value => value % 17n == 0n ? 6 : 2,
},
4: {
  items: [74, 55, 87, 98],
  operation: old => old * 11n,
  test: value => value % 3n == 0n ? 1 : 7,
},
5: {
  items: [90, 98, 85, 52, 91, 60],
  operation: old => old + 7n,
  test: value => value % 5n == 0n ? 0 : 4,
},
6: {
  items: [99, 51],
  operation: old => old + 1n,
  test: value => value % 13n == 0n ? 5 : 2,
},
7: {
  items: [98, 94, 59, 76, 51, 65, 75],
  operation: old => old + 5n,
  test: value => value % 2n == 0n ? 3 : 6,
}
};