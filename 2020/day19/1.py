
import re
from collections import deque, defaultdict
from itertools import combinations, product

file = open("input.txt", "r")
lines = file.read()
file.close()

def parse(rules):
	res = {}
	done = set()
	toExpand = set()
	for rule in rules.split('\n'):
		rId, r = rule.split(': ')
		if '"' in r:
			res[rId] = r.replace('"', '')
			done.add(rId)
		else:
			res[rId] =[ [x for x in subR.split(' ')] for subR in r.split(' | ')]
			toExpand.add(rId)
			
	return res, done, toExpand

def main(rawInput):
	rules, messages = rawInput.split('\n\n')
	rulesDict, done, toExpand = parse(rules)

	while toExpand:
		canExpand = set([ key for key in toExpand if all([ x in done for rules in rulesDict[key] for x in rules ]) ])
		for key in canExpand:
			for rIndex in range(len(rulesDict[key])):
				expanded = [rulesDict[r] for r in rulesDict[key][rIndex]]
				rulesDict[key][rIndex] = ''.join(expanded)
			rulesDict[key] = '(' + '|'.join(rulesDict[key]) + ')'
			done.add(key)
			toExpand.remove(key)

	match = 0
	for message in messages.split('\n'):
		if re.fullmatch(rulesDict['0'], message):
			match += 1

	print('part1 answer is', match)

	rule8 = rulesDict['8']
	rule42 = rulesDict['42']
	rule31 = rulesDict['31']
	newRule8 = f'{rule8}+'
	newRule11 = '(' + '|'.join([ f'{rule42}{{{i}}}{rule31}{{{i}}}' for i in range(1,10)]) + ')'

	rulesDict['8'] = newRule8
	rulesDict['11'] = newRule11
	rulesDict['0'] = newRule8 + newRule11

	match = 0
	for message in messages.split('\n'):
		if re.fullmatch(rulesDict['0'], message):
			match += 1

	print('part2 answer is', match)
main(lines)
