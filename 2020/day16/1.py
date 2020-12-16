import re
from collections import deque, defaultdict
from itertools import combinations, product

file = open("input.txt", "r")
lines = file.read()
file.close()

test = '''class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12''';

def flatten(l):
 	return [item for sublist in l for item in sublist]

def flattenInt(l):
 	return [int(item) for sublist in l for item in sublist]

def parse(rawInput):
	f, mine, nearby =rawInput.split('\n\n')

	f = [ [l.split(' ')[-3].split('-'), l.split(' ')[-1].split('-')] for l in f.split('\n')]
	mine = mine.split('\n')[1].split(',')
	nearby = [l.split(',') for l in nearby.split('\n')[1:]]

	return f, mine, nearby

def part1(rawInput):
	fields, mine, nearby = parse(rawInput)

	def isValid(x):
		for field in fields:
			if isValidField(x, field):
				return True
		return False

	def isValidField(x, field):
		for l,h in field:
			if int(l) <= x and x <= int(h):
				return True
		return False

	invalid = 0
	for sublist in nearby:
		for n in sublist:
			if not isValid(int(n)):
				invalid += int(n)

	print()
	print('part1 answer', invalid)
	print('part1 answer', sum([ int(x) for sub in nearby for x in sub if not isValid(int(x)) ]))
	print()


	validNearby = [n for n in nearby if all([isValid(int(x)) for x in n])]
	possible = defaultdict(list)
	fieldSize = len(fields)
	for f in range(fieldSize):
		for i in range(fieldSize):
			if all([isValidField(int(n[i]), fields[f]) for n in validNearby]):
				possible[f].append(i)

	for i in range(fieldSize):
		print(i, possible[i])

	found = []
	res = []
	while possible:
		f, p = min(possible.items(), key=lambda x: len(x[1]))

		couldBe = [x for x in p if x not in found]
		if len(couldBe) == 1:
			found.append(couldBe[0])
		
			# departure fields are 0 to 6
			if f < 6:
				res.append(couldBe[0])
			del possible[f]
		else:
			print('dead lock?')

	print(res)
	total = 1
	for r in res:
		total *= int(mine[r])
	print()
	print('part2 answer', total)


part1(lines)
