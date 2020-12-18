
import re
from collections import deque, defaultdict
from itertools import combinations, product

file = open("input.txt", "r")
lines = file.read()
file.close()

# free from ()
def calc(formula):
	rest = formula
	while '+' in rest:
		i = rest.index('+')
		rest = rest[:i-1] + [rest[i - 1] + rest[i + 1]] + rest[i+2:]
	
	val, *rest = rest
	res = val
	while rest:
		opr, val, *rest = rest
		if opr == '+':
			res = res + val
		elif opr == '*':
			res = res * val
	
	return res

def findOpening(formula, end):
	for i in range(end+1):
		if formula[end - i] == '(':
			return end - i

def parse(string):
	return [x if x in '*+()' else int(x) for x in string if x != ' ' ]

# get rid of ()
def calc2(formula):
	formula = parse(formula)

	while formula.count(')'):
		end = formula.index(')')
		start = findOpening(formula, end)
		formula = formula[:start] + [calc(formula[start+1:end])] + formula[end+1:]
		print(formula)
	return calc(formula)

def main(rawInput):
	print('result is ', sum([ calc2(formula) for formula in rawInput.split('\n')]))

test = '2 * 3 + (4 * 5)' #46
test2 = '1 + (2 * 3) + (4 * (5 + 6))' #51
test3 = '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2' #23340

main(lines)