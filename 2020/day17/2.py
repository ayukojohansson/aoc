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

def getNeighbours_opt(p, cubes):
	n = 0

	for ww in range(-1,2):
		w = p[3] + ww
		for zz in range(-1,2):
			z = p[2] + zz
			for yy in range(-1,2):
				y = p[1] + yy
				for xx in range(-1,2):
					x = p[0] + xx
					cube = f'{x},{y},{z},{w}'
					if cube in cubes:
						n += 1
	return n

def cycle(cubes, size, cycleCount):
	newCubes = []
	
	for w in range(-cycleCount, cycleCount + 1):
		for layer in range(-cycleCount, cycleCount + 1):
			for y in range(-cycleCount, size + cycleCount + 1):
				for x in range(-cycleCount, size + cycleCount + 1):
					neighbours = getNeighbours([x,y,layer,w], cubes)
					cube = f'{x},{y},{layer},{w}'
					if cube in cubes:
						if (neighbours == 4 or neighbours == 3): #incluse itself
							newCubes.append(cube)
					elif neighbours == 3:
						newCubes.append(cube)
	return newCubes

def cycle_opt(cubes, size, cycleCount):
	newCubes = set()
	done = set()
	
	for c in cubes:
		cp = list(map(int, c.split(',')))
#		print(cp)
		for ww in range(-1,2):
			w = cp[3] + ww
			for zz in range(-1,2):
				z = cp[2] + zz
				for yy in range(-1,2):
					y = cp[1] + yy
					for xx in range(-1,2):
						x = cp[0] + xx
						cube = f'{x},{y},{z},{w}'
						
						if not cube in done:
							neighbours = getNeighbours_opt([x,y,z,w], cubes)
							done.add(cube)
							if cube in cubes:
								if (neighbours == 4 or neighbours == 3): #incluse itself
									newCubes.add(cube)
							elif neighbours == 3:
								newCubes.add(cube)
		
	return newCubes	

def paint(chart, size):
	for l in chart:
		for i in range(size):
			print(''.join(l[i*size:size * (i + 1)]))
		print()

def main(rawInput):
	chart = []
	size = 0
	cubes = set()
	lineIndex = 0
	for l in rawInput.split('\n'):
		if not size:
			size = len(l)
		for sIndex in range(size):
			p = l[sIndex]
			chart.append(p)
			if p == '#':
				cubes.add(f'{sIndex},{lineIndex},0,0')
		lineIndex += 1
	print(paint([chart], size))
	print(cubes)
	
	for cy in range(6):
		cubes = cycle_opt(cubes, size, cy+1)
		print('after cycle', cy+1, len(cubes))
		
	print('res', len(cubes))

main(lines)

