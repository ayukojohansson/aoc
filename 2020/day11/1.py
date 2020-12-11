import re

test = '''L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL'''.split('\n')

file = open("input.txt", "r")
lines = file.read().split("\n")
file.close()

def nextState(x,y,seats):
	current = seats[x][y]
	if current == 'B' or current == '.':
		return current, 0

	surrounds = [*seats[x-1][y-1:y+2], seats[x][y-1], seats[x][y+1], *seats[x+1][y-1:y+2]]
	if x == 1 and y == 3:
		print(current, surrounds)
	if current == 'L' and surrounds.count('#') == 0:
		return '#', 1
	elif current == '#' and surrounds.count('#') >= 4:
		return 'L', 1
	else:
		return current, 0

def updateSeats(seats):
	newState = []
	changeCounter = 0
	for l in range(len(seats)):
		tmp = []
		for m in range(len(seats[l])):
			state, change = nextState(l,m,seats)
			tmp.append(state)
			changeCounter += change
		newState.append(tmp)
	return newState, changeCounter

def paint(seats):
	for l in seats:
		print(''.join(l))
	print()

def part1(rawInputs):
	trueWidth = len(rawInputs[0])
	trueLength = len(rawInputs)
	print(trueWidth, trueLength)
	seats = [['B', *list(l), 'B'] for l in rawInputs]
	seats.insert(0, ['B' for s in range(len(seats[0]))])
	seats.append(['B' for s in range(len(seats[0]))])
	
	newMap, changeCount = updateSeats(seats)
	while changeCount:
		newMap, changeCount = updateSeats(newMap)
		paint(newMap)
	print('part1 = ', sum([x.count('#') for x in newMap]))
part1(lines)
