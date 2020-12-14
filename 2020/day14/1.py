import re
from collections import deque, defaultdict
from itertools import combinations, product

file = open("input.txt", "r")
lines = file.read()
file.close()

def calculate(val, mask):
	val2 = "{0:b}".format(val).zfill(len(mask))
	res = val
	index = 0
	length = len(val2)
	while index < length:
		strIndex = -index-1
		m = mask[strIndex]
		if m == 'x':
			continue
		v = 2 ** index
		if m == '0' and val2[strIndex] == '1':
			res -= v
		elif m == '1' and val2[strIndex] == '0':
			res += v
		index += 1
	return res
		

def part1(rawInputs):
	mem = defaultdict(int)
	mask = ''
	for line in rawInputs:
		com, value = line.split('= ')
		if com[1] == 'a':
			mask = value
		else:
			addr = re.search('\[(\d*)\]', com).group(1)
			mem[addr] = calculate(int(value), mask)

	print('answer is', sum(mem.values()))

def part1_opt(rawInputs):
	total = 0
	completed = []
	chunks = rawInputs.split('mask = ')
	while chunks:
		chunk = chunks.pop()
		if not chunk:
			continue
		mask, *comm = chunk.strip().split('\n')
		comm.reverse()
		for line in comm:
			com, value = line.split('= ')
			addr = re.search('\[(\d*)\]', com).group(1)
			if not addr in completed:
				total += calculate(int(value), mask)
				completed.append(addr)

	print('answer is (optimised)', total)

part1(lines.split("\n"))
part1_opt(lines)
