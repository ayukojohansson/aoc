import re

test = '''F10
N3
F7
R90
F11'''.split('\n')

file = open("input.txt", "r")
lines = file.read().split("\n")
file.close()

def nextState(current, wayPoint, comm):
	action, value = comm[0], int(comm[1:])
	
	if action == 'F':
		return [current[0]+wayPoint[0]*value, current[1]+wayPoint[1]*value], wayPoint
	if action == 'N':
		return current, [wayPoint[0], wayPoint[1] - value]
	if action == 'S':
		return current, [wayPoint[0], wayPoint[1] + value]
	if action == 'E':
		return current, [wayPoint[0] + value, wayPoint[1]]
	if action == 'W':
		return current, [wayPoint[0] - value, wayPoint[1]]
	if action == 'R':
		return current, rotate(wayPoint, +1, value//90)
	if action == 'L':
		return current, rotate(wayPoint, -1, value//90)

def rotate(points, factor, times):
	while times > 0:
		points = [-1*factor*points[1], factor*points[0]]
		times -= 1
	return points
	
def part2(rawInputs):
	print(rawInputs)
	current = [0, 0]
	wayPoint = [10, -1]

	for command in rawInputs:
		current, wayPoint = nextState(current, wayPoint, command)
		print(current, wayPoint)
	print('part2 = ', abs(current[0]) + abs(current[1]))

part2(test)
part2(lines)
