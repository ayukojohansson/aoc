import re
from collections import deque

test = '''F10
N3
F7
R90
F11'''.split('\n')

file = open("input.txt", "r")
lines = file.read().split("\n")
file.close()

def nextState(current, directions, comm):
	action, value = comm[0], int(comm[1:])
	
	if action == 'F':
		direction = directions[0]
		return [current[0]+direction[0]*value, current[1]+direction[1]*value], directions
	if action == 'N':
		return [current[0], current[1] - value], directions
	if action == 'S':
		return [current[0], current[1] + value], directions
	if action == 'E':
		return [current[0] + value, current[1]], directions
	if action == 'W':
		return [current[0] - value, current[1]], directions
	if action == 'R':
		directions.rotate(-int(value/90))
		print('rotate', int(value/90))
		return current, directions
	if action == 'L':
		directions.rotate(int(value/90))
		return current, directions

def part1(rawInputs):
	print(rawInputs)
	current = [0, 0]

	directions = deque([
		[1, 0],
		[0, 1],
		[-1, 0],
		[0, -1],
	])

	for command in rawInputs:
		current, directions = nextState(current, directions, command)
		print(current, directions)
	print('part1 = ', abs(current[0]) + abs(current[1]))

#part1(test)
part1(lines)
