import re
from collections import deque, defaultdict
from itertools import combinations, product

file = open("input.txt", "r")
lines = file.read()
file.close()

test = '''.#.
..#
###''';


def getNeighbours(p, cubes):
	n = 0
	for c in cubes:
		cp = c.split(',')
		if all([abs(p[i] - int(cp[i])) < 2 for i in range(4)]):
			n += 1
#	print('getNeighbours', p, '==>', n)
	return n

def cycle(chart, cubes, size, cycleCount):
	newCubes = []
	
	for w in range(-cycleCount, cycleCount + 1):
		for layer in range(-cycleCount, cycleCount + 1):
			for y in range(-cycleCount, size + cycleCount + 1):
				for x in range(-cycleCount, size + cycleCount + 1):
					neighbours = getNeighbours([x,y,layer,w], cubes)
					cube = f'{x},{y},{layer},{w}'
					if cube in cubes:
						if (neighbours == 4 or neighbours == 3): #incluse itself
							newCubes.append(f'{x},{y},{layer},{w}')
					elif neighbours == 3:
						newCubes.append(f'{x},{y},{layer},{w}')
	return newCubes
		

def paint(chart, size):
	for l in chart:
		for i in range(size):
			print(''.join(l[i*size:size * (i + 1)]))
		print()

def main(rawInput):
	chart = []
	size = 0
	cubes = []
	lineIndex = 0
	for l in rawInput.split('\n'):
		if not size:
			size = len(l)
		for sIndex in range(size):
			p = l[sIndex]
			chart.append(p)
			if p == '#':
				cubes.append(f'{sIndex},{lineIndex},0,0')
		lineIndex += 1
	print(paint([chart], size))
	print(cubes)
	
	for cy in range(6):
		cubes = cycle([chart], cubes, size, cy+1)
		print('after cycle', cy+1, len(cubes))
		
	print('res', len(cubes))

main(lines)

