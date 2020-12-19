import re
from collections import deque, defaultdict
from itertools import combinations, product

file = open("input.txt", "r")
lines = file.read()
file.close()

# free from ()
def calc(formula, isPart2):
	rest = formula

	if isPart2:
		while '+' in rest:
			i = rest.index('+')
			rest = [*rest[:i-1], rest[i - 1] + rest[i + 1], *rest[i+2:]]
	
	val, *rest = rest
	res = val
	while rest:
		opr, val, *rest = rest
		if opr == '+':
			res = res + val
		elif opr == '*':
			res = res * val
	
	return res

def parse(string):
	return [x if x in '*+()' else int(x) for x in string if x != ' ' ]

# get rid of ()
def calc2(formula, isPart2):
	formula = parse(formula)

	while formula.count(')'):
		end = formula.index(')')
		start = next( i for i in range(end, -1, -1) if formula[i] == '(' )
		formula = [*formula[:start], calc(formula[start+1:end], isPart2), *formula[end+1:]]
	return calc(formula, isPart2)

def main(rawInput, isPart2):
	return sum([ calc2(formula, isPart2) for formula in rawInput.split('\n')])

print('part1', main(lines, False))
print('part2', main(lines, True))