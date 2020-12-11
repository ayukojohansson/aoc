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

def findSeat(x,y, seats, vx, vy):
	seat = '.'
	t = 0
	while seat == '.' and seat != 'B':
		t += 1
		seat = seats[x + vx*t][y + vy*t]
	return seat

def nextState(x,y,seats):
	current = seats[x][y]
	if current == 'B' or current == '.':
		return current, 0

	directions = [
		[1,1],
		[1,-1],
		[-1,1],
		[-1,-1],
		[1,0],
		[-1,0],
		[0,1],
		[0,-1],
	]
	occupied = [findSeat(x, y, seats, vx, vy) for vx, vy in directions].count('#')

	if current == 'L' and occupied == 0:
		return '#', 1
	elif current == '#' and occupied >= 5:
		return 'L', 1
	else:
		return current, 0

def updateSeats(seats):
	newState = []
	changeCounter = 0
	for row in range(len(seats)):
		tmp = []
		for col in range(len(seats[row])):
			state, change = nextState(row, col, seats)
			tmp.append(state)
			changeCounter += change
		newState.append(tmp)
	return newState, changeCounter

def paint(seats):
	for l in seats:
		print(''.join(l))
	print()

def part2(rawInputs):
	seats = [['B', *list(l), 'B'] for l in rawInputs]
	seats.insert(0, ['B' for s in range(len(seats[0]))])
	seats.append(['B' for s in range(len(seats[0]))])
	paint(seats)

	newSeatMap, changeCount = updateSeats(seats)
	while changeCount:
		newSeatMap, changeCount = updateSeats(newSeatMap)
		paint(newSeatMap)

	print('part2 = ', sum([x.count('#') for x in newSeatMap]))

part2(lines)
