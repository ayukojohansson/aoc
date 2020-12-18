
import re
from collections import deque, defaultdict
from itertools import combinations, product

file = open("input.txt", "r")
lines = file.read()
file.close()

def calc(formula):
#	print('\t', formula)
	val, *rest = formula.strip().split(' ')
	res = int(val)
	while len(rest) > 1:
		opr, val, *rest = rest
#		print(opr, val)
		if opr == '+':
			res = res + int(val)
		elif opr == '*':
			res = res * int(val)
	
#	print(res)
	return str(res)

def findOpening(formula, end):
	for i in range(end):
		if formula[end - i] == '(':
			return end - i
	return 0

def calc2(formula):
	print(formula)
	
	while formula.count(')') > 0:
		end = formula.index(')')
		start = findOpening(formula, end)
#		print(start, end)
		formula = formula[:start] + calc(formula[start+1:end]) + formula[end+1:]
		print(formula)
	print(calc(formula))
	return calc(formula)

def main(rawInput):
	total = 0
	for formula in rawInput.split('\n'):
		total += int(calc2(formula))
		print('total', total)

test = '1 + 2 * 3 + 4 * 5 + 6' #71
test2 = '1 + (2 * 3) + (4 * (5 + 6))' #51
test3 = '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2' #51


main(lines)