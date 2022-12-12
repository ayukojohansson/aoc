module.exports = {
0: {
  items: [98, 70, 75, 80, 84, 89, 55, 98],
  operation: old => old * 2,
  test: value => value % 11 == 0 ? 1 : 4,
},
1: {
  items: [59],
  operation: old => old * old,
  test: value => value % 19 == 0 ? 7 : 3,
},
2: {
  items: [77, 95, 54, 65, 89],
  operation: old => old + 6,
  test: value => value % 7 == 0 ? 0 : 5,
},
3: {
  items: [71, 64, 75],
  operation: old => old + 2,
  test: value => value % 17 == 0 ? 6 : 2,
},
4: {
  items: [74, 55, 87, 98],
  operation: old => old * 11,
  test: value => value % 3 == 0 ? 1 : 7,
},
5: {
  items: [90, 98, 85, 52, 91, 60],
  operation: old => old + 7,
  test: value => value % 5 == 0 ? 0 : 4,
},
6: {
  items: [99, 51],
  operation: old => old + 1,
  test: value => value % 13 == 0 ? 5 : 2,
},
7: {
  items: [98, 94, 59, 76, 51, 65, 75],
  operation: old => old + 5,
  test: value => value % 2 == 0 ? 3 : 6,
}
};